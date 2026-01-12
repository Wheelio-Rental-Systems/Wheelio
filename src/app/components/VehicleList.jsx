import React, { useState } from 'react';
import VehicleCard from './VehicleCard';
import { Filter } from 'lucide-react';
import { vehicles } from '../data/vehicles';
import { VehicleDetailsDialog } from './VehicleDetailsDialog';

const VehicleList = ({ onBook }) => {
    // State for advanced filters
    const [filters, setFilters] = useState({
        type: 'all',
        brand: 'all',
        location: 'all',
        rating: 'all'
    });

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Extract unique values for dropdowns
    const brands = ['all', ...new Set(vehicles.map(v => v.brand))];
    const locations = ['all', ...new Set(vehicles.map(v => v.location))];
    const types = ['all', 'Car', 'Bike', 'Scooter', 'SUV', 'Sedan'];

    const filteredVehicles = vehicles.filter(v => {
        // Type Filter (Handle "Cars" grouping)
        const typeMatch = filters.type === 'all' ||
            (filters.type === 'Car' ? ['Hatchback', 'Sedan', 'SUV', 'MPV'].includes(v.type) : v.type === filters.type);

        // Brand Filter
        const brandMatch = filters.brand === 'all' || v.brand === filters.brand;

        // Location Filter
        const locationMatch = filters.location === 'all' || v.location === filters.location;

        // Rating Filter
        const ratingMatch = filters.rating === 'all' || v.rating >= parseFloat(filters.rating);

        return typeMatch && brandMatch && locationMatch && ratingMatch;
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleCardClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setDetailsOpen(true);
    };

    const handleBookFromDialog = () => {
        if (selectedVehicle) {
            onBook(selectedVehicle);
            setDetailsOpen(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header & Filters */}
            <div className="flex flex-col mb-12 gap-8">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Perfect Ride</span>
                    </h2>
                    <p className="text-gray-400 text-lg">Explore our collection of premium vehicles for your next adventure</p>
                </div>

                {/* Advanced Filter Bar */}
                <div className="bg-secondary/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-center">

                    {/* Type Filter */}
                    <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                        <Filter size={16} className="text-primary" />
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer [&>option]:bg-[#151520]"
                        >
                            <option value="all">All Types</option>
                            <option value="Car">Cars</option>
                            <option value="Bike">Bikes</option>
                            <option value="Scooter">Scooters</option>
                            <option value="SUV">SUVs</option>
                        </select>
                    </div>

                    {/* Brand Filter */}
                    <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-gray-400 text-sm">Brand:</span>
                        <select
                            value={filters.brand}
                            onChange={(e) => handleFilterChange('brand', e.target.value)}
                            className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer [&>option]:bg-[#151520]"
                        >
                            <option value="all">All Brands</option>
                            {brands.filter(b => b !== 'all').map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location Filter */}
                    <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-gray-400 text-sm">Location:</span>
                        <select
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                            className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer [&>option]:bg-[#151520]"
                        >
                            <option value="all">Anywhere</option>
                            {locations.filter(l => l !== 'all').map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>

                    {/* Rating Filter */}
                    <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-gray-400 text-sm">Rating:</span>
                        <select
                            value={filters.rating}
                            onChange={(e) => handleFilterChange('rating', e.target.value)}
                            className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer [&>option]:bg-[#151520]"
                        >
                            <option value="all">All Ratings</option>
                            <option value="4.5">4.5+ Stars</option>
                            <option value="4.8">4.8+ Stars</option>
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    <button
                        onClick={() => setFilters({ type: 'all', brand: 'all', location: 'all', rating: 'all' })}
                        className="ml-auto text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        onBook={() => handleCardClick(vehicle)}
                    />
                ))}
            </div>

            <VehicleDetailsDialog
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                vehicle={selectedVehicle}
                onBook={handleBookFromDialog}
            />
        </div>
    );
};

export default VehicleList;

import React, { useState } from 'react';
import { User, CreditCard, LayoutDashboard, Clock, Settings, LogOut, Car, Calendar, MapPin, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const Dashboard = ({ onNavigate, user, bookings = [] }) => {
    const [activeTab, setActiveTab] = useState('overview');

    // Use passed user prop or fallback to empty object to prevent errors
    const mockUser = user || {
        name: 'Guest',
        email: 'guest@example.com',
        memberSince: '---',
        licenseVerified: false
    };

    // Combine passed bookings with any other logic if needed, but for now just use props
    // Only show "Active Rental" if there is actually a booking
    const activeRental = bookings.length > 0 ? {
        vehicle: bookings[0].vehicle.name,
        image: bookings[0].vehicle.image,
        dates: bookings[0].date || 'Just Booked',
        status: 'Upcoming',
        pickup: bookings[0].vehicle.location || 'Coimbatore',
        timeLeft: 'Starts soon'
    } : null;

    const allBookings = bookings.map(b => ({
        vehicle: b.vehicle.name,
        date: b.date,
        cost: b.cost || '₹--',
        status: b.status || 'Upcoming',
        image: b.vehicle.image
    }));

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'My Rides', icon: Car },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        // Clear auth state logic here
        onNavigate('home');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    {/* User Profile Card */}
                    <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-cyan-500 p-[2px] mb-4">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                <User size={40} className="text-gray-400" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white">{mockUser.name}</h2>
                        <p className="text-sm text-gray-500 mb-2">{mockUser.email}</p>
                        {mockUser.licenseVerified ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20">
                                <Shield size={12} /> Verified Member
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20">
                                <AlertTriangle size={12} /> Verification Pending
                            </span>
                        )}
                    </div>

                    {/* Navigation Menu */}
                    <div className="bg-secondary/30 border border-white/5 rounded-3xl p-4 space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === item.id
                                    ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                                    <p className="text-gray-400">Welcome back! Ready for your next journey?</p>
                                </div>
                                <button
                                    onClick={() => onNavigate('vehicles')}
                                    className="bg-primary text-black px-6 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Book New Ride
                                </button>
                            </div>

                            {/* Active Rental Card */}
                            {activeRental ? (
                                <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 border border-white/10 rounded-3xl p-1 overflow-hidden">
                                    <div className="bg-black/40 rounded-[22px] p-6 md:p-8">
                                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            Current Active Rental
                                        </h3>

                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden relative">
                                                <img src={activeRental.image} alt={activeRental.vehicle} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                                    <span className="text-white font-bold">{activeRental.vehicle}</span>
                                                </div>
                                            </div>

                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-500">Pick-up Location</div>
                                                    <div className="text-gray-200 flex items-start gap-2">
                                                        <MapPin size={16} className="mt-1 text-primary shrink-0" />
                                                        {activeRental.pickup}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-500">Duration</div>
                                                    <div className="text-gray-200 flex items-center gap-2">
                                                        <Calendar size={16} className="text-primary" />
                                                        {activeRental.dates}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-500">Status</div>
                                                    <span className="inline-block px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-lg border border-green-500/20">
                                                        On Trip
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm text-gray-500">Time Remaining</div>
                                                    <div className="text-white font-mono text-lg flex items-center gap-2">
                                                        <Clock size={16} className="text-yellow-500" />
                                                        {activeRental.timeLeft}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                                            <button
                                                onClick={() => onNavigate('contact')}
                                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-xl font-bold transition-colors border border-red-500/20"
                                            >
                                                Report Issue
                                            </button>
                                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-colors border border-white/10">
                                                Extend Trip
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-secondary/20 border border-white/5 rounded-3xl p-12 text-center text-gray-400">
                                    <Car size={48} className="mx-auto mb-4 text-gray-600" />
                                    <h3 className="text-xl font-bold text-white mb-2">No Active Rentals</h3>
                                    <p className="mb-6">You don't have any upcoming trips scheduled.</p>
                                    <button
                                        onClick={() => onNavigate('vehicles')}
                                        className="bg-primary text-black px-6 py-2 rounded-xl font-bold hover:bg-cyan-400 transition-colors"
                                    >
                                        Book a Ride
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* BOOKINGS TAB */}
                    {activeTab === 'bookings' && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-2xl font-bold text-white">Ride History</h2>
                            <div className="space-y-4">
                                {allBookings.map((booking, i) => (
                                    <div key={i} className="bg-secondary/20 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-secondary/30 transition-colors">
                                        <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                                            <img src={booking.image} alt={booking.vehicle} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 w-full text-center md:text-left">
                                            <h4 className="text-lg font-bold text-white">{booking.vehicle}</h4>
                                            <div className="text-gray-400 text-sm mt-1">{booking.date}</div>
                                        </div>
                                        <div className="text-right flex flex-row md:flex-col justify-between w-full md:w-auto items-center md:items-end">
                                            <div className="text-xl font-bold text-primary">{booking.cost}</div>
                                            <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-xs font-medium border border-white/10 mt-1">
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
                            <div className="bg-secondary/20 border border-white/5 rounded-2xl p-8 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">Full Name</label>
                                        <input type="text" defaultValue={mockUser.name} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">Email Address</label>
                                        <input type="email" defaultValue={mockUser.email} disabled className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">Phone Number</label>
                                        <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">City</label>
                                        <input type="text" defaultValue="Coimbatore" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <button className="bg-primary text-black px-8 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </div>

                            <div className="bg-secondary/20 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-white font-bold mb-4">Driving License</h3>
                                <div className="border-2 border-dashed border-green-500/30 bg-green-500/5 rounded-xl p-6 text-center">
                                    <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
                                    <p className="text-white font-medium">License Verified</p>
                                    <p className="text-sm text-gray-500 mt-1">Ready for bookings</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            <h2 className="text-2xl font-bold text-white">App Preferences</h2>
                            <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6">
                                <p className="text-gray-400">Settings configuration coming soon...</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;

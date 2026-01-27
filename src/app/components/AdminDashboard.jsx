import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, ClipboardCheck, Tag, Plus, CheckCircle, XCircle, Settings, Camera, Clock, User, Car } from 'lucide-react';
import CancelRideDialog from './CancelRideDialog';
import ExtendTripDialog from './ExtendTripDialog';

const AdminDashboard = ({ onNavigate, onAddVehicle }) => {
    const [activeTab, setActiveTab] = useState('bookings');

    // New Vehicle Form State
    const [newVehicle, setNewVehicle] = useState({
        name: '', brand: '', type: 'Car', price: '', location: '', rating: '4.5',
        details: { mileage: '', engine: '', power: '', topSpeed: '', fuelTank: '' },
        features: '', description: '',
        images: ['', '', '', ''] // 4 Image URLs
    });

    const handleVehicleSubmit = (e) => {
        e.preventDefault();
        const vehicleData = {
            ...newVehicle,
            id: Date.now(),
            price: parseInt(newVehicle.price),
            rating: parseFloat(newVehicle.rating),
            features: newVehicle.features.split(',').map(f => f.trim()),
            image: newVehicle.images[0] || '/images/swift.jpeg', // Default or first image
            reviews: 0,
            status: 'available',
            seats: 5, // Default
            fuelType: 'Petrol', // Default or add input
            transmission: 'Manual', // Default or add input
        };
        onAddVehicle(vehicleData);
        alert('Vehicle added to fleet successfully!');
        setNewVehicle({
            name: '', brand: '', type: 'Car', price: '', location: '', rating: '4.5',
            details: { mileage: '', engine: '', power: '', topSpeed: '', fuelTank: '' },
            features: '', description: '',
            images: ['', '', '', '']
        });
    };

    // Bookings State
    const [bookings, setBookings] = useState([]);

    // Host Requests State
    const [hostRequests, setHostRequests] = useState([]);

    // Damage Reports State
    const [damageReports, setDamageReports] = useState([]);
    const [costInputs, setCostInputs] = useState({}); // Stores cost input for each report ID

    useEffect(() => {
        // Load bookings
        const storedBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
        setBookings(storedBookings);

        const storedRequests = JSON.parse(localStorage.getItem('hostRequests') || '[]');
        setHostRequests(storedRequests);

        const storedReports = JSON.parse(localStorage.getItem('damageReports') || '[]');
        setDamageReports(storedReports);
    }, []);

    const handleConfirmCancel = (data) => {
        if (!selectedBooking) return;

        const updatedBookings = bookings.map(b =>
            b.id === selectedBooking ? { ...b, status: 'Cancelled' } : b
        );

        setBookings(updatedBookings);
        localStorage.setItem('allBookings', JSON.stringify(updatedBookings));
        setIsCancelOpen(false);
        setSelectedBooking(null);
    };





    const updateHostRequestStatus = (id, newStatus) => {
        let updatedRequests;
        if (newStatus === 'Rejected') {
            updatedRequests = hostRequests.filter(req => req.id !== id);
        } else {
            updatedRequests = hostRequests.map(req =>
                req.id === id ? { ...req, status: newStatus } : req
            );
        }
        setHostRequests(updatedRequests);
        localStorage.setItem('hostRequests', JSON.stringify(updatedRequests));
    };

    const handleCostSubmit = (id) => {
        const cost = costInputs[id];
        if (!cost) return;

        const updatedReports = damageReports.map(report =>
            report.id === id ? { ...report, status: 'Estimated', estimatedCost: cost } : report
        );
        setDamageReports(updatedReports);
        localStorage.setItem('damageReports', JSON.stringify(updatedReports));

        // Clear input
        setCostInputs(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    // TASKS: Pricing Rules Data (Mock)
    const [pricingRules, setPricingRules] = useState([
        { id: 1, name: 'Weekend Surge', description: 'Friday-Sunday +20%', status: 'active' },
        { id: 2, name: 'Holiday Special', description: 'Festival days +30%', status: 'active' },
        { id: 3, name: 'Early Bird', description: '30 days advance -15%', status: 'inactive' },
    ]);

    const toggleRuleStatus = (id) => {
        setPricingRules(prev => prev.map(rule =>
            rule.id === id ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' } : rule
        ));
    };

    const updateInspectionStatus = (id, newStatus) => {
        setInspections(prev => prev.map(insp =>
            insp.id === id ? { ...insp, status: newStatus } : insp
        ));
    };

    const addNewRule = () => {
        const newRule = {
            id: Date.now(),
            name: 'New Pricing Rule',
            description: 'Custom adjustment +10%',
            status: 'inactive'
        };
        setPricingRules(prev => [...prev, newRule]);
    };

    // Dialog States
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isExtendOpen, setIsExtendOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleCancelClick = (bookingId) => {
        setSelectedBooking(bookingId);
        setIsCancelOpen(true);
    };

    const handleExtendClick = (booking) => {
        setSelectedBooking(booking);
        setIsExtendOpen(true);
    };



    const handleConfirmExtend = (data) => {
        console.log("Admin Extended Trip:", data);
        // Implement extension logic here
    };

    return (
        <div className="min-h-screen bg-background pt-24 px-4 pb-12 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage fleet operations, inspections, and revenue.</p>
                    </div>
                    <button
                        onClick={() => onNavigate('home')}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 md:gap-4 p-1 bg-secondary/30 backdrop-blur-md rounded-2xl border border-white/10 mb-8 max-w-fit">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === 'bookings' ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Calendar size={18} />
                        Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('fleet')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === 'fleet' ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Car size={18} />
                        Fleet Management
                    </button>
                    <button
                        onClick={() => setActiveTab('inspections')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === 'inspections' ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <ClipboardCheck size={18} />
                        Inspections
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === 'pricing' ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Tag size={18} />
                        Pricing
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${activeTab === 'requests' ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Car size={18} />
                        Host Requests
                    </button>
                </div>

                {/* Content Area */}
                <div className="bg-secondary/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 min-h-[500px]">

                    {/* BOOKINGS TAB */}
                    {activeTab === 'bookings' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold text-white mb-4">Bookings Management</h3>
                            <div className="space-y-4">
                                {bookings.length === 0 ? (
                                    <div className="text-gray-400 text-center py-10">No bookings found.</div>
                                ) : (
                                    bookings.map((booking) => (
                                        <div key={booking.id} className={`bg-card/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${booking.status === 'Cancelled' ? 'opacity-50 grayscale' : 'hover:border-primary/20'}`}>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-bold text-white text-lg">{booking.vehicleName || 'Vehicle'}</h4>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${booking.status === 'active' || booking.status === 'Upcoming' ? 'bg-green-500/20 text-green-400' : booking.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                        {booking.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    <span className="block mb-1">Customer: <span className="text-gray-300">{booking.userName || 'Guest'}</span></span>
                                                    <span>ID: {booking.id}</span>
                                                </div>
                                            </div>

                                            <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-0 mt-2 md:mt-0 w-full md:w-auto justify-between md:justify-start">
                                                <div className="text-left md:text-right">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Duration</p>
                                                    <p className="text-sm text-gray-300">{booking.date || 'Dates not set'}</p>
                                                </div>
                                                <div className="text-right mt-0 md:mt-4">
                                                    <span className="text-2xl font-bold text-cyan-400">{booking.cost || '₹0'}</span>
                                                    <span className="block text-xs text-gray-500">Total</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {booking.status !== 'Cancelled' && (
                                                <div className="flex items-center gap-2 mt-4 md:mt-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4">
                                                    <button
                                                        onClick={() => handleCancelClick(booking.id)}
                                                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                        title="Cancel Ride"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleExtendClick(booking)}
                                                        className="p-2 bg-cyan-500/10 text-cyan-500 rounded-lg hover:bg-cyan-500/20 transition-colors"
                                                        title="Extend Trip"
                                                    >
                                                        <Clock size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* INSPECTIONS TAB */}
                    {activeTab === 'inspections' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold text-white mb-4">Damage Reports & Inspections</h3>

                            {/* NEW: User Damage Reports */}
                            <div className="space-y-4 mb-8">
                                <h4 className="text-lg font-semibold text-gray-300 mb-2">User Reported Damages</h4>
                                {damageReports.length === 0 ? (
                                    <p className="text-gray-500">No user reports found.</p>
                                ) : (
                                    damageReports.map((report) => (
                                        <div key={report.id} className="bg-card/50 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">Report #{report.id}</h4>
                                                    <p className="text-xs text-gray-500">User: {report.userName} ({report.userId}) • {new Date(report.submittedAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${report.status === 'Estimated' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {report.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Details</p>
                                                    <p className="text-gray-300 text-sm"><span className="text-gray-500">Location:</span> {report.location}</p>
                                                    <p className="text-gray-300 text-sm"><span className="text-gray-500">Severity:</span> {report.severity}</p>
                                                    <p className="text-gray-300 text-sm mt-2 p-2 bg-white/5 rounded text-italic">"{report.description}"</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Evidence</p>
                                                    {report.vehiclePhotos && report.vehiclePhotos.length > 0 ? (
                                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                                            {report.vehiclePhotos.map((photo, idx) => (
                                                                <img key={idx} src={photo} alt="damage" className="h-24 w-24 object-cover rounded-lg border border-white/10" />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">No photos uploaded</span>
                                                    )}
                                                </div>
                                            </div>

                                            {report.status === 'Pending' ? (
                                                <div className="flex items-end gap-3 pt-4 border-t border-white/5 bg-secondary/10 p-4 rounded-xl">
                                                    <div className="flex-1">
                                                        <label className="text-xs text-gray-400 mb-1 block">Cost Estimation (₹)</label>
                                                        <input
                                                            type="number"
                                                            placeholder="Enter amount"
                                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                                            value={costInputs[report.id] || ''}
                                                            onChange={(e) => setCostInputs(prev => ({ ...prev, [report.id]: e.target.value }))}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleCostSubmit(report.id)}
                                                        className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                                                    >
                                                        Send Estimate
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                                    <span className="text-gray-400 text-sm">Estimated Cost Sent</span>
                                                    <span className="text-xl font-bold text-orange-400">₹{report.estimatedCost}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>


                        </div>
                    )}

                    {/* PRICING TAB */}
                    {activeTab === 'pricing' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Dynamic Pricing Rules</h3>
                                <button
                                    onClick={addNewRule}
                                    className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 transition-colors active:scale-95"
                                >
                                    <Plus size={18} /> Add Rule
                                </button>
                            </div>

                            <div className="space-y-4">
                                {pricingRules.map((rule) => (
                                    <div key={rule.id} className="bg-card/50 border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-primary/20 transition-all">
                                        <div>
                                            <h4 className="font-bold text-white text-lg mb-1">{rule.name}</h4>
                                            <p className="text-gray-400 text-sm">{rule.description}</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${rule.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {rule.status}
                                            </span>
                                            <button
                                                onClick={() => toggleRuleStatus(rule.id)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                            >
                                                <Settings size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* HOST REQUESTS TAB */}
                    {activeTab === 'requests' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold text-white mb-4">Vehicle Hosting Requests</h3>
                            <div className="space-y-4">
                                {hostRequests.length === 0 ? (
                                    <div className="text-gray-400 text-center py-10">No pending host requests.</div>
                                ) : (
                                    hostRequests.map((req) => (
                                        <div key={req.id} className="bg-card/50 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{req.make} {req.model} ({req.year})</h4>
                                                    <p className="text-xs text-gray-500">Request ID: {req.id} • Submitted: {new Date(req.submittedAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${req.status === 'Approved' ? 'bg-green-500/20 text-green-400' : req.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {req.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Details</p>
                                                    <div className="text-sm text-gray-300 space-y-1">
                                                        <p>Fuel: {req.fuelType}</p>
                                                        <p>Location: {req.location}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Documents</p>
                                                    <div className="flex gap-2 mt-2">
                                                        {req.rcBook && (
                                                            <a href={req.rcBook} download={`rc_${req.id}`} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 text-cyan-400">View RC Book</a>
                                                        )}
                                                        {req.license && (
                                                            <a href={req.license} download={`license_${req.id}`} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 text-cyan-400">View License</a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {req.vehiclePhotos && req.vehiclePhotos.length > 0 && (
                                                <div className="mb-6">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Vehicle Photos</p>
                                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                                        {req.vehiclePhotos.map((photo, idx) => (
                                                            <img key={idx} src={photo} alt={`Vehicle ${idx}`} className="h-20 w-32 object-cover rounded-lg border border-white/10" />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {req.status === 'Pending' && (
                                                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                                    <button
                                                        onClick={() => updateHostRequestStatus(req.id, 'Approved')}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-sm font-bold transition-colors"
                                                    >
                                                        <CheckCircle size={16} /> Approve Listing
                                                    </button>
                                                    <button
                                                        onClick={() => updateHostRequestStatus(req.id, 'Rejected')}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-bold transition-colors"
                                                    >
                                                        <XCircle size={16} /> Decline
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Dialogs */}
            <CancelRideDialog
                isOpen={isCancelOpen}
                onClose={() => setIsCancelOpen(false)}
                onConfirm={handleConfirmCancel}
                bookingId={selectedBooking}
            />

            <ExtendTripDialog
                isOpen={isExtendOpen}
                onClose={() => setIsExtendOpen(false)}
                onConfirm={handleConfirmExtend}
                currentEndDate={selectedBooking?.dates?.split(' to ')[1] || 'Unknown'}
            />
        </div >
    );
};

export default AdminDashboard;

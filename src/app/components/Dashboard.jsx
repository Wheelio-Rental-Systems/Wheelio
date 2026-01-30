import React, { useState, useEffect } from 'react';
import { User, CreditCard, LayoutDashboard, Clock, LogOut, Car, Calendar, MapPin, Shield, CheckCircle, AlertTriangle, Bell, Lock, Globe, ChevronRight, FileText, Download, FileCheck, Camera } from 'lucide-react';
import CancelRideDialog from './CancelRideDialog';
import ExtendTripDialog from './ExtendTripDialog';

const Dashboard = ({ onNavigate, user, bookings = [], onUpdateBooking, onCancelBooking, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [hostedVehicles, setHostedVehicles] = useState([]);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: '+91 98765 43210',
        city: 'Coimbatore',
        documents: {}
    });

    const [profileImage, setProfileImage] = useState(() => {
        return localStorage.getItem('userProfileImage') || null;
    });

    const handleProfileImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setProfileImage(result);
                localStorage.setItem('userProfileImage', result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '+91 98765 43210',
                city: user.city || 'Coimbatore'
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchHostedVehicles = () => {
            let allRequests = [];
            try {
                allRequests = JSON.parse(localStorage.getItem('hostRequests') || '[]');
            } catch (e) {
                console.error("Error parsing hostRequests", e);
                allRequests = [];
            }
            if (user?.email) {
                const userRequests = allRequests.filter(req => req.userId === user.email);
                setHostedVehicles(userRequests);
            }
        };
        fetchHostedVehicles();
    }, [user]);

    const handleProfileUpdate = () => {
        if (onUpdateUser) {
            onUpdateUser({
                name: profileData.name,
                phone: profileData.phone,
                city: profileData.city
            });
            // Toast notification is handled in App.jsx
        }
    };

    const [documents, setDocuments] = useState(() => {
        try {
            const saved = localStorage.getItem('userDocuments');
            return saved ? JSON.parse(saved) : {
                license: { status: 'Pending', url: null, number: '', expiry: '' },
                aadhaar: { status: 'Pending', url: null, number: '', expiry: '' }
            };
        } catch (e) {
            return {
                license: { status: 'Pending', url: null, number: '', expiry: '' },
                aadhaar: { status: 'Pending', url: null, number: '', expiry: '' }
            };
        }
    });

    useEffect(() => {
        localStorage.setItem('userDocuments', JSON.stringify(documents));
    }, [documents]);

    const handleFileUpload = (type, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDocuments(prev => ({
                    ...prev,
                    [type]: {
                        ...prev[type],
                        status: 'Uploaded',
                        url: reader.result,
                        fileName: file.name
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeDocument = (type) => {
        setDocuments(prev => ({
            ...prev,
            [type]: { ...prev[type], status: 'Pending', url: null, fileName: '' }
        }));
    };

    const [userDamageReports, setUserDamageReports] = useState([]);

    useEffect(() => {
        let storedReports = [];
        try {
            storedReports = JSON.parse(localStorage.getItem('damageReports') || '[]');
        } catch (e) { storedReports = []; }
        if (user && user.email) {
            setUserDamageReports(storedReports.filter(r => r.userId === user.email));
        } else {
            setUserDamageReports(storedReports);
        }
    }, [user]);

    const mockUser = user || {
        name: 'Guest',
        email: 'guest@example.com',
        memberSince: '---',
        licenseVerified: false
    };

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

    const invoices = allBookings.map((b, i) => ({
        id: `INV-${2024001 + i}`,
        date: b.date && b.date.includes(' ') ? b.date.split(' ')[0] : (b.date || new Date().toLocaleDateString()),
        amount: b.cost,
        vehicle: b.vehicleName || b.vehicle,
        status: b.status === 'Cancelled' ? 'Refunded' : 'Paid'
    }));

    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isExtendOpen, setIsExtendOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    const handleCancelRide = (bookingId) => {
        setBookingToCancel(bookingId);
        setIsCancelOpen(true);
    };

    const handleConfirmCancel = (data) => {
        if (onCancelBooking && bookingToCancel) {
            onCancelBooking(bookingToCancel);
        }
        setIsCancelOpen(false);
    };

    const handleExtendTrip = () => {
        setIsExtendOpen(true);
    };

    const handleConfirmExtend = (data) => {
        if (onUpdateBooking && bookings.length > 0) {
            const currentBooking = bookings[0];
            const newEndDate = data.newEndDate || "Extended";
            onUpdateBooking({
                id: currentBooking.id,
                date: `${currentBooking.date.split(' to ')[0]} to ${newEndDate}`,
                cost: `₹${parseInt(currentBooking.cost?.replace('₹', '') || 0) + data.additionalCost}`,
                status: 'Extended'
            });
        }
        setIsExtendOpen(false);
    };

    const renderDocuments = () => (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold text-white">My Documents</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Driving License */}
                <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                <Car size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Driving License</h3>
                                <p className="text-gray-400 text-sm">Upload front side</p>
                            </div>
                        </div>
                        {documents.license.status === 'Uploaded' && (
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20 flex items-center gap-1">
                                <Clock size={12} /> Pending Verification
                            </span>
                        )}
                    </div>

                    {documents.license.url ? (
                        <div className="aspect-video bg-black/40 rounded-xl mb-4 overflow-hidden border border-white/5 relative group-hover:border-primary/20 transition-colors">
                            <img src={documents.license.url} alt="License" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="aspect-video bg-black/40 rounded-xl mb-4 overflow-hidden border border-white/5 border-dashed border-gray-700 flex flex-col items-center justify-center relative hover:bg-white/5 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileUpload('license', e)}
                            />
                            <div className="flex flex-col items-center text-gray-500">
                                <FileText size={32} className="mb-2 opacity-50" />
                                <span className="text-sm font-medium">Click to Upload</span>
                                <span className="text-xs opacity-50 mt-1">JPG, PNG up to 5MB</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="text-sm text-gray-400 font-mono truncate max-w-[150px]">
                            {documents.license.fileName || 'No file selected'}
                        </div>
                        {documents.license.url ? (
                            <button
                                onClick={() => removeDocument('license')}
                                className="text-red-400 text-sm font-bold hover:underline flex items-center gap-1"
                            >
                                <LogOut size={16} className="rotate-180" /> Remove
                            </button>
                        ) : (
                            <label className="text-primary text-sm font-bold hover:underline flex items-center gap-1 cursor-pointer">
                                <Download size={16} className="rotate-180" /> Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload('license', e)}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* ID Proof (Aadhaar) */}
                <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">ID Proof (Aadhar)</h3>
                                <p className="text-gray-400 text-sm">Government Issued ID</p>
                            </div>
                        </div>
                        {documents.aadhaar.status === 'Uploaded' && (
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20 flex items-center gap-1">
                                <Clock size={12} /> Pending Verification
                            </span>
                        )}
                    </div>

                    {documents.aadhaar.url ? (
                        <div className="aspect-video bg-black/40 rounded-xl mb-4 overflow-hidden border border-white/5 relative group-hover:border-cyan-500/20 transition-colors">
                            <img src={documents.aadhaar.url} alt="Aadhar" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="aspect-video bg-black/40 rounded-xl mb-4 overflow-hidden border border-white/5 border-dashed border-gray-700 flex flex-col items-center justify-center relative hover:bg-white/5 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => handleFileUpload('aadhaar', e)}
                            />
                            <div className="flex flex-col items-center text-gray-500">
                                <FileText size={32} className="mb-2 opacity-50" />
                                <span className="text-sm font-medium">Click to Upload</span>
                                <span className="text-xs opacity-50 mt-1">JPG, PNG up to 5MB</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="text-sm text-gray-400 font-mono truncate max-w-[150px]">
                            {documents.aadhaar.fileName || 'No file selected'}
                        </div>
                        {documents.aadhaar.url ? (
                            <button
                                onClick={() => removeDocument('aadhaar')}
                                className="text-red-400 text-sm font-bold hover:underline flex items-center gap-1"
                            >
                                <LogOut size={16} className="rotate-180" /> Remove
                            </button>
                        ) : (
                            <label className="text-cyan-400 text-sm font-bold hover:underline flex items-center gap-1 cursor-pointer">
                                <Download size={16} className="rotate-180" /> Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload('aadhaar', e)}
                                />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderHostedVehicles = () => (
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pointer-events-auto">
            <h2 className="text-2xl font-bold text-white">My Hosted Vehicles</h2>
            {hostedVehicles.length > 0 ? (
                <div className="space-y-4">
                    {hostedVehicles.map((vehicle, i) => (
                        <div key={i} className="bg-secondary/20 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-secondary/30 transition-colors">
                            <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0 bg-black/40 flex items-center justify-center">
                                {vehicle.vehiclePhotos && vehicle.vehiclePhotos.length > 0 ? (
                                    <img src={vehicle.vehiclePhotos[0]} alt={vehicle.model} className="w-full h-full object-cover" />
                                ) : (
                                    <Car size={32} className="text-gray-600" />
                                )}
                            </div>
                            <div className="flex-1 w-full text-center md:text-left">
                                <h4 className="text-lg font-bold text-white">{vehicle.make} {vehicle.model} ({vehicle.year})</h4>
                                <div className="text-gray-400 text-sm mt-1">{vehicle.location}</div>
                            </div>
                            <div className="text-right flex flex-row md:flex-col justify-between w-full md:w-auto items-center md:items-end">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${vehicle.status === 'Approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                    {vehicle.status || 'Pending'}
                                </span>
                                <div className="text-xs text-gray-500 mt-2">
                                    Submitted: {new Date(vehicle.submittedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-secondary/20 border border-white/5 rounded-3xl p-12 text-center text-gray-400">
                    <Car size={48} className="mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bold text-white mb-2">No Hosted Vehicles</h3>
                    <p className="mb-6">You haven't listed any vehicles yet.</p>
                    <button
                        onClick={() => onNavigate('become-host')}
                        className="bg-primary text-black px-6 py-2 rounded-xl font-bold hover:bg-cyan-400 transition-colors"
                    >
                        Become a Host
                    </button>
                </div>
            )}
        </div>
    );

    const renderBilling = () => (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold text-white">Billing & Invoices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                    <h3 className="text-2xl font-bold text-white">
                        ₹{invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + parseInt(curr.amount.replace(/\D/g, '') || 0), 0).toLocaleString()}
                    </h3>
                </div>
                <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6">
                    <p className="text-gray-400 text-sm mb-1">Last Payment</p>
                    <h3 className="text-2xl font-bold text-white">{invoices[0]?.amount || '₹0'}</h3>
                    <p className="text-xs text-green-500 mt-1">Paid on {invoices[0]?.date || '---'}</p>
                </div>
                <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
                    <div>
                        <p className="text-gray-400 text-sm">Payment Method</p>
                        <h3 className="text-white font-bold text-lg mt-1">**** 4589</h3>
                    </div>
                    <CreditCard size={24} className="text-gray-400" />
                </div>
            </div>

            <div className="bg-secondary/20 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-white font-bold">Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-sm">
                                <th className="p-4 font-medium">Invoice ID</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Vehicle</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {invoices.length > 0 ? invoices.map((invoice, idx) => (
                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-mono text-gray-300">{invoice.id}</td>
                                    <td className="p-4 text-gray-300">{invoice.date}</td>
                                    <td className="p-4 text-white font-medium">{invoice.vehicle}</td>
                                    <td className="p-4 text-white font-bold">{invoice.amount}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${invoice.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No invoices found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'My Rides', icon: Car },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const handleLogout = () => {
        onNavigate('home');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    {/* User Profile Card */}
                    <div className="bg-secondary/30 border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-cyan-500 p-[2px] mb-4">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-gray-400" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleProfileImageUpload}
                            />
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
                                                onClick={() => handleCancelRide(bookings[0]?.id || 'mock-id')}
                                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 rounded-xl font-bold transition-colors border border-red-500/20"
                                            >
                                                Cancel Ride
                                            </button>
                                            <button
                                                onClick={handleExtendTrip}
                                                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-colors border border-white/10"
                                            >
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

                            {/* Hosted Vehicles Section in Overview */}
                            {user?.email && renderHostedVehicles()}

                            {/* Damage Reports Section - Overview */}
                            {userDamageReports.length > 0 && (
                                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <AlertTriangle className="text-yellow-500" /> Damage Reports & Alerts
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {userDamageReports.map((report) => (
                                            <div key={report.id} className="bg-secondary/20 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/20 transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-white">Incident at {report.location}</h4>
                                                        <p className="text-xs text-gray-500">{new Date(report.submittedAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${report.status === 'Estimated' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                        {report.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{report.description}</p>
                                                {report.estimatedCost > 0 && (
                                                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-pulse">
                                                        <p className="text-xs text-red-400 uppercase font-bold mb-1">Damage Assessment Cost</p>
                                                        <div className="text-2xl font-bold text-white">₹{report.estimatedCost}</div>
                                                        <p className="text-xs text-gray-400 mt-1">Please pay this amount to clear your dues.</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">Email Address</label>
                                        <input type="email" defaultValue={mockUser.email} disabled className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">City</label>
                                        <input
                                            type="text"
                                            value={profileData.city}
                                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="bg-primary text-black px-8 py-3 rounded-xl font-bold hover:bg-cyan-400 transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>

                            <div className="bg-secondary/20 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-white font-bold mb-4">Driving License</h3>
                                <div className="border-2 border-dashed border-green-500/30 bg-green-500/5 rounded-xl p-6 text-center">
                                    <CheckCircle className={`mx-auto mb-2 ${documents.license.status === 'Verified' ? 'text-green-500' : 'text-gray-500'}`} size={32} />
                                    <p className="text-white font-medium">{documents.license.status === 'Verified' ? 'License Verified' : 'License Status: ' + documents.license.status}</p>
                                    <p className="text-sm text-gray-500 mt-1">{documents.license.status === 'Verified' ? 'Ready for bookings' : 'Upload your license in Documents tab'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DOCUMENTS TAB */}
                    {activeTab === 'documents' && renderDocuments()}

                    {/* BILLING TAB */}
                    {activeTab === 'billing' && renderBilling()}
                </div>
            </div>

            {/* Dialogs */}
            <CancelRideDialog
                isOpen={isCancelOpen}
                onClose={() => setIsCancelOpen(false)}
                onConfirm={handleConfirmCancel}
                bookingId={bookingToCancel}
            />

            <ExtendTripDialog
                isOpen={isExtendOpen}
                onClose={() => setIsExtendOpen(false)}
                onConfirm={handleConfirmExtend}
                currentEndDate={activeRental?.dates}
            />
        </div>
    );
};

export default Dashboard;

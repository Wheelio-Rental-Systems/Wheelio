import React, { useState } from 'react';
import { User, CreditCard, LayoutDashboard, Clock, Settings, LogOut, Car, Calendar, MapPin, Shield, CheckCircle, AlertTriangle, Bell, Lock, Globe, ChevronRight, Moon, HelpCircle, FileText } from 'lucide-react';
import CancelRideDialog from './CancelRideDialog';
import ExtendTripDialog from './ExtendTripDialog';


const Dashboard = ({ onNavigate, user, bookings = [], onUpdateBooking, onCancelBooking }) => {
    const [activeTab, setActiveTab] = useState('overview');

    // Settings Sub-view State
    const [settingsView, setSettingsView] = useState('main'); // main, password, language, help, privacy
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const [expandedFaq, setExpandedFaq] = useState(null);
    const [userDamageReports, setUserDamageReports] = useState([]);

    React.useEffect(() => {
        const storedReports = JSON.parse(localStorage.getItem('damageReports') || '[]');
        // Filter for current user if user prop is present and has email, else for demo show all or none
        // For this demo, let's show all since we are simulating the same browser session
        if (user && user.email) {
            setUserDamageReports(storedReports.filter(r => r.userId === user.email));
        } else {
            // Fallback for unauth user viewing demo dashboard or just empty
            setUserDamageReports(storedReports);
        }
    }, [user]);

    const handlePasswordUpdate = () => {
        if (passwordForm.new !== passwordForm.confirm) {
            alert("New passwords do not match!");
            return;
        }
        if (!passwordForm.current || !passwordForm.new) {
            alert("Please fill in all fields.");
            return;
        }
        // Simulate API call
        setTimeout(() => {
            setPasswordSuccess(true);
            setPasswordForm({ current: '', new: '', confirm: '' });
        }, 500);
    };


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

    // State for toggles
    const [notifications, setNotifications] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);

    // Dialog States
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isExtendOpen, setIsExtendOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    const handleCancelRide = (bookingId) => {
        setBookingToCancel(bookingId);
        setIsCancelOpen(true);
    };

    const handleConfirmCancel = (data) => {
        console.log("Ride Cancelled:", data);
        if (onCancelBooking && bookingToCancel) {
            onCancelBooking(bookingToCancel);
        }
        setIsCancelOpen(false);
    };

    const handleExtendTrip = () => {
        setIsExtendOpen(true);
    };

    const handleConfirmExtend = (data) => {
        console.log("Trip Extended:", data);
        if (onUpdateBooking && bookings.length > 0) {
            // Calculate new date range string
            // Current dates: "22/01/2026 - 25/01/2026" or similar
            // This is a rough estimation for demo purposes
            const currentBooking = bookings[0];
            const newEndDate = data.newEndDate || "Extended";

            // Assuming date format is kept in 'date' field as a string mostly
            // We just append " (Extended)" for visual feedback in this demo if parsing is hard

            onUpdateBooking({
                id: currentBooking.id,
                date: `${currentBooking.date.split(' to ')[0]} to ${newEndDate}`,
                cost: `₹${parseInt(currentBooking.cost?.replace('₹', '') || 0) + data.additionalCost}`,
                status: 'Extended'
            });
        }
    };

    // Removed placeholder handlers to avoid conflicts

    const ChevronLeft = ({ size = 24, className = "" }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m15 18-6-6 6-6" />
        </svg>
    );



    const renderChangePassword = () => (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 space-y-6 animate-in slide-in-from-right">
            <button onClick={() => { setSettingsView('main'); setPasswordSuccess(false); }} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                <ChevronLeft size={20} /> Back
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>

            {passwordSuccess ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-8 text-center animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Password Changed!</h4>
                    <p className="text-gray-400">Your password has been successfully updated.</p>
                    <button
                        onClick={() => setSettingsView('main')}
                        className="mt-6 bg-secondary hover:bg-white/10 text-white px-6 py-2 rounded-xl border border-white/10 transition-colors"
                    >
                        Return to Settings
                    </button>
                </div>
            ) : (
                <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm">Current Password</label>
                        <input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm">New Password</label>
                        <input
                            type="password"
                            value={passwordForm.new}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm">Confirm New Password</label>
                        <input
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                            placeholder="Re-enter new password"
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            onClick={handlePasswordUpdate}
                            className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-cyan-400 transition-colors shadow-lg shadow-primary/20"
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderLanguage = () => (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 space-y-6 animate-in slide-in-from-right">
            <button onClick={() => setSettingsView('main')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                <ChevronLeft size={20} /> Back
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Language Selection</h3>

            <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary">
                            <Globe size={20} />
                        </div>
                        <span className="text-white font-medium">English (United States)</span>
                    </div>
                    <CheckCircle size={20} className="text-primary" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                            <Globe size={20} />
                        </div>
                        <span className="text-gray-400 font-medium">Hindi (Coming Soon)</span>
                    </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                            <Globe size={20} />
                        </div>
                        <span className="text-gray-400 font-medium">Tamil (Coming Soon)</span>
                    </div>
                </button>
            </div>
        </div>
    );

    const renderHelpCenter = () => {
        const faqData = [
            {
                question: 'How do I cancel my booking?',
                answer: 'You can cancel your booking from the "My Rides" section. Cancellations made 24 hours before the trip start time are fully refundable.'
            },
            {
                question: 'What documents are required?',
                answer: 'A valid Driving License and a Government-issued ID proof (Aadhar Card/Passport) are required at the time of pickup.'
            },
            {
                question: 'Is fuel included in the price?',
                answer: 'No, fuel is not included. You will receive the vehicle with a certain fuel level and must return it with the same level. Excess fuel is not reimbursed.'
            }
        ];

        return (
            <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 space-y-6 animate-in slide-in-from-right">
                <button onClick={() => setSettingsView('main')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                    <ChevronLeft size={20} /> Back
                </button>
                <h3 className="text-xl font-bold text-white mb-6">Help Center</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center space-y-4 hover:border-primary/50 transition-colors group">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                            <div className="text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">Call Support</h4>
                            <p className="text-gray-500 text-sm mb-4">Available 24/7 for urgent issues</p>
                            <a href="tel:+919585899711" className="text-primary font-mono text-xl font-bold hover:underline">+91 95858 99711</a>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center space-y-4 hover:border-primary/50 transition-colors group">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-500/20 transition-colors">
                            <div className="text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">Email Support</h4>
                            <p className="text-gray-500 text-sm mb-4">Get response within 24 hours</p>
                            <a href="mailto:support@wheelio.com" className="text-blue-400 text-lg font-medium hover:underline">support@wheelio.com</a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                    <h4 className="text-white font-bold mb-4">Frequently Asked Questions</h4>
                    <div className="space-y-4">
                        {faqData.map((item, i) => (
                            <div key={i} className="bg-black/20 rounded-xl overflow-hidden transition-all">
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                    className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-black/30 transition-colors text-left"
                                >
                                    <span className="text-gray-300 font-medium">{item.question}</span>
                                    <ChevronRight
                                        size={16}
                                        className={`text-gray-500 transition-transform duration-300 ${expandedFaq === i ? 'rotate-90' : ''}`}
                                    />
                                </button>
                                <div
                                    className={`px-4 text-gray-400 text-sm overflow-hidden transition-all duration-300 ${expandedFaq === i ? 'max-h-40 py-4 border-t border-white/5' : 'max-h-0'}`}
                                >
                                    {item.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderPrivacyPolicy = () => (
        <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 space-y-6 animate-in slide-in-from-right">
            <button onClick={() => setSettingsView('main')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                <ChevronLeft size={20} /> Back
            </button>

            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">Privacy & Ethics</h3>
                <Shield className="text-primary" size={24} />
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <section>
                    <h4 className="text-white font-bold mb-2">1. Our Commitment to Privacy</h4>
                    <p className="text-sm">At Wheelio, we believe that trust is the foundation of every journey. We are committed to protecting your personal data and ensuring transparency in how we collect, use, and share your information. Your privacy is not just a policy; it is our ethical responsibility.</p>
                </section>

                <section>
                    <h4 className="text-white font-bold mb-2">2. Data Collection Ethics</h4>
                    <p className="text-sm">We only collect data that is strictly necessary to provide our services, such as your identity verification (Driving License) and contact details for booking coordination. We explicitly condemn the sale of user data to third parties. Your data belongs to you.</p>
                </section>

                <section>
                    <h4 className="text-white font-bold mb-2">3. Security Measures</h4>
                    <p className="text-sm">We employ state-of-the-art encryption standards to safeguard your sensitive information. From payment details to personal identification documents, every piece of data is treated with the highest level of security protocols.</p>
                </section>

                <section>
                    <h4 className="text-white font-bold mb-2">4. User Rights</h4>
                    <p className="text-sm">You have the absolute right to access, correct, or delete your personal data from our systems at any time. We provide easy-to-use tools within this app to manage your data preferences.</p>
                </section>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mt-4">
                    <p className="text-xs text-primary/80 italic">"We respect your privacy as much as we respect your journey."</p>
                </div>
            </div>
        </div>
    );

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
                        </div>
                    )}

                    {/* Damage Reports Section - Overview */}
                    {activeTab === 'overview' && userDamageReports.length > 0 && (
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
                                        <input type="tel" defaultValue="+91" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
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
                            {settingsView === 'main' && (
                                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                    <h2 className="text-2xl font-bold text-white">App Preferences</h2>

                                    {/* Account & Security */}
                                    <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 space-y-4">
                                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                            <Shield size={20} className="text-primary" /> Security & Privacy
                                        </h3>

                                        <button
                                            onClick={() => setSettingsView('password')}
                                            className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-black/40 rounded-xl transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                                    <Lock size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-white font-medium">Change Password</div>
                                                    <div className="text-sm text-gray-400">Update your account password</div>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                                        </button>

                                        <button
                                            onClick={() => setTwoFactor(!twoFactor)}
                                            className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-black/40 rounded-xl transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                                    <Shield size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-white font-medium">Two-Factor Authentication</div>
                                                    <div className="text-sm text-gray-400">Add an extra layer of security</div>
                                                </div>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full relative transition-colors ${twoFactor ? 'bg-primary' : 'bg-white/10'}`}>
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${twoFactor ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Preferences */}
                                    <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 space-y-4">
                                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                            <Settings size={20} className="text-primary" /> General
                                        </h3>

                                        <button
                                            onClick={() => setNotifications(!notifications)}
                                            className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-black/40 rounded-xl transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                                    <Bell size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-white font-medium">Notifications</div>
                                                    <div className="text-sm text-gray-400">Manage your alert preferences</div>
                                                </div>
                                            </div>
                                            <div className={`w-10 h-6 rounded-full relative transition-colors ${notifications ? 'bg-primary' : 'bg-white/10'}`}>
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setSettingsView('language')}
                                            className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-black/40 rounded-xl transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                                    <Globe size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-white font-medium">Language</div>
                                                    <div className="text-sm text-gray-400">English (India)</div>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                                        </button>
                                    </div>

                                    {/* Support & Legal */}
                                    <div className="bg-secondary/20 border border-white/5 rounded-2xl p-6 space-y-4">
                                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                            <HelpCircle size={20} className="text-primary" /> Support & Legal
                                        </h3>

                                        <button
                                            onClick={() => setSettingsView('privacy')}
                                            className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-black/40 rounded-xl transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-white font-medium">Privacy Policy</div>
                                                    <div className="text-sm text-gray-400">Read our terms and conditions</div>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                                        </button>

                                        <button
                                            onClick={() => setSettingsView('help')}
                                            className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-black/40 rounded-xl transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                                                    <HelpCircle size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-white font-medium">Help Center</div>
                                                    <div className="text-sm text-gray-400">Get help with your bookings</div>
                                                </div>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {settingsView === 'password' && renderChangePassword()}
                            {settingsView === 'language' && renderLanguage()}
                            {settingsView === 'help' && renderHelpCenter()}
                            {settingsView === 'privacy' && renderPrivacyPolicy()}
                        </div>
                    )}

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


import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const BookingForm = ({ vehicle, bookingData, onBack, onConfirm }) => {
    const [formData, setFormData] = useState({
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        dropLocation: '',
        dropTime: '',
        name: '',
        email: '',
        phone: ''
    });

    const [costBreakdown, setCostBreakdown] = useState({
        days: 1,
        rentalCost: vehicle.price,
        addOnsCost: 0,
        gst: 0,
        adjustments: 0,
        total: 0
    });

    // Helper to check for weekend (Fri, Sat, Sun)
    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 5 || day === 6;
    };

    // Calculate costs whenever dates or addon props change
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

            const days = diffDays > 0 ? diffDays : 1;
            const rentalCost = days * vehicle.price;

            // Calculate Add-ons cost
            const addOnsTotalPerDay = bookingData?.addOns?.reduce((acc, curr) => acc + curr.price, 0) || 0;
            const addOnsCost = addOnsTotalPerDay * days;

            // Calculate Pricing Adjustments
            let pricingRules = [];
            try {
                pricingRules = JSON.parse(localStorage.getItem('pricingRules') || '[]');
            } catch (e) {
                pricingRules = [];
            }
            let adjustmentAmount = 0;
            let activeAdjustments = [];

            pricingRules.forEach(rule => {
                if (rule.status !== 'active') return;

                let applyRule = false;

                if (rule.condition === 'weekend') {
                    // Check if any day in the range is a weekend
                    let current = new Date(start);
                    while (current <= end) {
                        if (isWeekend(current)) {
                            applyRule = true;
                            break;
                        }
                        current.setDate(current.getDate() + 1);
                    }
                } else if (rule.condition === 'advance_30') {
                    const today = new Date();
                    const diffTime = start - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays >= 30) applyRule = true;
                } else if (rule.condition === 'holiday') {
                    // Placeholder for holiday logic
                }

                if (applyRule) {
                    const adjustment = (rentalCost * rule.value) / 100;
                    adjustmentAmount += adjustment;
                    activeAdjustments.push({ name: rule.name, amount: adjustment });
                }
            });

            const subTotal = rentalCost + addOnsCost + adjustmentAmount;
            const gst = Math.round(subTotal * 0.18);
            const total = Math.max(0, subTotal + gst);

            setCostBreakdown({
                days,
                rentalCost,
                addOnsCost,
                gst,
                adjustments: adjustmentAmount,
                activeAdjustments,
                total
            });
        }
    }, [formData.startDate, formData.endDate, vehicle.price, bookingData.addOns]);


    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-in fade-in zoom-in duration-500">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Add-ons
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Summary Card */}
                <div className="bg-card rounded-3xl p-6 border border-white/5 h-fit order-2 lg:order-1">
                    <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-48 object-cover rounded-2xl mb-6 shadow-lg"
                    />
                    <h2 className="text-2xl font-bold text-white mb-1">{vehicle.name}</h2>
                    <p className="text-gray-400 mb-6">{vehicle.brand} • {vehicle.type}</p>

                    <div className="space-y-4 border-t border-white/5 pt-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Rate per day</span>
                            <span className="text-white font-medium">₹{vehicle.price}</span>
                        </div>

                        {/* Add-ons List */}
                        {bookingData.addOns?.length > 0 && (
                            <div className="py-3 border-y border-white/5 space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Selected Add-ons</p>
                                {bookingData.addOns.map((addon, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-gray-300 flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-primary" /> {addon.name}
                                        </span>
                                        <span className="text-white">₹{addon.price}/day</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Duration</span>
                                <span className="text-white">{costBreakdown.days} Days</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Rental Cost</span>
                                <span className="text-white">₹{costBreakdown.rentalCost}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Add-ons Cost</span>
                                <span className="text-white">₹{costBreakdown.addOnsCost}</span>
                            </div>

                            {/* Adjustments Display */}
                            {costBreakdown.activeAdjustments && costBreakdown.activeAdjustments.map((adj, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className={adj.amount < 0 ? "text-green-400" : "text-yellow-400"}>
                                        {adj.name}
                                    </span>
                                    <span className={adj.amount < 0 ? "text-green-400" : "text-white"}>
                                        {adj.amount > 0 ? '+' : ''}₹{Math.round(adj.amount)}
                                    </span>
                                </div>
                            ))}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">GST (18%)</span>
                                <span className="text-white">₹{costBreakdown.gst}</span>
                            </div>
                        </div>

                        <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/5 bg-primary/5 p-4 rounded-xl -mx-2">
                            <span className="text-primary">Total Amount</span>
                            <span className="text-white">₹{costBreakdown.total}</span>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="bg-secondary/30 rounded-3xl p-8 border border-white/5 order-1 lg:order-2">
                    <h3 className="text-2xl font-bold text-white mb-6">Final Details</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Pick-up Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="date"
                                        name="startDate"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 outline-none [color-scheme:dark]"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Return Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="date"
                                        name="endDate"
                                        required
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                        className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 outline-none [color-scheme:dark]"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="time"
                                        name="startTime"
                                        required
                                        className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 outline-none [color-scheme:dark]"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pickup Location Display */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Pickup Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 text-primary w-4 h-4" />
                                <input
                                    type="text"
                                    value={vehicle.location || 'Coimbatore'}
                                    readOnly
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-gray-300 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Pick up your vehicle from this location</p>
                        </div>

                        {/* Drop Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Drop Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="text"
                                        name="dropLocation"
                                        placeholder="Enter drop location"
                                        required
                                        className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-gray-500"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Drop Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="time"
                                        name="dropTime"
                                        required
                                        className="w-full bg-background border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary/50 outline-none [color-scheme:dark]"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                required
                                className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-gray-500"
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-gray-500"
                                onChange={handleChange}
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                required
                                className="w-full bg-background border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/50 outline-none placeholder:text-gray-500"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-white font-semibold flex items-center gap-2">
                                <ShieldCheck size={18} className="text-primary" /> Payment Method
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                                <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:border-primary/50 transition-all">
                                    <input type="radio" name="payment" className="accent-primary w-5 h-5" defaultChecked />
                                    <div className="flex-1">
                                        <div className="text-white font-medium">UPI / GPay / PhonePe</div>
                                        <div className="text-xs text-gray-500">Fast & Secure</div>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:border-primary/50 transition-all">
                                    <input type="radio" name="payment" className="accent-primary w-5 h-5" />
                                    <div className="flex-1">
                                        <div className="text-white font-medium">Credit / Debit Card</div>
                                        <div className="text-xs text-gray-500">Visa, Mastercard, Rupay</div>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:border-primary/50 transition-all">
                                    <input type="radio" name="payment" className="accent-primary w-5 h-5" />
                                    <div className="flex-1">
                                        <div className="text-white font-medium">Net Banking</div>
                                        <div className="text-xs text-gray-500">All major banks supported</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-cyan-400 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 mt-4 active:scale-95"
                        >
                            Proceed to Pay ₹{costBreakdown.total}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;

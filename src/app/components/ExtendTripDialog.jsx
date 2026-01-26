import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, ArrowRight, CheckCircle, Shield } from 'lucide-react';

const ExtendTripDialog = ({ isOpen, onClose, onConfirm, currentEndDate }) => {
    const [step, setStep] = useState(1); // 1: Select, 2: Payment, 3: Success
    const [days, setDays] = useState(1);
    const [processing, setProcessing] = useState(false);

    // Payment Form State
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    if (!isOpen) return null;

    const costPerDay = 1500; // Mock cost - ideally passed from parent
    const totalCost = days * costPerDay;

    // Helper to calculate new date string
    const calculateNewDate = () => {
        // Tries to parse "dd/mm/yyyy" or standard formats
        // This is a naive implementation for demo purposes
        return "2026-01-25"; // Mocked for simplicity
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate Payment Processing
        setTimeout(() => {
            setProcessing(false);
            setStep(3); // Go to Success Step
        }, 2000);
    };

    const handleFinalize = () => {
        onConfirm({
            days,
            additionalCost: totalCost,
            newEndDate: calculateNewDate(), // In a real app, calculate this properly
            paymentMethod: `Card ending in ${cardDetails.number.slice(-4)}`
        });

        // Reset and Close
        setTimeout(() => {
            onClose();
            setStep(1);
            setDays(1);
            setCardDetails({ number: '', name: '', expiry: '', cvv: '' });
        }, 500);
    };

    const renderStep1_Selection = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h3 className="text-2xl font-bold text-white">Extend Your Trip</h3>
                <p className="text-gray-400 mt-2">
                    Love the ride? Keep it for a bit longer!
                </p>
            </div>

            <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div className="text-left">
                    <p className="text-xs text-gray-500 uppercase font-bold">Current End</p>
                    <p className="text-white font-mono">{currentEndDate || 'Today'}</p>
                </div>
                <ArrowRight className="text-gray-600" size={20} />
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">New End</p>
                    <p className="text-primary font-mono font-bold">Calculated...</p>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300">Extend by (Days)</label>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setDays(Math.max(1, days - 1))}
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors text-xl font-bold"
                    >
                        -
                    </button>
                    <div className="flex-1 h-12 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {days} Day{days > 1 ? 's' : ''}
                    </div>
                    <button
                        onClick={() => setDays(days + 1)}
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors text-xl font-bold"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-xl border border-primary/10">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300">Additional Cost</span>
                    <span className="text-xl font-bold text-primary">₹{totalCost}</span>
                </div>
                <p className="text-xs text-gray-500">Includes taxes & insurance</p>
            </div>

            <button
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-xl bg-primary text-black font-bold text-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
                Proceed to Pay ₹{totalCost}
            </button>
        </div>
    );

    const renderStep2_Payment = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <button
                    onClick={() => setStep(1)}
                    className="text-gray-400 text-sm hover:text-white mb-2 flex items-center gap-1"
                >
                    &larr; Back
                </button>
                <h3 className="text-2xl font-bold text-white">Payment Details</h3>
                <p className="text-gray-400 mt-1">
                    Secure Payment Gateway
                </p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase font-bold">Card Number</label>
                    <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            required
                            placeholder="0000 0000 0000 0000"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary outline-none font-mono"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold">Expiry</label>
                        <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none font-mono text-center"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase font-bold">CVV</label>
                        <input
                            type="password"
                            required
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none font-mono text-center"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase font-bold">Cardholder Name</label>
                    <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary outline-none"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 rounded-xl bg-primary text-black font-bold text-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay ₹{totalCost}
                            </>
                        )}
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                        <Shield size={12} className="text-green-500" />
                        Encrypted & Secure Payment
                    </div>
                </div>
            </form>
        </div>
    );

    const renderStep3_Success = () => (
        <div className="text-center py-8 space-y-6 animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border border-green-500/30 animate-ping"></div>
                <CheckCircle size={48} className="text-green-500 relative z-10" />
            </div>

            <div>
                <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
                <p className="text-gray-400">
                    Your trip has been extended by <span className="text-white font-bold">{days} day{days > 1 ? 's' : ''}</span>.
                </p>
            </div>

            <div className="bg-black/30 rounded-xl p-6 border border-white/5 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="text-white font-mono">₹{totalCost}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="text-white font-mono">TXN{Date.now().toString().slice(-6)}</span>
                </div>
            </div>

            <button
                onClick={handleFinalize}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/10"
            >
                Done
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative transition-all duration-300">
                {step !== 3 && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                )}

                {step === 1 && renderStep1_Selection()}
                {step === 2 && renderStep2_Payment()}
                {step === 3 && renderStep3_Success()}
            </div>
        </div>
    );
};

export default ExtendTripDialog;

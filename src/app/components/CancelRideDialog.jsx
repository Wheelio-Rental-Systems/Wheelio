import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

const CancelRideDialog = ({ isOpen, onClose, onConfirm, bookingId }) => {
    if (!isOpen) return null;

    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleConfirm = () => {
        setIsConfirmed(true);
        // Simulate API call delay
        setTimeout(() => {
            onConfirm({
                bookingId,
                reason: 'Admin cancelled',
                timestamp: new Date().toISOString()
            });
            setIsConfirmed(false);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {!isConfirmed ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Cancel Ride?</h3>
                            <p className="text-gray-400 text-sm mt-2">
                                Are you sure you want to cancel this booking? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 font-bold transition-colors"
                            >
                                Keep Ride
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 font-bold transition-colors shadow-lg shadow-red-500/20"
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 space-y-4">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Cancelling...</h3>
                        <p className="text-gray-400">Processing cancellation request.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CancelRideDialog;

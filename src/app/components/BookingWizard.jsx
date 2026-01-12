import React, { useState } from 'react';
import LicenseUpload from './booking-steps/LicenseUpload';
import AddOns from './booking-steps/AddOns';
import BookingForm from './BookingForm';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const BookingWizard = ({ vehicle, onBack, onComplete }) => {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        vehicle: vehicle,
        license: null,
        addOns: [],
        details: {}
    });

    const handleLicenseSubmit = (file) => {
        setBookingData(prev => ({ ...prev, license: file }));
        setStep(2);
    };

    const handleAddOnsSubmit = (addOns) => {
        setBookingData(prev => ({ ...prev, addOns: addOns }));
        setStep(3);
    };

    const handleBookingConfirm = () => {
        setStep(4);
        setTimeout(() => {
            onComplete(bookingData);
        }, 3000); // Show success message for 3 seconds
    };

    return (
        <div className="min-h-screen bg-background pt-24 px-4 pb-12">
            {/* Steps Progress */}
            {step < 4 && (
                <div className="max-w-xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between relative">
                        {/* Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-10"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

                        {/* Step 1 */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all bg-background ${step >= 1 ? 'border-primary text-primary' : 'border-white/10 text-gray-500'
                            }`}>
                            {step > 1 ? <CheckCircle2 size={20} /> : '1'}
                        </div>

                        {/* Step 2 */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all bg-background ${step >= 2 ? 'border-primary text-primary' : 'border-white/10 text-gray-500'
                            }`}>
                            {step > 2 ? <CheckCircle2 size={20} /> : '2'}
                        </div>

                        {/* Step 3 */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all bg-background ${step >= 3 ? 'border-primary text-primary' : 'border-white/10 text-gray-500'
                            }`}>
                            {step > 3 ? <CheckCircle2 size={20} /> : '3'}
                        </div>
                    </div>
                    <div className="flex justify-between text-xs mt-2 text-gray-400 font-medium">
                        <span>License</span>
                        <span>Add-ons</span>
                        <span>Payment</span>
                    </div>
                </div>
            )}

            {/* Step Content */}
            <div className="max-w-5xl mx-auto">
                {step === 1 && (
                    <LicenseUpload
                        onNext={handleLicenseSubmit}
                        onBack={onBack}
                    />
                )}

                {step === 2 && (
                    <AddOns
                        vehicle={vehicle}
                        onNext={handleAddOnsSubmit}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <BookingForm
                        vehicle={vehicle}
                        bookingData={bookingData}
                        onBack={() => setStep(2)}
                        onConfirm={handleBookingConfirm}
                    />
                )}

                {step === 4 && (
                    <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <CheckCircle2 size={48} className="text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-gray-400 text-center max-w-md">
                            Your booking for <span className="text-primary font-bold">{vehicle.name}</span> has been confirmed.
                            <br />Redirecting to your dashboard...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingWizard;

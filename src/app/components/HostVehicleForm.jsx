import React, { useState } from 'react';
import { Upload, Car, MapPin, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const HostVehicleForm = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        fuelType: 'Petrol',
        location: '',
        license: null,
        rcBook: null
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, field) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, [field]: e.target.files[0] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            setStep('success');
            toast.success("Vehicle Listed Successfully!");
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Host</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Turn your idle vehicle into an earning asset. List your car or bike with Wheelio and start earning today.
                </p>
            </div>

            {step !== 'success' ? (
                <div className="bg-secondary/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: Vehicle Details */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Car className="text-primary" /> Vehicle Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="make"
                                    placeholder="Make (e.g., Hyundai)"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="model"
                                    placeholder="Model (e.g., Creta)"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="number"
                                    name="year"
                                    placeholder="Year (e.g., 2023)"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    onChange={handleInputChange}
                                />
                                <select
                                    name="fuelType"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                    onChange={handleInputChange}
                                >
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                        </div>

                        {/* Section 2: Documents */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FileText className="text-primary" /> Required Documents
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* RC Book */}
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors bg-white/5 group relative">
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">RC Book (Front & Back)</h4>
                                    <input
                                        type="file"
                                        required
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => handleFileChange(e, 'rcBook')}
                                    />
                                    <div className="flex flex-col items-center justify-center py-4">
                                        {formData.rcBook ? (
                                            <div className="text-green-500 flex items-center gap-2 font-bold">
                                                <CheckCircle size={20} /> Uploaded: {formData.rcBook.name}
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mb-2 text-gray-500 group-hover:text-primary transition-colors" />
                                                <span className="text-xs text-gray-500">Click to upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Driving License */}
                                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors bg-white/5 group relative">
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Host Driving License</h4>
                                    <input
                                        type="file"
                                        required
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => handleFileChange(e, 'license')}
                                    />
                                    <div className="flex flex-col items-center justify-center py-4">
                                        {formData.license ? (
                                            <div className="text-green-500 flex items-center gap-2 font-bold">
                                                <CheckCircle size={20} /> Uploaded: {formData.license.name}
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mb-2 text-gray-500 group-hover:text-primary transition-colors" />
                                                <span className="text-xs text-gray-500">Click to upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Location */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <MapPin className="text-primary" /> Pickup Location
                            </h3>
                            <input
                                type="text"
                                name="location"
                                placeholder="Enter full pickup address with pincode"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none"
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-4">
                            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-4 rounded-xl mb-6 text-sm">
                                <AlertTriangle size={16} />
                                <span>Note: Your listing will be reviewed by our team (24-48 hrs) before going live.</span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary hover:bg-cyan-400 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'List Your Vehicle'}
                            </button>
                        </div>

                    </form>
                </div>
            ) : (
                <div className="bg-secondary/20 border border-white/5 rounded-3xl p-16 text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-black mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Submission Successful!</h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Thank you for listing your vehicle with Wheelio. Our verification team will contact you shortly at your registered email to complete the onboarding process.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            )}
        </div>
    );
};

export default HostVehicleForm;

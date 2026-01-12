import React, { useState } from 'react';
import { Search, Calendar, MapPin, Clock } from 'lucide-react';

const Hero = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState('cars'); // 'cars' or 'bikes'

  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700">
          Find Your <span className="text-primary italic">Perfect Ride</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Premium vehicle rentals for every journey. Choose from our wide range of luxury cars and sport bikes.
        </p>

        {/* Search Container */}
        <div className="w-full max-w-4xl bg-card border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 backdrop-blur-sm animate-in zoom-in duration-500 delay-200">

          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('cars')}
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'cars'
                  ? 'bg-primary text-black shadow-lg shadow-primary/25 scale-105'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
              Cars
            </button>
            <button
              onClick={() => setActiveTab('bikes')}
              className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === 'bikes'
                  ? 'bg-primary text-black shadow-lg shadow-primary/25 scale-105'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
            >
              Bikes
            </button>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

            {/* Location */}
            <div className="md:col-span-4 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Pick-up Location"
                className="w-full bg-secondary/50 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-gray-500"
              />
            </div>

            {/* Date */}
            <div className="md:col-span-3 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <input
                type="date"
                className="w-full bg-secondary/50 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all [color-scheme:dark]"
              />
            </div>

            {/* Time */}
            <div className="md:col-span-3 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <input
                type="time"
                className="w-full bg-secondary/50 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all [color-scheme:dark]"
              />
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                onClick={onSearch} // Trigger parent navigation
                className="w-full bg-primary hover:bg-cyan-400 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 group active:scale-95"
              >
                <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

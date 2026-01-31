import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import VehicleList from './components/VehicleList';
import BookingWizard from './components/BookingWizard';
import Footer from './components/Footer';
import { About, Testimonials, Careers, HelpCenter, Terms, Privacy, Contact } from './components/FooterPages';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { DamageReport } from './components/DamageReport';
import { EmergencyButton } from './components/EmergencyButton';
import { SupportDialog } from './components/SupportDialog';
import HostVehicleForm from './components/HostVehicleForm';

import AdminDashboard from './components/AdminDashboard';
import { Toaster, toast } from 'sonner';
import { vehicles as staticVehicles } from './data/vehicles';

const App = () => {
  // State for Navigation
  const [currentView, setCurrentView] = useState('home');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [user, setUser] = useState(null);

  const [allVehicles, setAllVehicles] = useState([]);

  useEffect(() => {
    const storedVehicles = JSON.parse(localStorage.getItem('allVehicles'));
    if (storedVehicles && storedVehicles.length > 0) {
      setAllVehicles(storedVehicles);
    } else {
      setAllVehicles(staticVehicles);
      localStorage.setItem('allVehicles', JSON.stringify(staticVehicles));
    }

    const storedBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    setAllBookings(storedBookings);
  }, []);

  const handleAddVehicle = (newVehicle) => {
    const updatedVehicles = [newVehicle, ...allVehicles];
    setAllVehicles(updatedVehicles);
    localStorage.setItem('allVehicles', JSON.stringify(updatedVehicles));
  };

  const handleDeleteVehicle = (vehicleId) => {
    const updatedVehicles = allVehicles.filter(v => v.id !== vehicleId);
    setAllVehicles(updatedVehicles);
    localStorage.setItem('allVehicles', JSON.stringify(updatedVehicles));
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    const updatedVehicles = allVehicles.map(v =>
      v.id === updatedVehicle.id ? updatedVehicle : v
    );
    setAllVehicles(updatedVehicles);
    localStorage.setItem('allVehicles', JSON.stringify(updatedVehicles));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    setUserBookings([]);
  };

  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportTab, setSupportTab] = useState('faq');

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      status: 'Upcoming',
      cost: '₹' + (bookingData.vehicle.price * 1.05 + 96).toFixed(0),
      userName: user ? user.name : 'Guest User',
      vehicleName: bookingData.vehicle.name
    };

    setUserBookings(prev => [newBooking, ...prev]);

    const updatedAllBookings = [newBooking, ...allBookings];
    setAllBookings(updatedAllBookings);
    localStorage.setItem('allBookings', JSON.stringify(updatedAllBookings));

    setSelectedVehicle(null);
    handleNavigate('dashboard');
  };

  const handleUpdateBooking = (updatedBooking) => {
    setUserBookings(prev => prev.map(b =>
      b.id === updatedBooking.id ? { ...b, ...updatedBooking } : b
    ));
  };

  const handleCancelBooking = (bookingId) => {
    setUserBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const handleEmergency = () => {
    setSupportTab('emergency');
    setIsSupportOpen(true);
  };

  const handleUpdateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      <Toaster position="top-right" theme="dark" />
      <Navbar onNavigate={handleNavigate} currentView={currentView} user={user} onLogout={handleLogout} />

      <main className="min-h-screen pt-4">
        {currentView === 'home' && (
          <>
            <>
              <Hero onSearch={() => handleNavigate('vehicles')} onNavigate={handleNavigate} />
              <Features />
            </>
          </>
        )}

        {currentView === 'vehicles' && (
          <VehicleList onBook={handleBookVehicle} user={user} vehicles={allVehicles} />
        )}

        {currentView === 'booking' && selectedVehicle && (
          <BookingWizard
            vehicle={selectedVehicle}
            onBack={() => handleNavigate('vehicles')}
            onComplete={confirmBooking}
          />
        )}

        {currentView === 'become-host' && (
          <HostVehicleForm onNavigate={handleNavigate} user={user} />
        )}

        {currentView === 'damage-report' && (
          <DamageReport />
        )}

        {currentView === 'about' && <About />}
        {currentView === 'testimonials' && <Testimonials />}
        {currentView === 'careers' && <Careers />}
        {currentView === 'help' && <HelpCenter />}
        {currentView === 'terms' && <Terms />}
        {currentView === 'privacy' && <Privacy />}
        {currentView === 'contact' && <Contact />}
        {currentView === 'login' && <Login onNavigate={handleNavigate} onLogin={handleLogin} />}
        {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} bookings={userBookings} user={user} onUpdateUser={handleUpdateUser} onUpdateBooking={handleUpdateBooking} onCancelBooking={handleCancelBooking} />}


        {currentView === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} vehicles={allVehicles} bookings={allBookings} onAddVehicle={handleAddVehicle} onDeleteVehicle={handleDeleteVehicle} onUpdateVehicle={handleUpdateVehicle} />}

      </main>

      <EmergencyButton onClick={handleEmergency} />

      <SupportDialog
        open={isSupportOpen}
        onOpenChange={setIsSupportOpen}
        defaultTab={supportTab}
        user={user}
      />

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;

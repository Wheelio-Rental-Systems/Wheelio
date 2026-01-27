import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import VehicleList from './components/VehicleList';
import BookingWizard from './components/BookingWizard'; // Updated import
import Footer from './components/Footer';
import { About, Testimonials, Careers, HelpCenter, Terms, Privacy, Contact } from './components/FooterPages';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { DamageReport } from './components/DamageReport'; // New import
import { EmergencyButton } from './components/EmergencyButton'; // New import
import { SupportDialog } from './components/SupportDialog'; // New import
import HostVehicleForm from './components/HostVehicleForm'; // New import
import AdminLogin from './components/AdminLogin'; // New import
import AdminDashboard from './components/AdminDashboard'; // New import
import { Toaster } from 'sonner'; // Ensure sonner is installed or handle if missing
import { vehicles as staticVehicles } from './data/vehicles'; // Import static vehicles

const App = () => {
  // State for Navigation
  const [currentView, setCurrentView] = useState('home');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userBookings, setUserBookings] = useState([]); // Store bookings here
  const [user, setUser] = useState(null); // Initial state is logged out

  // Vehicle State (Lifted from VehicleList)
  const [allVehicles, setAllVehicles] = useState([]);

  useEffect(() => {
    // Initialize vehicles from localStorage or static data
    const storedVehicles = JSON.parse(localStorage.getItem('allVehicles'));
    if (storedVehicles && storedVehicles.length > 0) {
      setAllVehicles(storedVehicles);
    } else {
      setAllVehicles(staticVehicles);
      localStorage.setItem('allVehicles', JSON.stringify(staticVehicles));
    }
  }, []);

  const handleAddVehicle = (newVehicle) => {
    const updatedVehicles = [newVehicle, ...allVehicles];
    setAllVehicles(updatedVehicles);
    localStorage.setItem('allVehicles', JSON.stringify(updatedVehicles));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('home'); // Redirect to home or dashboard after login
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    setUserBookings([]); // Clear bookings on logout if needed
  };

  // Support & Dialog States
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportTab, setSupportTab] = useState('faq');

  // Handle flow
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
    // Save the new booking
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      status: 'Upcoming',
      cost: '₹' + (bookingData.vehicle.price * 1.05 + 96).toFixed(0), // Approximate cost calc from dialog
      userName: user ? user.name : 'Guest User', // Add user name for Admin Dashboard
      vehicleName: bookingData.vehicle.name // Ensure vehicle name is accessible
    };

    setUserBookings(prev => [newBooking, ...prev]);

    // Sync with localStorage for Admin Dashboard
    const existingAllBookings = JSON.parse(localStorage.getItem('allBookings') || '[]');
    localStorage.setItem('allBookings', JSON.stringify([newBooking, ...existingAllBookings]));

    setSelectedVehicle(null);
    handleNavigate('dashboard'); // Redirect to dashboard to see the booking
  };

  const handleUpdateBooking = (updatedBooking) => {
    setUserBookings(prev => prev.map(b =>
      b.id === updatedBooking.id ? { ...b, ...updatedBooking } : b
    ));
    // Ideally toast notification here
  };

  const handleCancelBooking = (bookingId) => {
    setUserBookings(prev => prev.filter(b => b.id !== bookingId));
    // Toast notification could be triggered here or in Dashboard
  };

  const handleEmergency = () => {
    setSupportTab('emergency');
    setIsSupportOpen(true);
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

        {/* New Route for Host Form */}
        {currentView === 'become-host' && (
          <HostVehicleForm />
        )}

        {/* New Route for Damage Report */}
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
        {currentView === 'dashboard' && <Dashboard onNavigate={handleNavigate} bookings={userBookings} user={user} onUpdateBooking={handleUpdateBooking} onCancelBooking={handleCancelBooking} />}

        {/* Admin Routes */}
        {currentView === 'admin-login' && <AdminLogin onNavigate={handleNavigate} onLogin={handleLogin} />}
        {currentView === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} vehicles={allVehicles} onAddVehicle={handleAddVehicle} />}

      </main>

      {/* Global Floating Components */}
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

import { useState, useEffect } from 'react';
import VehicleSelection from './components/VehicleSelection';
import DriverLogin from './components/DriverLogin';
import TripStart from './components/TripStart';
import ActiveTrip from './components/ActiveTrip';
import TripEnd from './components/TripEnd';
import AdminDashboard from './components/AdminDashboard';
import {
  getCurrentSession,
  isTripActive,
  hasMinimumDrivers,
  logoutDriver,
  getDriverCount
} from './utils/storageUtils';
import './index.css';

function App() {
  const [appMode, setAppMode] = useState('driver');
  const [currentScreen, setCurrentScreen] = useState('vehicle-selection');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [showEndTrip, setShowEndTrip] = useState(false);
  const [driverCount, setDriverCount] = useState(0);
  const totalDriversNeeded = 2;

  // Load saved state on mount
  useEffect(() => {
    const session = getCurrentSession();

    if (session && session.vehicleNumber) {
      setVehicleNumber(session.vehicleNumber);

      const count = getDriverCount(session.vehicleNumber);
      setDriverCount(count || 0);

      const tripActive = isTripActive(session.vehicleNumber);

      if (tripActive) {
        setCurrentScreen('active-trip');
      } else if (hasMinimumDrivers(session.vehicleNumber)) {
        setCurrentScreen('trip-start');
      } else {
        setCurrentScreen('waiting-for-drivers');
      }
    } else {
      setCurrentScreen('vehicle-selection');
    }
  }, []);

  const handleVehicleSelected = (vehicle) => {
    setVehicleNumber(vehicle);
    setCurrentScreen('driver-login');
  };

  const handleLoginSuccess = () => {
    const session = getCurrentSession();

    if (!session) {
      console.error('No session found after login');
      return;
    }

    const count = getDriverCount(session.vehicleNumber);
    setDriverCount(count || 0);

    if (hasMinimumDrivers(session.vehicleNumber)) {
      setCurrentScreen('trip-start');
    } else {
      setCurrentScreen('waiting-for-drivers');

      // Simulate driver joining for demo
      const currentCount = count || 0;
      if (currentCount < totalDriversNeeded) {
        setTimeout(() => {
          const newCount = currentCount + 1;
          setDriverCount(newCount);

          if (newCount >= totalDriversNeeded) {
            setTimeout(() => {
              if (hasMinimumDrivers(session.vehicleNumber)) {
                setCurrentScreen('trip-start');
              }
            }, 1500);
          }
        }, 3000);
      }
    }
  };

  const handleTripStarted = () => {
    setCurrentScreen('active-trip');
  };

  const handleEndTripClick = () => {
    setShowEndTrip(true);
  };

  const handleTripEnded = () => {
    setShowEndTrip(false);
    setCurrentScreen('vehicle-selection');
    setVehicleNumber('');
    setDriverCount(0);
  };

  const handleCancelEndTrip = () => {
    setShowEndTrip(false);
  };

  const handleBackToHome = () => {
    const session = getCurrentSession();
    if (session) {
      logoutDriver(session.vehicleNumber, session.phone);
    }
    setVehicleNumber('');
    setCurrentScreen('vehicle-selection');
    setDriverCount(0);
  };

  // Mode selector
  const renderModeSelector = () => (
    <div className="mode-selector">
      <button
        onClick={() => setAppMode('driver')}
        className={`mode-btn ${appMode === 'driver' ? 'active' : ''}`}
      >
        <div className="mode-btn-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <path d="M12 18h.01" />
          </svg>
        </div>
        Driver App
      </button>
      <button
        onClick={() => setAppMode('admin')}
        className={`mode-btn ${appMode === 'admin' ? 'active' : ''}`}
      >
        <div className="mode-btn-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </div>
        Admin Dashboard
      </button>
    </div>
  );

  // Waiting for Drivers Screen
  const WaitingForDrivers = () => {
    const displayCount = Math.min(driverCount, totalDriversNeeded);
    const progressPercentage = Math.min((displayCount / totalDriversNeeded) * 100, 100);

    return (
      <div className="app-container">
        <div className="app-bar">
          <button onClick={handleBackToHome} className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </button>
          <div className="app-logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="logo-text">TripMaster</span>
          </div>
          <div className="vehicle-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="8" width="22" height="12" rx="2" />
              <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
              <circle cx="7" cy="16" r="2" />
              <circle cx="17" cy="16" r="2" />
            </svg>
            {vehicleNumber}
          </div>
        </div>

        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Login Successful</h1>
            <p className="hero-subtitle">Waiting for other drivers to join</p>
          </div>
          <div className="hero-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>

        <div className="main-content">
          <div className="card elevated">
            <div className="waiting-content">
              <div className="status-indicator">
                <div className="status-spinner">
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" stroke="#e2e8f0" />
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeDasharray="44 100" />
                  </svg>
                </div>
                <div className="driver-count">
                  <span className="current-count">{displayCount}</span>
                  <span className="total-count">/{totalDriversNeeded}</span>
                </div>
              </div>

              <h3 className="waiting-title">Drivers Connected</h3>
              <p className="waiting-description">
                At least <strong>{totalDriversNeeded} drivers</strong> need to log in with vehicle{' '}
                <strong>{vehicleNumber}</strong> before starting the trip.
              </p>

              <div className="progress-container">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="progress-labels">
                  <span>Waiting...</span>
                  <span>Ready</span>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <h4 className="info-card-title">How Multi-Driver Login Works</h4>
                </div>
                <div className="info-content">
                  <div className="info-item">
                    <div className="info-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="info-text">
                      <strong>Separate Devices Required</strong>
                      <p>Each driver logs in on their own mobile device</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="8" width="22" height="12" rx="2" />
                        <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
                        <circle cx="7" cy="16" r="2" />
                        <circle cx="17" cy="16" r="2" />
                      </svg>
                    </div>
                    <div className="info-text">
                      <strong>Same Vehicle Number</strong>
                      <p>All drivers use the same vehicle number for coordination</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="info-text">
                      <strong>Auto-Start When Ready</strong>
                      <p>The trip will start automatically when all drivers are ready</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Skip Button */}
              <button
                onClick={() => setCurrentScreen('trip-start')}
                className="btn btn-secondary btn-full"
                style={{ marginTop: '0.5rem', borderStyle: 'dashed', opacity: 0.8 }}
              >
                Skip Wait (Demo)
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Admin mode
  if (appMode === 'admin') {
    return (
      <div className="app-wrapper">
        {renderModeSelector()}
        <AdminDashboard />
      </div>
    );
  }

  // Driver mode
  return (
    <div className="app-wrapper">
      {renderModeSelector()}

      {currentScreen === 'vehicle-selection' && (
        <VehicleSelection onVehicleSelected={handleVehicleSelected} />
      )}

      {currentScreen === 'driver-login' && (
        <DriverLogin
          vehicleNumber={vehicleNumber}
          onLoginSuccess={handleLoginSuccess}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'waiting-for-drivers' && (
        <WaitingForDrivers />
      )}

      {currentScreen === 'trip-start' && !showEndTrip && (
        <TripStart
          vehicleNumber={vehicleNumber}
          onTripStarted={handleTripStarted}
          onBack={handleBackToHome}
        />
      )}

      {currentScreen === 'active-trip' && !showEndTrip && (
        <ActiveTrip
          vehicleNumber={vehicleNumber}
          onEndTrip={handleEndTripClick}
          onBack={handleBackToHome}
        />
      )}

      {showEndTrip && (
        <TripEnd
          vehicleNumber={vehicleNumber}
          onTripEnded={handleTripEnded}
          onCancel={handleCancelEndTrip}
        />
      )}
    </div>
  );
}

export default App;
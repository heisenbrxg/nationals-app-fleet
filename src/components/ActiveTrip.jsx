// COMPONENT: ActiveTrip - Modern Redesign
import { useState, useEffect } from 'react';
import { getCurrentSession, getTripStartTime } from '../utils/storageUtils';

const ActiveTrip = ({ vehicleNumber, onEndTrip, onBack }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [tripDuration, setTripDuration] = useState('00:00:00');
    const [locationStatus, setLocationStatus] = useState('active');

    const session = getCurrentSession();
    const tripStartTime = getTripStartTime(vehicleNumber);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());

            if (tripStartTime) {
                const start = new Date(tripStartTime);
                const now = new Date();
                const diff = now - start;

                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);

                setTripDuration(
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                );
            }
        }, 1000);

        // Simulate location updates
        const locationInterval = setInterval(() => {
            setLocationStatus(Math.random() > 0.1 ? 'active' : 'weak');
        }, 3000);

        return () => {
            clearInterval(timer);
            clearInterval(locationInterval);
        };
    }, [tripStartTime]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="trip-container">
            {/* Live Trip Header */}
            <div className="trip-header">
                <button onClick={onBack} className="header-back-btn">
                    <i className="icon icon-arrow-left"></i>
                </button>
                
                <div className="trip-status-indicator">
                    <div className="status-dot live"></div>
                    <span className="status-text">Live Trip</span>
                </div>
                
                <div className="location-status">
                    <i className={`icon icon-location-${locationStatus}`}></i>
                    <span className="location-text">
                        {locationStatus === 'active' ? 'Strong GPS' : 'Weak Signal'}
                    </span>
                </div>
            </div>

            {/* Trip Duration Display */}
            <div className="duration-display">
                <div className="duration-label">Trip Duration</div>
                <h1 className="duration-time">{tripDuration}</h1>
                <div className="duration-meta">
                    Started at {tripStartTime ? new Date(tripStartTime).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }) : '--:--'}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="trip-content">
                {/* Current Time Card */}
                <div className="card time-card">
                    <div className="card-header">
                        <i className="icon icon-clock"></i>
                        Current Time
                    </div>
                    <div className="time-display">
                        <div className="current-time">{formatTime(currentTime)}</div>
                        <div className="current-date">{formatDate(currentTime)}</div>
                    </div>
                </div>

                {/* Driver & Vehicle Info */}
                <div className="card info-card">
                    <div className="card-header">
                        <i className="icon icon-info"></i>
                        Trip Details
                    </div>
                    
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-label">
                                <i className="icon icon-vehicle"></i>
                                Vehicle
                            </div>
                            <div className="info-value highlight">{vehicleNumber}</div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-label">
                                <i className="icon icon-driver"></i>
                                Driver
                            </div>
                            <div className="info-value">{session?.name || 'You'}</div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-label">
                                <i className="icon icon-phone"></i>
                                Phone
                            </div>
                            <div className="info-value">{session?.phone}</div>
                        </div>
                        
                        <div className="info-item">
                            <div className="info-label">
                                <i className="icon icon-status"></i>
                                Status
                            </div>
                            <div className="info-value">
                                <span className="status-badge active">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Safety & Requirements */}
                <div className="card safety-card">
                    <div className="safety-header">
                        <i className="icon icon-safety"></i>
                        <h3>Safety Requirements</h3>
                    </div>
                    
                    <div className="requirements-list">
                        <div className="requirement-item">
                            <div className="requirement-icon">📍</div>
                            <div className="requirement-content">
                                <div className="requirement-title">Proximity Rule</div>
                                <div className="requirement-desc">
                                    All drivers must be within 90 meters to end trip
                                </div>
                            </div>
                        </div>
                        
                        <div className="requirement-item">
                            <div className="requirement-icon">👥</div>
                            <div className="requirement-content">
                                <div className="requirement-title">Coordination Required</div>
                                <div className="requirement-desc">
                                    Coordinate with other drivers before ending
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="action-section">
                    <button className="btn btn-secondary btn-large" onClick={() => window.location.reload()}>
                        <i className="icon icon-refresh"></i>
                        Refresh Status
                    </button>
                    
                    <button 
                        onClick={onEndTrip} 
                        className="btn btn-danger btn-large btn-full"
                    >
                        <i className="icon icon-stop"></i>
                        End Trip
                    </button>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="status-bar">
                <div className="status-item">
                    <i className="icon icon-time"></i>
                    <span>Duration: {tripDuration}</span>
                </div>
                <div className="status-item">
                    <i className="icon icon-vehicle-small"></i>
                    <span>{vehicleNumber}</span>
                </div>
                <div className="status-item">
                    <i className={`icon icon-location-${locationStatus}`}></i>
                    <span>{locationStatus === 'active' ? 'GPS Active' : 'Weak Signal'}</span>
                </div>
            </div>

            <style jsx>{`
                .trip-container {
                    max-width: 480px;
                    margin: 0 auto;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .trip-header {
                    padding: 1.5rem 1.5rem 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    z-index: 2;
                }

                .header-back-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.25rem;
                    cursor: pointer;
                    backdrop-filter: blur(10px);
                }

                .trip-status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(34, 197, 94, 0.15);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .status-dot.live {
                    background: #22c55e;
                    animation: pulse 2s infinite;
                }

                .status-text {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #bbf7d0;
                }

                .location-status {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }

                .location-text {
                    font-size: 0.875rem;
                    color: #cbd5e1;
                }

                .duration-display {
                    text-align: center;
                    padding: 2rem 1.5rem 4rem;
                    position: relative;
                    z-index: 2;
                }

                .duration-label {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 0.5rem;
                }

                .duration-time {
                    font-size: 3.5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 0.5rem;
                    font-variant-numeric: tabular-nums;
                }

                .duration-meta {
                    font-size: 0.95rem;
                    color: #cbd5e1;
                }

                .trip-content {
                    background: #0f172a;
                    border-radius: 32px 32px 0 0;
                    padding: 2rem 1.5rem 6rem;
                    position: relative;
                    z-index: 2;
                    margin-top: -2rem;
                }

                .card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    backdrop-filter: blur(10px);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #94a3b8;
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 1.5rem;
                }

                .time-display {
                    text-align: center;
                }

                .current-time {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.5rem;
                    font-variant-numeric: tabular-nums;
                }

                .current-date {
                    font-size: 0.95rem;
                    color: #94a3b8;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1.25rem;
                }

                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .info-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: #94a3b8;
                }

                .info-value {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                }

                .info-value.highlight {
                    color: #22c55e;
                }

                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .safety-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .safety-header h3 {
                    font-size: 1rem;
                    color: white;
                    margin: 0;
                }

                .requirements-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .requirement-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }

                .requirement-icon {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .requirement-content {
                    flex: 1;
                }

                .requirement-title {
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.25rem;
                }

                .requirement-desc {
                    font-size: 0.875rem;
                    color: #94a3b8;
                    line-height: 1.4;
                }

                .action-section {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1.125rem;
                    border-radius: 16px;
                    font-weight: 600;
                    font-size: 1rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    backdrop-filter: blur(10px);
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .btn-danger {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                }

                .btn-danger:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
                }

                .btn-large {
                    padding: 1.25rem;
                }

                .btn-full {
                    width: 100%;
                }

                .status-bar {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(15, 23, 42, 0.95);
                    backdrop-filter: blur(20px);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    z-index: 1000;
                }

                .status-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                }

                .status-item span {
                    font-size: 0.75rem;
                    color: #94a3b8;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                @media (max-width: 480px) {
                    .duration-time {
                        font-size: 3rem;
                    }
                    
                    .info-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ActiveTrip;
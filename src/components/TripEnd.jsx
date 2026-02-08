import { useState } from 'react';
import {
    getCurrentPosition,
    areLocationsWithinRange
} from '../utils/gpsUtils';
import {
    getCurrentSession,
    getDriversForVehicle,
    endTrip,
    logoutDriver,
    addAdminNotification
} from '../utils/storageUtils';

const TripEnd = ({ vehicleNumber, onTripEnded, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAdminNotification, setShowAdminNotification] = useState(false);

    const session = getCurrentSession();

    const handleEndTrip = async () => {
        setLoading(true);
        setError('');

        try {
            const currentLocation = await getCurrentPosition();
            const allDrivers = getDriversForVehicle(vehicleNumber);
            const otherDrivers = allDrivers.filter(d => d.phone !== session.phone && d.location);

            if (otherDrivers.length === 0) {
                endTrip(vehicleNumber);
                logoutDriver(vehicleNumber, session.phone);
                setTimeout(() => {
                    onTripEnded(true);
                }, 1000);
                return;
            }

            const withinRange = otherDrivers.some(driver =>
                areLocationsWithinRange(currentLocation, driver.location, 90)
            );

            if (withinRange) {
                endTrip(vehicleNumber);
                logoutDriver(vehicleNumber, session.phone);
                setTimeout(() => {
                    onTripEnded(true);
                }, 1000);
            } else {
                const notification = {
                    type: 'Distance Violation',
                    severity: 'warning',
                    vehicle: vehicleNumber,
                    driverPhone: session.phone,
                    driverName: session.name,
                    message: `Driver ${session.name || session.phone} attempted to end trip outside 90-meter range`,
                    timestamp: new Date().toISOString()
                };

                addAdminNotification(notification);
                setShowAdminNotification(true);
                setLoading(false);
            }
        } catch (err) {
            setError(err.message || 'Failed to verify location. Please enable GPS and try again.');
            setLoading(false);
        }
    };

    const handleForceEnd = () => {
        endTrip(vehicleNumber);
        logoutDriver(vehicleNumber, session.phone);
        setTimeout(() => {
            onTripEnded(false);
        }, 1000);
    };

    if (showAdminNotification) {
        return (
            <div className="app-container">
                {/* Header with App Bar */}
                <div className="app-bar warning">
                    <button onClick={onCancel} className="back-btn warning">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5" />
                            <path d="m12 19-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="app-logo">
                        <div className="logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="m15 9-6 6" />
                                <path d="m9 9 6 6" />
                            </svg>
                        </div>
                        <span className="logo-text">Distance Violation</span>
                    </div>
                </div>

                {/* Warning Hero Section */}
                <div className="hero-section warning">
                    <div className="hero-content">
                        <div className="warning-icon">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <h1 className="hero-title">Logout Blocked</h1>
                        <p className="hero-subtitle">Cannot end trip - drivers are too far apart</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <div className="card elevated">
                        <div className="distance-violation-content">
                            <div className="distance-info">
                                <div className="distance-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                </div>
                                <h3 className="distance-title">Proximity Rule Violated</h3>
                                <p className="distance-description">
                                    All drivers must be within <strong>90 meters</strong> of each other to end the trip.
                                </p>
                            </div>

                            <div className="notification-alert">
                                <div className="alert-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                </div>
                                <div className="alert-content">
                                    <h4 className="alert-title">Admin Notification Sent</h4>
                                    <p className="alert-description">
                                        The administrator has been notified about this distance mismatch.
                                        Please coordinate with other drivers or contact admin for assistance.
                                    </p>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button
                                    onClick={onCancel}
                                    className="btn btn-secondary btn-large"
                                >
                                    <div className="btn-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 12H5" />
                                            <path d="m12 19-7-7 7-7" />
                                        </svg>
                                    </div>
                                    Return to Trip
                                </button>
                                <button
                                    onClick={handleForceEnd}
                                    className="btn btn-danger btn-large"
                                >
                                    <div className="btn-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    </div>
                                    Force End Trip (Admin Override)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .app-container {
                        max-width: 480px;
                        margin: 0 auto;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                        position: relative;
                        overflow-x: hidden;
                    }

                    .app-bar {
                        background: rgba(255, 255, 255, 0.15);
                        backdrop-filter: blur(10px);
                        padding: 1rem 1.5rem;
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }

                    .app-bar.warning {
                        background: rgba(217, 119, 6, 0.2);
                    }

                    .back-btn {
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        width: 40px;
                        height: 40px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        color: white;
                    }

                    .back-btn.warning {
                        background: rgba(255, 255, 255, 0.3);
                    }

                    .app-logo {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        flex: 1;
                    }

                    .logo-icon {
                        color: white;
                        width: 24px;
                        height: 24px;
                    }

                    .logo-text {
                        font-size: 1.125rem;
                        font-weight: 600;
                        color: white;
                    }

                    .hero-section {
                        padding: 2rem 1.5rem 3rem;
                        position: relative;
                        overflow: hidden;
                    }

                    .hero-section.warning {
                        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    }

                    .hero-content {
                        position: relative;
                        z-index: 2;
                        text-align: center;
                    }

                    .warning-icon {
                        margin-bottom: 1.5rem;
                        color: white;
                    }

                    .hero-title {
                        font-size: 2rem;
                        font-weight: 700;
                        color: white;
                        margin-bottom: 0.5rem;
                        line-height: 1.2;
                    }

                    .hero-subtitle {
                        font-size: 1rem;
                        color: rgba(255, 255, 255, 0.9);
                        max-width: 320px;
                        margin: 0 auto;
                    }

                    .main-content {
                        background: white;
                        border-radius: 32px 32px 0 0;
                        min-height: calc(100vh - 200px);
                        position: relative;
                        z-index: 2;
                        padding-bottom: 2rem;
                    }

                    .card {
                        background: white;
                        border-radius: 24px;
                        padding: 1.5rem;
                    }

                    .card.elevated {
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                        margin: -2rem 1.5rem 0;
                        position: relative;
                    }

                    .distance-violation-content {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                    }

                    .distance-info {
                        text-align: center;
                        padding: 1rem;
                    }

                    .distance-icon {
                        color: #f59e0b;
                        margin-bottom: 1rem;
                    }

                    .distance-title {
                        font-size: 1.5rem;
                        font-weight: 600;
                        color: #1f2937;
                        margin-bottom: 0.75rem;
                    }

                    .distance-description {
                        color: #6b7280;
                        font-size: 0.95rem;
                        line-height: 1.5;
                    }

                    .distance-description strong {
                        color: #92400e;
                    }

                    .notification-alert {
                        background: #fef3c7;
                        border: 1px solid #f59e0b;
                        border-radius: 12px;
                        padding: 1.25rem;
                        display: flex;
                        gap: 1rem;
                    }

                    .alert-icon {
                        color: #92400e;
                        width: 24px;
                        height: 24px;
                        flex-shrink: 0;
                    }

                    .alert-content {
                        flex: 1;
                    }

                    .alert-title {
                        font-size: 1rem;
                        font-weight: 600;
                        color: #92400e;
                        margin-bottom: 0.5rem;
                    }

                    .alert-description {
                        font-size: 0.875rem;
                        color: #92400e;
                        line-height: 1.4;
                        opacity: 0.9;
                    }

                    .action-buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                        padding: 1rem;
                        border-radius: 12px;
                        font-weight: 600;
                        font-size: 1rem;
                        border: none;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    .btn-secondary {
                        background: #f3f4f6;
                        color: #374151;
                    }

                    .btn-secondary:hover {
                        background: #e5e7eb;
                    }

                    .btn-danger {
                        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                        color: white;
                    }

                    .btn-danger:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
                    }

                    .btn-large {
                        padding: 1.125rem;
                        font-size: 1rem;
                    }

                    .btn-full {
                        width: 100%;
                    }

                    .btn-icon {
                        width: 18px;
                        height: 18px;
                    }

                    @media (max-width: 480px) {
                        .hero-title {
                            font-size: 1.75rem;
                        }
                        
                        .card.elevated {
                            margin: -2rem 1rem 0;
                            padding: 1.25rem;
                        }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="app-container">
            {/* Header with App Bar */}
            <div className="app-bar">
                <button onClick={onCancel} className="back-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5" />
                        <path d="m12 19-7-7 7-7" />
                    </svg>
                </button>
                <div className="app-logo">
                    <div className="logo-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <span className="logo-text">End Trip</span>
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

            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Verify Location</h1>
                    <p className="hero-subtitle">Confirm proximity before ending trip</p>
                </div>
                <div className="hero-decoration">
                    <div className="decoration-circle circle-1"></div>
                    <div className="decoration-circle circle-2"></div>
                    <div className="decoration-circle circle-3"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="card elevated">
                    {/* Trip Summary */}
                    <div className="trip-summary">
                        <h3 className="summary-title">Trip Summary</h3>
                        <div className="summary-grid">
                            <div className="summary-item">
                                <div className="summary-label">
                                    <div className="summary-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="1" y="8" width="22" height="12" rx="2" />
                                            <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
                                            <circle cx="7" cy="16" r="2" />
                                            <circle cx="17" cy="16" r="2" />
                                        </svg>
                                    </div>
                                    Vehicle
                                </div>
                                <div className="summary-value">{vehicleNumber}</div>
                            </div>
                            <div className="summary-item">
                                <div className="summary-label">
                                    <div className="summary-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                    Driver
                                </div>
                                <div className="summary-value">{session?.name || 'You'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="error-alert">
                            <div className="alert-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <div className="alert-content">
                                <p className="alert-text">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Location Verification Warning */}
                    <div className="verification-warning">
                        <div className="warning-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div className="warning-content">
                            <h4 className="warning-title">Location Verification Required</h4>
                            <p className="warning-description">
                                We will verify that all drivers are within <strong>90 meters</strong> before ending the trip.
                                No photos required for logout.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            onClick={handleEndTrip}
                            className="btn btn-danger btn-large btn-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Verifying Location...
                                </>
                            ) : (
                                <>
                                    <div className="btn-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    </div>
                                    End Trip Now
                                </>
                            )}
                        </button>
                        <button
                            onClick={onCancel}
                            className="btn btn-secondary btn-large btn-full"
                        >
                            <div className="btn-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5" />
                                    <path d="m12 19-7-7 7-7" />
                                </svg>
                            </div>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .app-container {
                    max-width: 480px;
                    margin: 0 auto;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    position: relative;
                    overflow-x: hidden;
                }

                .app-bar {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    padding: 1rem 1.5rem;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .back-btn {
                    background: rgba(255, 255, 255, 0.15);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: white;
                }

                .app-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }

                .logo-icon {
                    color: white;
                    width: 24px;
                    height: 24px;
                }

                .logo-text {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: white;
                }

                .vehicle-badge {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 12px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .hero-section {
                    padding: 2rem 1.5rem 3rem;
                    position: relative;
                    overflow: hidden;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                }

                .hero-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.5rem;
                    line-height: 1.2;
                }

                .hero-subtitle {
                    font-size: 1rem;
                    color: rgba(255, 255, 255, 0.9);
                    max-width: 320px;
                }

                .hero-decoration {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    overflow: hidden;
                }

                .decoration-circle {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                }

                .circle-1 {
                    width: 200px;
                    height: 200px;
                    top: -100px;
                    right: -100px;
                }

                .circle-2 {
                    width: 150px;
                    height: 150px;
                    bottom: -75px;
                    left: -75px;
                }

                .circle-3 {
                    width: 100px;
                    height: 100px;
                    bottom: 50px;
                    right: 50px;
                }

                .main-content {
                    background: white;
                    border-radius: 32px 32px 0 0;
                    min-height: calc(100vh - 200px);
                    position: relative;
                    z-index: 2;
                    padding-bottom: 2rem;
                }

                .card {
                    background: white;
                    border-radius: 24px;
                    padding: 1.5rem;
                }

                .card.elevated {
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    margin: -2rem 1.5rem 0;
                    position: relative;
                }

                .trip-summary {
                    margin-bottom: 2rem;
                }

                .summary-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 1.5rem;
                }

                .summary-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                }

                .summary-label {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #6b7280;
                    font-size: 0.95rem;
                }

                .summary-icon {
                    color: #667eea;
                    width: 18px;
                    height: 18px;
                }

                .summary-value {
                    font-weight: 600;
                    color: #1f2937;
                    font-size: 0.95rem;
                }

                .error-alert {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 12px;
                    padding: 1rem;
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .error-alert .alert-icon {
                    color: #dc2626;
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                }

                .alert-content {
                    flex: 1;
                }

                .alert-text {
                    color: #dc2626;
                    font-size: 0.875rem;
                    line-height: 1.4;
                }

                .verification-warning {
                    background: #fffbeb;
                    border: 1px solid #fde68a;
                    border-radius: 12px;
                    padding: 1.25rem;
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .warning-icon {
                    color: #d97706;
                    width: 24px;
                    height: 24px;
                    flex-shrink: 0;
                }

                .warning-content {
                    flex: 1;
                }

                .warning-title {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #92400e;
                    margin-bottom: 0.5rem;
                }

                .warning-description {
                    font-size: 0.875rem;
                    color: #92400e;
                    line-height: 1.4;
                    opacity: 0.9;
                }

                .warning-description strong {
                    color: #92400e;
                }

                .action-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-danger {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                }

                .btn-danger:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
                }

                .btn-danger:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .btn-large {
                    padding: 1.125rem;
                    font-size: 1rem;
                }

                .btn-full {
                    width: 100%;
                }

                .btn-icon {
                    width: 18px;
                    height: 18px;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 480px) {
                    .hero-title {
                        font-size: 1.75rem;
                    }
                    
                    .card.elevated {
                        margin: -2rem 1rem 0;
                        padding: 1.25rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default TripEnd;
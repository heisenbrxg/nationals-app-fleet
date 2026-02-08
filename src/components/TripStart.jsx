import { useState, useEffect, useRef } from 'react';
import {
    getCurrentPosition,
    areLocationsWithinRange
} from '../utils/gpsUtils';
import {
    getCurrentSession,
    getDriversForVehicle,
    saveDriverLocation,
    saveDriverSelfie,
    saveBusPhotos,
    startTrip
} from '../utils/storageUtils';

const TripStart = ({ vehicleNumber, onTripStarted, onBack }) => {
    const [step, setStep] = useState(1); // 1: GPS, 2: Selfie, 3: Bus Photos
    const [selfie, setSelfie] = useState(null);
    const [busPhotos, setBusPhotos] = useState([]);
    const [gpsStatus, setGpsStatus] = useState('checking'); // checking, granted, denied
    const [locationError, setLocationError] = useState('');
    const [distanceError, setDistanceError] = useState('');
    const [loading, setLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const selfieInputRef = useRef(null);
    const busPhotoInputRef = useRef(null);

    const session = getCurrentSession();

    // Check GPS permission on mount
    useEffect(() => {
        checkGPSPermission();
    }, []);

    const checkGPSPermission = async () => {
        try {
            setGpsStatus('checking');
            const position = await getCurrentPosition();

            // Save current driver location
            saveDriverLocation(vehicleNumber, session.phone, position);

            // Check if other drivers are within range
            const allDrivers = getDriversForVehicle(vehicleNumber);
            const otherDrivers = allDrivers.filter(d => d.phone !== session.phone && d.location);

            if (otherDrivers.length > 0) {
                const withinRange = otherDrivers.some(driver =>
                    areLocationsWithinRange(position, driver.location, 90)
                );

                if (!withinRange) {
                    setDistanceError('All drivers must be within 90 meters to start the trip');
                    setGpsStatus('denied');
                    setRetryCount(prev => prev + 1);
                    return;
                }
            }

            setGpsStatus('granted');
            setStep(2); // Move to selfie capture
        } catch (error) {
            setLocationError(error.message || 'Unable to access your location');
            setGpsStatus('denied');
            setRetryCount(prev => prev + 1);
        }
    };

    const handleSelfieCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelfie(reader.result);
                saveDriverSelfie(vehicleNumber, session.phone, reader.result);
                setStep(3); // Move to bus photos
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBusPhotoCapture = (e) => {
        const file = e.target.files[0];
        if (file && busPhotos.length < 3) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhotos = [...busPhotos, reader.result];
                setBusPhotos(newPhotos);
                if (newPhotos.length === 3) {
                    saveBusPhotos(vehicleNumber, newPhotos);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleStartTrip = async () => {
        if (busPhotos.length !== 3) {
            alert('Please capture all 3 bus photos');
            return;
        }

        setLoading(true);

        // Final location check
        try {
            const position = await getCurrentPosition();
            const allDrivers = getDriversForVehicle(vehicleNumber);
            const otherDrivers = allDrivers.filter(d => d.phone !== session.phone && d.location);

            if (otherDrivers.length > 0) {
                const withinRange = otherDrivers.some(driver =>
                    areLocationsWithinRange(position, driver.location, 90)
                );

                if (!withinRange) {
                    setDistanceError('All drivers must be within 90 meters to start the trip');
                    setLoading(false);
                    return;
                }
            }

            startTrip(vehicleNumber);
            onTripStarted();
        } catch (error) {
            setLocationError(error.message);
            setLoading(false);
        }
    };

    const handleRemovePhoto = (index) => {
        const newPhotos = busPhotos.filter((_, i) => i !== index);
        setBusPhotos(newPhotos);
    };

    return (
        <div className="app-container">
            {/* Header with App Bar */}
            <div className="app-bar">
                <button onClick={onBack} className="back-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5" />
                        <path d="m12 19-7-7 7-7" />
                    </svg>
                </button>
                <div className="app-logo">
                    <div className="logo-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="logo-text">Start Trip</span>
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
                    <h1 className="hero-title">Pre-Trip Verification</h1>
                    <p className="hero-subtitle">Complete all steps to begin your journey</p>
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
                    {/* Progress Steps */}
                    <div className="progress-steps">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <div className="progress-step-circle">
                                {step > 1 ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : '1'}
                            </div>
                            <span className="progress-step-label">Location</span>
                        </div>
                        <div className={`progress-line ${step >= 2 ? 'completed' : ''}`}></div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <div className="progress-step-circle">
                                {step > 2 ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : '2'}
                            </div>
                            <span className="progress-step-label">Selfie</span>
                        </div>
                        <div className={`progress-line ${step >= 3 ? 'completed' : ''}`}></div>
                        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                            <div className="progress-step-circle">3</div>
                            <span className="progress-step-label">Bus Photos</span>
                        </div>
                    </div>

                    {/* Step 1: GPS Check */}
                    {step === 1 && (
                        <div className="step-content">
                            <div className="step-header">
                                <div className="step-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <h3 className="step-title">Location Verification</h3>
                                <p className="step-subtitle">We need to verify your location to ensure all drivers are together</p>
                            </div>

                            {gpsStatus === 'checking' && (
                                <div className="verification-loading">
                                    <div className="spinner large"></div>
                                    <h4 className="loading-title">Checking GPS Location</h4>
                                    <p className="loading-text">Please allow location access when prompted</p>
                                </div>
                            )}

                            {gpsStatus === 'denied' && (
                                <div className="verification-failed">
                                    <div className="failed-icon">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="15" y1="9" x2="9" y2="15" />
                                            <line x1="9" y1="9" x2="15" y2="15" />
                                        </svg>
                                    </div>
                                    <h4 className="failed-title">Location Access Required</h4>
                                    <p className="failed-description">
                                        {distanceError || locationError || 'Unable to access your GPS location'}
                                    </p>
                                    {retryCount > 0 && (
                                        <p className="retry-count">Retry attempt: {retryCount}</p>
                                    )}
                                    <button
                                        onClick={checkGPSPermission}
                                        className="btn btn-primary btn-large btn-full"
                                    >
                                        <div className="btn-icon">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                                            </svg>
                                        </div>
                                        Retry GPS Check
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Selfie Capture */}
                    {step === 2 && (
                        <div className="step-content">
                            <div className="step-header">
                                <div className="step-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                </div>
                                <h3 className="step-title">Driver Selfie Verification</h3>
                                <p className="step-subtitle">Take a clear selfie for driver identification</p>
                            </div>

                            <div className="selfie-upload">
                                {!selfie ? (
                                    <div
                                        className="upload-area"
                                        onClick={() => selfieInputRef.current?.click()}
                                    >
                                        <div className="upload-icon">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                <circle cx="12" cy="13" r="4" />
                                            </svg>
                                        </div>
                                        <p className="upload-text">Tap to capture selfie</p>
                                        <p className="upload-hint">Use front camera to take a clear photo</p>
                                        <input
                                            ref={selfieInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="user"
                                            style={{ display: 'none' }}
                                            onChange={handleSelfieCapture}
                                        />
                                    </div>
                                ) : (
                                    <div className="selfie-preview">
                                        <div className="preview-header">
                                            <h4>Selfie Preview</h4>
                                            <button
                                                className="btn btn-small btn-outline"
                                                onClick={() => setSelfie(null)}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                                Retake
                                            </button>
                                        </div>
                                        <div className="preview-image">
                                            <img src={selfie} alt="Driver selfie" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="instruction-card">
                                <div className="instruction-icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="16" x2="12" y2="12" />
                                        <line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                </div>
                                <div className="instruction-content">
                                    <h4 className="instruction-title">Important Instructions</h4>
                                    <ul className="instruction-list">
                                        <li>Ensure your face is clearly visible</li>
                                        <li>Use good lighting for better clarity</li>
                                        <li>Remove sunglasses or hats if possible</li>
                                        <li>Look directly at the camera</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Bus Photos */}
                    {step === 3 && (
                        <div className="step-content">
                            <div className="step-header">
                                <div className="step-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="1" y="8" width="22" height="12" rx="2" />
                                        <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
                                        <circle cx="7" cy="16" r="2" />
                                        <circle cx="17" cy="16" r="2" />
                                    </svg>
                                </div>
                                <h3 className="step-title">Vehicle Documentation</h3>
                                <p className="step-subtitle">Capture photos of the vehicle from different angles</p>
                            </div>

                            <div className="photo-requirements">
                                <div className="requirements-header">
                                    <span className="progress-count">{busPhotos.length}/3 photos captured</span>
                                </div>

                                <div className="photo-grid">
                                    {[0, 1, 2].map((index) => (
                                        <div key={index} className="photo-slot">
                                            {busPhotos[index] ? (
                                                <div className="photo-preview">
                                                    <img src={busPhotos[index]} alt={`Bus photo ${index + 1}`} />
                                                    <button
                                                        className="remove-photo"
                                                        onClick={() => handleRemovePhoto(index)}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <line x1="15" y1="9" x2="9" y2="15" />
                                                            <line x1="9" y1="9" x2="15" y2="15" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="photo-empty"
                                                    onClick={() => busPhotoInputRef.current?.click()}
                                                >
                                                    <div className="photo-icon">
                                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <rect x="1" y="8" width="22" height="12" rx="2" />
                                                            <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
                                                            <circle cx="7" cy="16" r="2" />
                                                            <circle cx="17" cy="16" r="2" />
                                                        </svg>
                                                    </div>
                                                    <span className="photo-label">Photo {index + 1}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <input
                                    ref={busPhotoInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    style={{ display: 'none' }}
                                    onChange={handleBusPhotoCapture}
                                />

                                <div className="photo-instructions">
                                    <div className="instruction-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                    </div>
                                    <div className="instruction-content">
                                        <h4>Photo Requirements</h4>
                                        <p>Capture clear photos of:</p>
                                        <ul>
                                            <li>Front view of the vehicle</li>
                                            <li>Left side view</li>
                                            <li>Right side view</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {busPhotos.length === 3 && (
                                <div className="action-section">
                                    <button
                                        onClick={handleStartTrip}
                                        className="btn btn-success btn-large btn-full"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner"></span>
                                                Starting Trip...
                                            </>
                                        ) : (
                                            <>
                                                <div className="btn-icon">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                                Start Trip
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
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

                .progress-steps {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2.5rem;
                    padding: 0 1rem;
                }

                .progress-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    position: relative;
                }

                .progress-step-circle {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #e5e7eb;
                    color: #6b7280;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                }

                .progress-step.active .progress-step-circle {
                    background: #667eea;
                    color: white;
                }

                .progress-step.completed .progress-step-circle {
                    background: #22c55e;
                    color: white;
                }

                .progress-step-label {
                    font-size: 0.75rem;
                    color: #9ca3af;
                    font-weight: 500;
                    white-space: nowrap;
                }

                .progress-step.active .progress-step-label {
                    color: #374151;
                    font-weight: 600;
                }

                .progress-line {
                    width: 60px;
                    height: 2px;
                    background: #e5e7eb;
                    margin: 0 0.5rem;
                }

                .progress-line.completed {
                    background: #667eea;
                }

                .step-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .step-header {
                    text-align: center;
                }

                .step-icon {
                    color: #667eea;
                    margin-bottom: 1rem;
                }

                .step-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                }

                .step-subtitle {
                    color: #6b7280;
                    font-size: 0.95rem;
                    max-width: 320px;
                    margin: 0 auto;
                }

                .verification-loading {
                    text-align: center;
                    padding: 2rem 0;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e5e7eb;
                    border-top-color: #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1.5rem;
                }

                .spinner.large {
                    width: 60px;
                    height: 60px;
                    border-width: 4px;
                }

                .loading-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }

                .loading-text {
                    color: #6b7280;
                    font-size: 0.95rem;
                }

                .verification-failed {
                    text-align: center;
                    padding: 1rem 0;
                }

                .failed-icon {
                    color: #ef4444;
                    margin-bottom: 1.5rem;
                }

                .failed-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.75rem;
                }

                .failed-description {
                    color: #6b7280;
                    font-size: 0.95rem;
                    margin-bottom: 1.5rem;
                    max-width: 320px;
                    margin: 0 auto 1.5rem;
                }

                .retry-count {
                    font-size: 0.875rem;
                    color: #9ca3af;
                    margin-bottom: 1.5rem;
                }

                .selfie-upload {
                    margin: 0 auto;
                    max-width: 320px;
                }

                .upload-area {
                    border: 2px dashed #d1d5db;
                    border-radius: 16px;
                    padding: 3rem 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .upload-area:hover {
                    border-color: #667eea;
                    background: #f8fafc;
                }

                .upload-icon {
                    color: #667eea;
                    margin-bottom: 1rem;
                }

                .upload-text {
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.5rem;
                }

                .upload-hint {
                    color: #9ca3af;
                    font-size: 0.875rem;
                }

                .selfie-preview {
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .preview-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: #f8fafc;
                    border-bottom: 1px solid #e5e7eb;
                }

                .preview-header h4 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #374151;
                }

                .btn-small {
                    padding: 0.375rem 0.75rem;
                    font-size: 0.875rem;
                }

                .btn-outline {
                    background: transparent;
                    border: 1px solid #d1d5db;
                    color: #374151;
                }

                .btn-outline:hover {
                    background: #f3f4f6;
                }

                .preview-image {
                    padding: 1rem;
                    text-align: center;
                }

                .preview-image img {
                    max-width: 100%;
                    border-radius: 8px;
                }

                .instruction-card {
                    background: #f0f7ff;
                    border: 1px solid #dbeafe;
                    border-radius: 12px;
                    padding: 1.25rem;
                    display: flex;
                    gap: 1rem;
                }

                .instruction-icon {
                    color: #3b82f6;
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                }

                .instruction-content {
                    flex: 1;
                }

                .instruction-title {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #1e40af;
                    margin-bottom: 0.5rem;
                }

                .instruction-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .instruction-list li {
                    font-size: 0.875rem;
                    color: #374151;
                    margin-bottom: 0.25rem;
                    position: relative;
                    padding-left: 1.25rem;
                }

                .instruction-list li:before {
                    content: '•';
                    position: absolute;
                    left: 0;
                    color: #3b82f6;
                }

                .photo-requirements {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .requirements-header {
                    text-align: center;
                }

                .progress-count {
                    display: inline-block;
                    background: #667eea;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .photo-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }

                .photo-slot {
                    aspect-ratio: 4/3;
                }

                .photo-empty {
                    height: 100%;
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .photo-empty:hover {
                    border-color: #667eea;
                    background: #f8fafc;
                }

                .photo-icon {
                    color: #667eea;
                    margin-bottom: 0.5rem;
                }

                .photo-label {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .photo-preview {
                    position: relative;
                    height: 100%;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .photo-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .remove-photo {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    width: 28px;
                    height: 28px;
                    background: rgba(239, 68, 68, 0.9);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .photo-instructions {
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1.25rem;
                    display: flex;
                    gap: 1rem;
                }

                .photo-instructions h4 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #374151;
                }

                .photo-instructions p {
                    color: #6b7280;
                    font-size: 0.875rem;
                    margin-bottom: 0.5rem;
                }

                .photo-instructions ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .photo-instructions li {
                    font-size: 0.875rem;
                    color: #374151;
                    margin-bottom: 0.25rem;
                    position: relative;
                    padding-left: 1.25rem;
                }

                .photo-instructions li:before {
                    content: '•';
                    position: absolute;
                    left: 0;
                    color: #667eea;
                }

                .action-section {
                    margin-top: 2rem;
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

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                }

                .btn-success {
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    color: white;
                }

                .btn-success:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
                }

                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
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
                    
                    .progress-line {
                        width: 40px;
                    }
                    
                    .photo-grid {
                        gap: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default TripStart;
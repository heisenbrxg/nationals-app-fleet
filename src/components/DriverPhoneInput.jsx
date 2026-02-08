import { useState } from 'react';

const DriverPhoneInput = ({ vehicleNumber, onDriversSet, onBack }) => {
    const [driver1Phone, setDriver1Phone] = useState('');
    const [driver2Phone, setDriver2Phone] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validatePhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!driver1Phone) {
            newErrors.driver1 = 'Driver 1 phone number is required';
        } else if (!validatePhone(driver1Phone)) {
            newErrors.driver1 = 'Please enter a valid 10-digit Indian phone number';
        }

        if (!driver2Phone) {
            newErrors.driver2 = 'Driver 2 phone number is required';
        } else if (!validatePhone(driver2Phone)) {
            newErrors.driver2 = 'Please enter a valid 10-digit Indian phone number';
        }

        if (driver1Phone === driver2Phone) {
            newErrors.driver2 = 'Driver phone numbers must be different';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            onDriversSet({ driver1Phone, driver2Phone });
        }, 500);
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
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <span className="logo-text">Driver Setup</span>
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
                    <div className="progress-header">
                        <div className="progress-step completed">
                            <div className="step-number">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <div className="step-label">Vehicle</div>
                        </div>
                        <div className="progress-line completed"></div>
                        <div className="progress-step active">
                            <div className="step-number">2</div>
                            <div className="step-label">Drivers</div>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div className="step-number">3</div>
                            <div className="step-label">Login</div>
                        </div>
                    </div>

                    <h1 className="hero-title">Driver Information</h1>
                    <p className="hero-subtitle">Enter phone numbers for both drivers</p>
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
                    <form onSubmit={handleSubmit}>
                        <div className="driver-input-section">
                            {/* Driver 1 Input */}
                            <div className="input-group">
                                <label className="input-label">
                                    <div className="label-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    Driver 1 Phone Number
                                    <span className="required">*</span>
                                </label>
                                <div className="phone-input-wrapper">
                                    <div className="country-code">+91</div>
                                    <input
                                        type="tel"
                                        className={`phone-input ${errors.driver1 ? 'error' : ''}`}
                                        placeholder="Enter 10-digit number"
                                        value={driver1Phone}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setDriver1Phone(value);
                                            setErrors({ ...errors, driver1: '' });
                                        }}
                                        maxLength="10"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.driver1 && (
                                    <div className="error-message">
                                        <div className="error-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                        </div>
                                        {errors.driver1}
                                    </div>
                                )}
                                <div className="input-description">
                                    Primary driver contact number
                                </div>
                            </div>

                            {/* Driver 2 Input */}
                            <div className="input-group">
                                <label className="input-label">
                                    <div className="label-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    Driver 2 Phone Number
                                    <span className="required">*</span>
                                </label>
                                <div className="phone-input-wrapper">
                                    <div className="country-code">+91</div>
                                    <input
                                        type="tel"
                                        className={`phone-input ${errors.driver2 ? 'error' : ''}`}
                                        placeholder="Enter 10-digit number"
                                        value={driver2Phone}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setDriver2Phone(value);
                                            setErrors({ ...errors, driver2: '' });
                                        }}
                                        maxLength="10"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.driver2 && (
                                    <div className="error-message">
                                        <div className="error-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                        </div>
                                        {errors.driver2}
                                    </div>
                                )}
                                <div className="input-description">
                                    Secondary driver contact number
                                </div>
                            </div>
                        </div>

                        {/* Important Information Card */}
                        <div className="info-card">
                            <div className="info-card-header">
                                <div className="info-card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="16" x2="12" y2="12" />
                                        <line x1="12" y1="8" x2="12.01" y2="8" />
                                    </svg>
                                </div>
                                <h4 className="info-card-title">Important Information</h4>
                            </div>
                            <div className="info-content">
                                <p className="info-text">
                                    Each driver must log in separately on their own mobile device using the phone number provided above.
                                </p>
                                <ul className="info-list">
                                    <li className="info-list-item">
                                        <div className="list-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="16 12 12 8 8 12" />
                                                <line x1="12" y1="16" x2="12" y2="8" />
                                            </svg>
                                        </div>
                                        Separate login required for each driver
                                    </li>
                                    <li className="info-list-item">
                                        <div className="list-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                        </div>
                                        Drivers can only use their own registered devices
                                    </li>
                                    <li className="info-list-item">
                                        <div className="list-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="3" />
                                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                            </svg>
                                        </div>
                                        System tracks all drivers for the same vehicle
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button
                                type="button"
                                onClick={onBack}
                                className="btn btn-secondary btn-large"
                                disabled={loading}
                            >
                                <div className="btn-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5" />
                                        <path d="m12 19-7-7 7-7" />
                                    </svg>
                                </div>
                                Back to Vehicle
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary btn-large"
                                disabled={loading || !driver1Phone || !driver2Phone}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <div className="btn-icon">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <polyline points="22 4 12 14.01 9 11.01" />
                                            </svg>
                                        </div>
                                        Set Drivers & Continue
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
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
                    padding: 1.5rem 1.5rem 2.5rem;
                    position: relative;
                    overflow: hidden;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                }

                .progress-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2rem;
                }

                .progress-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    position: relative;
                }

                .step-number {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                }

                .progress-step.completed .step-number {
                    background: #22c55e;
                }

                .progress-step.active .step-number {
                    background: white;
                    color: #667eea;
                }

                .step-label {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 500;
                }

                .progress-line {
                    width: 60px;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.2);
                    margin: 0 0.5rem;
                }

                .progress-line.completed {
                    background: white;
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

                .driver-input-section {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    margin-bottom: 2rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .input-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    color: #374151;
                    font-size: 1rem;
                }

                .label-icon {
                    color: #667eea;
                    width: 18px;
                    height: 18px;
                }

                .required {
                    color: #ef4444;
                    margin-left: 0.25rem;
                }

                .phone-input-wrapper {
                    display: flex;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .phone-input-wrapper:focus-within {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .country-code {
                    padding: 1rem 1rem 1rem 1.5rem;
                    background: #f1f5f9;
                    color: #64748b;
                    font-weight: 500;
                    border-right: 1px solid #e2e8f0;
                }

                .phone-input {
                    flex: 1;
                    padding: 1rem 1.5rem;
                    border: none;
                    background: transparent;
                    font-size: 1rem;
                    color: #1e293b;
                    outline: none;
                }

                .phone-input.error {
                    color: #ef4444;
                }

                .phone-input:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .input-description {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin-top: 0.25rem;
                }

                .error-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #ef4444;
                    font-size: 0.875rem;
                    padding: 0.75rem;
                    background: #fef2f2;
                    border-radius: 8px;
                }

                .error-icon {
                    width: 14px;
                    height: 14px;
                }

                .info-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                }

                .info-card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.25rem;
                }

                .info-card-icon {
                    color: #667eea;
                    width: 24px;
                    height: 24px;
                }

                .info-card-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1f2937;
                }

                .info-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .info-text {
                    font-size: 0.95rem;
                    color: #475569;
                    line-height: 1.5;
                }

                .info-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .info-list-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    font-size: 0.875rem;
                    color: #475569;
                    line-height: 1.4;
                }

                .list-icon {
                    color: #667eea;
                    width: 14px;
                    height: 14px;
                    flex-shrink: 0;
                    margin-top: 0.125rem;
                }

                .action-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                }

                .btn {
                    flex: 1;
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
                    background: #f1f5f9;
                    color: #475569;
                }

                .btn-secondary:hover:not(:disabled) {
                    background: #e2e8f0;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
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
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                    
                    .progress-line {
                        width: 40px;
                    }
                }
            `}</style>
        </div>
    );
};

export default DriverPhoneInput;
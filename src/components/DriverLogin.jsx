// COMPONENT: DriverLogin - Modern Redesign
import { useState } from 'react';
import { saveDriverLogin } from '../utils/storageUtils';

const DriverLogin = ({ vehicleNumber, onLoginSuccess, onBack }) => {
    const [phone, setPhone] = useState('');
    const [driverName, setDriverName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!phone) {
            setError('Please enter your phone number');
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            setError('Please enter a valid 10-digit Indian phone number');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            saveDriverLogin(vehicleNumber, phone, driverName);
            onLoginSuccess();
        }, 1000);
    };

    return (
        <div className="app-container">
            <div className="app-bar">
                <button onClick={onBack} className="back-btn">
                    <i className="icon icon-arrow-left"></i>
                </button>
                <div className="app-logo">
                    <span className="logo-icon">👤</span>
                    <span className="logo-text">Driver Login</span>
                </div>
                <div className="vehicle-badge">
                    <i className="icon icon-vehicle-small"></i>
                    {vehicleNumber}
                </div>
            </div>

            <div className="content-wrapper">
                <div className="progress-header">
                    <div className="progress-step active">
                        <div className="step-number">1</div>
                        <div className="step-label">Vehicle</div>
                    </div>
                    <div className="progress-line active"></div>
                    <div className="progress-step active">
                        <div className="step-number">2</div>
                        <div className="step-label">Login</div>
                    </div>
                    <div className="progress-line"></div>
                    <div className="progress-step">
                        <div className="step-number">3</div>
                        <div className="step-label">Trip</div>
                    </div>
                </div>

                <div className="main-content">
                    <div className="welcome-card">
                        <div className="welcome-icon">👋</div>
                        <h1 className="welcome-title">Welcome, Driver!</h1>
                        <p className="welcome-subtitle">
                            Log in to start your trip with vehicle <strong>{vehicleNumber}</strong>
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label className="input-label">
                                <i className="icon icon-phone"></i>
                                Phone Number
                                <span className="required">*</span>
                            </label>
                            <div className="input-wrapper">
                                <div className="country-code">+91</div>
                                <input
                                    type="tel"
                                    className={`phone-input ${error ? 'error' : ''}`}
                                    placeholder="Enter 10-digit number"
                                    value={phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setPhone(value);
                                        setError('');
                                    }}
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                            {error && (
                                <div className="error-message">
                                    <i className="icon icon-error"></i>
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label className="input-label">
                                <i className="icon icon-user"></i>
                                Your Name (Optional)
                            </label>
                            <input
                                type="text"
                                className="name-input"
                                placeholder="Enter your full name"
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                                disabled={loading}
                            />
                            <p className="input-hint">
                                Helps identify you in the admin dashboard
                            </p>
                        </div>

                        <div className="info-section">
                            <div className="info-icon">ℹ️</div>
                            <div className="info-content">
                                <h4 className="info-title">How Multi-Driver Login Works</h4>
                                <ul className="info-list">
                                    <li>Each driver logs in separately on their own device</li>
                                    <li>System tracks all drivers for the same vehicle</li>
                                    <li>Admin can monitor all logged-in drivers</li>
                                    <li>Trip starts only when all drivers are ready</li>
                                </ul>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button
                                type="button"
                                onClick={onBack}
                                className="btn btn-secondary btn-large"
                                disabled={loading}
                            >
                                <i className="icon icon-arrow-left"></i>
                                Change Vehicle
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary btn-large"
                                disabled={loading || !phone}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <i className="icon icon-login"></i>
                                        Login & Continue
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
                    background: #f8fafc;
                }

                .app-bar {
                    background: white;
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .back-btn {
                    background: #f1f5f9;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #64748b;
                    font-size: 1.25rem;
                }

                .app-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex: 1;
                }

                .logo-icon {
                    font-size: 1.5rem;
                }

                .logo-text {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1e293b;
                }

                .vehicle-badge {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 12px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .content-wrapper {
                    padding: 1.5rem;
                }

                .progress-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2.5rem;
                }

                .progress-step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    position: relative;
                }

                .step-number {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: #e2e8f0;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                }

                .progress-step.active .step-number {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .step-label {
                    font-size: 0.75rem;
                    color: #64748b;
                    font-weight: 500;
                }

                .progress-line {
                    width: 60px;
                    height: 2px;
                    background: #e2e8f0;
                    margin: 0 0.5rem;
                }

                .progress-line.active {
                    background: #667eea;
                }

                .main-content {
                    background: white;
                    border-radius: 24px;
                    padding: 2rem;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                }

                .welcome-card {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                }

                .welcome-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .welcome-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 0.5rem;
                }

                .welcome-subtitle {
                    color: #64748b;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .input-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    color: #334155;
                    font-size: 0.95rem;
                }

                .required {
                    color: #ef4444;
                }

                .input-wrapper {
                    display: flex;
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .input-wrapper:focus-within {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .country-code {
                    padding: 1rem 1rem 1rem 1.5rem;
                    background: #f1f5f9;
                    color: #64748b;
                    font-weight: 500;
                }

                .phone-input,
                .name-input {
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

                .input-hint {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin-top: 0.25rem;
                }

                .info-section {
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                    border: 1px solid #bae6fd;
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    gap: 1rem;
                }

                .info-icon {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }

                .info-content {
                    flex: 1;
                }

                .info-title {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #0369a1;
                    margin-bottom: 0.75rem;
                }

                .info-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .info-list li {
                    font-size: 0.875rem;
                    color: #0c4a6e;
                    line-height: 1.4;
                    position: relative;
                    padding-left: 1.5rem;
                }

                .info-list li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: #38bdf8;
                    font-weight: bold;
                }

                .action-buttons {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
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
                }

                .btn-large {
                    padding: 1.125rem;
                    font-size: 1rem;
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
                    .action-buttons {
                        flex-direction: column;
                    }
                    
                    .main-content {
                        padding: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default DriverLogin;
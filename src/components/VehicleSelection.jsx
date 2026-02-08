// COMPONENT: VehicleSelection - Dropdown Version
import { useState } from 'react';
import { saveVehicle } from '../utils/storageUtils';

const VehicleSelection = ({ onVehicleSelected }) => {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const vehicles = [
        { id: 1, number: 'TN-01-AB-1234', type: 'Volvo Coach', status: 'available' },
        { id: 2, number: 'TN-01-AB-5678', type: 'Ashok Leyland', status: 'available' },
        { id: 3, number: 'TN-02-CD-9012', type: 'Scania', status: 'maintenance' },
        { id: 4, number: 'TN-03-EF-3456', type: 'Volvo Coach', status: 'available' },
        { id: 5, number: 'TN-04-GH-7890', type: 'Ashok Leyland', status: 'available' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!vehicleNumber) {
            setError('Please select a vehicle');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            saveVehicle(vehicleNumber);
            onVehicleSelected(vehicleNumber);
        }, 500);
    };

    const selectedVehicle = vehicles.find(v => v.number === vehicleNumber);

    return (
        <div className="app-container">
            {/* Header with App Bar */}
            <div className="app-bar">
                <div className="app-bar-content">
                    <div className="app-logo">
                        <div className="logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="8" width="22" height="12" rx="2" />
                                <path d="M7 8V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" />
                                <circle cx="7" cy="16" r="2" />
                                <circle cx="17" cy="16" r="2" />
                            </svg>
                        </div>
                        <span className="logo-text">TripMaster</span>
                    </div>
                    <div className="app-status">
                        <span className="status-dot active"></span>
                        <span className="status-text">Ready</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Begin Your Journey</h1>
                    <p className="hero-subtitle">Select your vehicle to start managing your trip</p>
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
                    <div className="card-header">
                        <h2 className="card-title">
                            <div className="card-title-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 17H7A5 5 0 0 1 7 7h2" />
                                    <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            </div>
                            Select Your Vehicle
                        </h2>
                        <p className="card-subtitle">Choose from available vehicles in your fleet</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <label className="form-label required">
                                Vehicle Number
                            </label>

                            <div className="dropdown-container">
                                <div
                                    className={`dropdown-toggle ${vehicleNumber ? 'has-value' : ''} ${isDropdownOpen ? 'open' : ''} ${error ? 'error' : ''}`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="dropdown-selected">
                                        {selectedVehicle ? (
                                            <div className="selected-vehicle">
                                                <span className="vehicle-number-display">{selectedVehicle.number}</span>
                                                <span className="vehicle-type-display">{selectedVehicle.type}</span>
                                            </div>
                                        ) : (
                                            <span className="dropdown-placeholder">Select a vehicle</span>
                                        )}
                                    </div>
                                    <div className="dropdown-arrow">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 9l6 6 6-6" />
                                        </svg>
                                    </div>
                                </div>

                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-search">
                                            <div className="search-icon">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="M21 21l-4.35-4.35" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                className="search-input"
                                                placeholder="Search vehicles..."
                                                autoFocus
                                            />
                                        </div>
                                        <div className="dropdown-list">
                                            {vehicles.map((vehicle) => (
                                                <div
                                                    key={vehicle.id}
                                                    className={`dropdown-item ${vehicleNumber === vehicle.number ? 'selected' : ''} ${vehicle.status === 'maintenance' ? 'disabled' : ''}`}
                                                    onClick={() => {
                                                        if (vehicle.status !== 'maintenance') {
                                                            setVehicleNumber(vehicle.number);
                                                            setError('');
                                                            setIsDropdownOpen(false);
                                                        }
                                                    }}
                                                >
                                                    <div className="vehicle-option-content">
                                                        <div className="vehicle-option-main">
                                                            <span className="vehicle-option-number">{vehicle.number}</span>
                                                            <span className="vehicle-option-type">{vehicle.type}</span>
                                                        </div>
                                                        <div className="vehicle-option-status">
                                                            {vehicle.status === 'available' ? (
                                                                <span className="status-available">
                                                                    <span className="status-dot"></span>
                                                                    Available
                                                                </span>
                                                            ) : (
                                                                <span className="status-maintenance">
                                                                    <span className="status-dot"></span>
                                                                    Under Maintenance
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="error-message">
                                    <div className="error-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Selected Vehicle Details */}
                        {selectedVehicle && (
                            <div className="selected-vehicle-details">
                                <div className="detail-card">
                                    <div className="detail-header">
                                        <h4>Selected Vehicle Details</h4>
                                    </div>
                                    <div className="detail-content">
                                        <div className="detail-row">
                                            <span className="detail-label">Vehicle Number:</span>
                                            <span className="detail-value">{selectedVehicle.number}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Vehicle Type:</span>
                                            <span className="detail-value">{selectedVehicle.type}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Status:</span>
                                            <span className={`detail-value status-${selectedVehicle.status}`}>
                                                {selectedVehicle.status === 'available' ? 'Available for Trip' : 'Not Available'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Next Steps Info */}
                        <div className="info-card">
                            <div className="info-card-header">
                                <div className="info-card-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 8v4l3 3" />
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                </div>
                                <h4 className="info-card-title">Next Steps</h4>
                            </div>
                            <div className="steps-list">
                                <div className="step-item">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <p className="step-title">Enter Driver Details</p>
                                        <p className="step-description">Both drivers provide their phone numbers</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <p className="step-title">Individual Login</p>
                                        <p className="step-description">Each driver logs in on their own device</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <p className="step-title">Start Trip</p>
                                        <p className="step-description">Begin when both drivers are ready</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="action-bar">
                            <button
                                type="submit"
                                className="btn btn-primary btn-large btn-full"
                                disabled={!vehicleNumber || loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <div className="btn-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14" />
                                                <path d="m12 5 7 7-7 7" />
                                            </svg>
                                        </div>
                                        Continue to Driver Setup
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
                }

                .app-bar-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .app-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .logo-icon {
                    color: white;
                    width: 24px;
                    height: 24px;
                }

                .logo-text {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    letter-spacing: -0.5px;
                }

                .app-status {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.15);
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    color: white;
                    font-size: 0.875rem;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #4ade80;
                }

                .status-dot.active {
                    background: #4ade80;
                    animation: pulse 2s infinite;
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
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: white;
                    margin-bottom: 0.75rem;
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

                .card-header {
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #e5e7eb;
                }

                .card-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .card-title-icon {
                    color: #667eea;
                    width: 20px;
                    height: 20px;
                }

                .card-subtitle {
                    color: #6b7280;
                    font-size: 0.95rem;
                }

                .form-section {
                    margin-bottom: 2rem;
                }

                .form-label {
                    display: block;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.75rem;
                    font-size: 1rem;
                }

                .form-label.required::after {
                    content: '*';
                    color: #ef4444;
                    margin-left: 0.25rem;
                }

                .dropdown-container {
                    position: relative;
                }

                .dropdown-toggle {
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                    background: white;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                    min-height: 56px;
                }

                .dropdown-toggle:hover {
                    border-color: #667eea;
                }

                .dropdown-toggle.open {
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .dropdown-toggle.error {
                    border-color: #ef4444;
                }

                .dropdown-selected {
                    flex: 1;
                }

                .selected-vehicle {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .vehicle-number-display {
                    font-weight: 600;
                    color: #1f2937;
                    font-size: 1rem;
                }

                .vehicle-type-display {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .dropdown-placeholder {
                    color: #9ca3af;
                    font-size: 1rem;
                }

                .dropdown-arrow {
                    color: #6b7280;
                    transition: transform 0.3s ease;
                }

                .dropdown-toggle.open .dropdown-arrow {
                    transform: rotate(180deg);
                }

                .dropdown-menu {
                    position: absolute;
                    top: calc(100% + 4px);
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    max-height: 300px;
                    overflow-y: auto;
                }

                .dropdown-search {
                    padding: 1rem;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .search-icon {
                    color: #9ca3af;
                    width: 16px;
                    height: 16px;
                }

                .search-input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 0.95rem;
                    color: #1f2937;
                }

                .search-input::placeholder {
                    color: #9ca3af;
                }

                .dropdown-list {
                    padding: 0.5rem;
                }

                .dropdown-item {
                    padding: 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .dropdown-item:hover:not(.disabled) {
                    background: #f3f4f6;
                }

                .dropdown-item.selected {
                    background: #f0f7ff;
                    border: 1px solid #667eea;
                }

                .dropdown-item.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .vehicle-option-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .vehicle-option-main {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .vehicle-option-number {
                    font-weight: 600;
                    color: #1f2937;
                    font-size: 0.95rem;
                }

                .vehicle-option-type {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .vehicle-option-status {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                }

                .status-available {
                    color: #166534;
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                }

                .status-available .status-dot {
                    background: #22c55e;
                    width: 6px;
                    height: 6px;
                }

                .status-maintenance {
                    color: #92400e;
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                }

                .status-maintenance .status-dot {
                    background: #f59e0b;
                    width: 6px;
                    height: 6px;
                }

                .error-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.75rem;
                    padding: 0.75rem;
                    background: #fef2f2;
                    border-radius: 8px;
                }

                .error-icon {
                    width: 16px;
                    height: 16px;
                }

                .selected-vehicle-details {
                    margin-bottom: 2rem;
                }

                .detail-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 1.25rem;
                }

                .detail-header {
                    margin-bottom: 1rem;
                }

                .detail-header h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #374151;
                }

                .detail-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .detail-label {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .detail-value {
                    font-weight: 500;
                    color: #1f2937;
                    font-size: 0.875rem;
                }

                .detail-value.status-available {
                    color: #166534;
                }

                .detail-value.status-maintenance {
                    color: #92400e;
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
                    margin-bottom: 1.5rem;
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

                .steps-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .step-item {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                }

                .step-number {
                    width: 28px;
                    height: 28px;
                    background: #667eea;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 0.75rem;
                    flex-shrink: 0;
                }

                .step-content {
                    flex: 1;
                }

                .step-title {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                    font-size: 0.95rem;
                    color: #1f2937;
                }

                .step-description {
                    font-size: 0.85rem;
                    color: #6b7280;
                    line-height: 1.4;
                }

                .action-bar {
                    margin-top: 2rem;
                }

                .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
                }

                .btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .btn-large {
                    padding: 1.125rem 2rem;
                    font-size: 1rem;
                }

                .btn-full {
                    width: 100%;
                }

                .btn-icon {
                    width: 20px;
                    height: 20px;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 480px) {
                    .hero-title {
                        font-size: 2rem;
                    }
                    
                    .card.elevated {
                        margin: -2rem 1rem 0;
                        padding: 1.25rem;
                    }
                    
                    .dropdown-toggle {
                        padding: 0.875rem 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default VehicleSelection;
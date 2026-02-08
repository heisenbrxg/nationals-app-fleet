import { useState, useEffect } from 'react';
import {
    getAllVehiclesData,
    getAdminNotifications,
    clearAdminNotifications
} from '../utils/storageUtils';

const AdminDashboard = () => {
    const [vehiclesData, setVehiclesData] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('overview'); // overview, notifications

    useEffect(() => {
        loadData();

        // Refresh data every 5 seconds
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadData = () => {
        const vehicles = getAllVehiclesData();
        const notifs = getAdminNotifications();
        setVehiclesData(vehicles);
        setNotifications(notifs);
    };

    const handleClearNotifications = () => {
        clearAdminNotifications();
        setNotifications([]);
    };

    const getTotalVehicles = () => vehiclesData.length;
    const getTotalDrivers = () => vehiclesData.reduce((sum, v) => sum + v.driverCount, 0);
    const getActiveTrips = () => vehiclesData.filter(v => v.tripActive).length;

    const getStatusBadgeClass = (tripActive) => {
        return tripActive ? 'badge-success' : 'badge-error';
    };

    const formatTime = (isoString) => {
        if (!isoString) return '--:--';
        return new Date(isoString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="desktop-container" style={{ background: 'var(--surface-50)', minHeight: '100vh', display: 'flex' }}>
            {/* Sidebar */}
            <div style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: '280px',
                background: 'white',
                borderRight: '1px solid var(--surface-200)',
                padding: 'var(--space-xl)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 100,
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <h2 className="heading-2" style={{ marginBottom: 'var(--space-xs)' }}>
                        Trip Admin
                    </h2>
                    <p className="text-small" style={{ color: 'var(--surface-600)' }}>
                        Driver Management System
                    </p>
                </div>

                <nav style={{ flex: 1 }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{
                            width: '100%',
                            padding: 'var(--space-md)',
                            marginBottom: 'var(--space-sm)',
                            background: activeTab === 'overview' ? 'var(--primary-brand)' : 'transparent',
                            color: activeTab === 'overview' ? 'white' : 'var(--surface-700)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                    >
                        Vehicle Overview
                    </button>

                    <button
                        onClick={() => setActiveTab('notifications')}
                        style={{
                            width: '100%',
                            padding: 'var(--space-md)',
                            background: activeTab === 'notifications' ? 'var(--primary-brand)' : 'transparent',
                            color: activeTab === 'notifications' ? 'white' : 'var(--surface-700)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            position: 'relative'
                        }}
                    >
                        Notifications
                        {notifications.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: 'var(--space-sm)',
                                right: 'var(--space-sm)',
                                background: 'var(--error)',
                                color: 'white',
                                borderRadius: 'var(--radius-full)',
                                padding: '2px 8px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                {notifications.length}
                            </span>
                        )}
                    </button>
                </nav>

                <div style={{
                    padding: 'var(--space-md)',
                    background: 'var(--surface-50)',
                    borderRadius: 'var(--radius-md)',
                    marginTop: 'auto'
                }}>
                    <p className="text-caption" style={{ marginBottom: 'var(--space-xs)' }}>
                        Last Updated
                    </p>
                    <p className="text-small">
                        {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ marginLeft: '280px', padding: 'var(--space-2xl)', width: 'calc(100% - 280px)' }}>
                {/* Header */}
                <div style={{
                    background: 'white',
                    padding: 'var(--space-xl)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--space-xl)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="heading-1" style={{ marginBottom: 'var(--space-xs)' }}>
                                {activeTab === 'overview' ? 'Vehicle-Based Driver Mapping' : 'System Notifications'}
                            </h1>
                            <p className="text-body" style={{ color: 'var(--surface-600)' }}>
                                {activeTab === 'overview'
                                    ? 'Automatic driver grouping by vehicle number'
                                    : 'View alerts and system messages'
                                }
                            </p>
                        </div>
                        <button
                            onClick={loadData}
                            className="btn btn-secondary"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        {/* Summary Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: 'var(--space-lg)',
                            marginBottom: 'var(--space-xl)'
                        }}>
                            <div className="card">
                                <p className="text-caption" style={{ marginBottom: 'var(--space-sm)' }}>
                                    Total Vehicles
                                </p>
                                <h2 className="heading-1" style={{ color: 'var(--primary-brand)' }}>
                                    {getTotalVehicles()}
                                </h2>
                            </div>

                            <div className="card">
                                <p className="text-caption" style={{ marginBottom: 'var(--space-sm)' }}>
                                    Total Drivers
                                </p>
                                <h2 className="heading-1" style={{ color: 'var(--primary-brand)' }}>
                                    {getTotalDrivers()}
                                </h2>
                            </div>

                            <div className="card">
                                <p className="text-caption" style={{ marginBottom: 'var(--space-sm)' }}>
                                    Active Trips
                                </p>
                                <h2 className="heading-1" style={{ color: 'var(--success)' }}>
                                    {getActiveTrips()}
                                </h2>
                            </div>
                        </div>

                        {/* Vehicle Mapping Cards */}
                        {vehiclesData.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gap: 'var(--space-lg)'
                            }}>
                                {vehiclesData.map((vehicle) => (
                                    <div key={vehicle.vehicleNumber} className="card animate-enter">
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            marginBottom: 'var(--space-lg)',
                                            paddingBottom: 'var(--space-lg)',
                                            borderBottom: '1px solid var(--surface-200)'
                                        }}>
                                            <div>
                                                <h3 className="heading-2" style={{ marginBottom: 'var(--space-xs)' }}>
                                                    {vehicle.vehicleNumber}
                                                </h3>
                                                <p className="text-small" style={{ color: 'var(--surface-600)' }}>
                                                    {vehicle.driverCount} driver{vehicle.driverCount !== 1 ? 's' : ''} registered • {vehicle.loggedInCount} logged in
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                                                <span className={`badge ${getStatusBadgeClass(vehicle.tripActive)}`}>
                                                    {vehicle.tripActive ? '● Trip Running' : '○ No Active Trip'}
                                                </span>
                                                {vehicle.tripActive && vehicle.tripStartTime && (
                                                    <span className="text-small" style={{ color: 'var(--surface-600)' }}>
                                                        Started: {formatTime(vehicle.tripStartTime)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Drivers List */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                            gap: 'var(--space-md)'
                                        }}>
                                            {vehicle.drivers.map((driver, index) => (
                                                <div
                                                    key={driver.phone}
                                                    style={{
                                                        padding: 'var(--space-md)',
                                                        background: driver.isLoggedIn ? 'var(--success-bg)' : 'var(--surface-50)',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: `1px solid ${driver.isLoggedIn ? 'var(--success)' : 'var(--surface-200)'}`
                                                    }}
                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        marginBottom: 'var(--space-sm)'
                                                    }}>
                                                        <div>
                                                            <p className="text-body" style={{ fontWeight: '600', marginBottom: 'var(--space-xs)' }}>
                                                                {driver.name || `Driver ${index + 1}`}
                                                            </p>
                                                            <p className="text-small" style={{ color: 'var(--surface-600)' }}>
                                                                {driver.phone}
                                                            </p>
                                                        </div>
                                                        <span className={`badge ${driver.isLoggedIn ? 'badge-success' : 'badge-error'}`} style={{ background: driver.isLoggedIn ? 'var(--success)' : 'var(--surface-200)', color: driver.isLoggedIn ? 'white' : 'var(--surface-600)' }}>
                                                            {driver.isLoggedIn ? '✓ Logged In' : '✗ Logged Out'}
                                                        </span>
                                                    </div>

                                                    {driver.loginTime && (
                                                        <p className="text-caption" style={{ marginTop: 'var(--space-xs)' }}>
                                                            Login: {formatTime(driver.loginTime)}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {vehicle.drivers.length === 0 && (
                                            <div style={{
                                                textAlign: 'center',
                                                padding: 'var(--space-xl)',
                                                color: 'var(--surface-500)'
                                            }}>
                                                <p className="text-body">No drivers registered for this vehicle yet</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card" style={{
                                padding: 'var(--space-2xl)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    background: 'var(--surface-100)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-lg)',
                                    fontSize: '3rem'
                                }}>
                                    {/* No vehicles icon */}
                                </div>
                                <h3 className="heading-3" style={{ marginBottom: 'var(--space-sm)' }}>
                                    No Vehicles Yet
                                </h3>
                                <p className="text-body" style={{ color: 'var(--surface-600)' }}>
                                    Vehicles will appear here when drivers log in
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div>
                        {notifications.length > 0 ? (
                            <>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginBottom: 'var(--space-lg)'
                                }}>
                                    <button
                                        onClick={handleClearNotifications}
                                        className="btn btn-secondary"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 'var(--space-lg)'
                                }}>
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="card animate-enter">
                                            <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    background: 'var(--warning-bg)',
                                                    borderRadius: 'var(--radius-lg)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem',
                                                    flexShrink: 0
                                                }}>
                                                    {/* Warning icon */}
                                                </div>

                                                <div style={{ flex: 1 }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        marginBottom: 'var(--space-sm)'
                                                    }}>
                                                        <h3 className="heading-3">{notif.type || 'System Alert'}</h3>
                                                        <span className="badge" style={{ background: 'var(--warning)', color: 'white' }}>
                                                            {notif.severity || 'warning'}
                                                        </span>
                                                    </div>

                                                    <p className="text-body" style={{
                                                        marginBottom: 'var(--space-md)',
                                                        color: 'var(--surface-700)'
                                                    }}>
                                                        {notif.message}
                                                    </p>

                                                    {notif.vehicle && (
                                                        <div style={{
                                                            background: 'var(--surface-50)',
                                                            padding: 'var(--space-md)',
                                                            borderRadius: 'var(--radius-md)',
                                                            marginBottom: 'var(--space-md)'
                                                        }}>
                                                            <p className="text-small" style={{ marginBottom: 'var(--space-xs)' }}>
                                                                <strong>Vehicle:</strong> {notif.vehicle}
                                                            </p>
                                                            {notif.driverPhone && (
                                                                <p className="text-small">
                                                                    <strong>Driver:</strong> {notif.driverName || 'Unknown'} ({notif.driverPhone})
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    <p className="text-caption">
                                                        {new Date(notif.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="card" style={{
                                padding: 'var(--space-2xl)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    background: 'var(--success-bg)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--space-lg)',
                                    fontSize: '3rem'
                                }}>
                                    {/* Success icon */}
                                </div>
                                <h3 className="heading-3" style={{ marginBottom: 'var(--space-sm)' }}>
                                    No Notifications
                                </h3>
                                <p className="text-body" style={{ color: 'var(--surface-600)' }}>
                                    All trips are running smoothly. Notifications will appear here when there are issues.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;

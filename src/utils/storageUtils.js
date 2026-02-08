/**
 * Local Storage Utilities for Trip Management
 * Vehicle-based driver mapping system
 */

const STORAGE_KEYS = {
    VEHICLE_DRIVERS: 'vehicle_drivers_map', // Maps vehicle -> array of drivers
    CURRENT_SESSION: 'current_driver_session', // Current logged-in driver
    TRIP_ACTIVE: 'trip_active',
    TRIP_START_TIME: 'trip_start_time',
    ADMIN_NOTIFICATIONS: 'admin_notifications'
};

/**
 * Save data to localStorage
 */
export const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to storage:', error);
        return false;
    }
};

/**
 * Get data from localStorage
 */
export const getFromStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from storage:', error);
        return null;
    }
};

/**
 * Remove data from localStorage
 */
export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from storage:', error);
        return false;
    }
};

/**
 * Clear all trip data
 */
export const clearTripData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        removeFromStorage(key);
    });
};

/**
 * Get all vehicle-driver mappings
 * Returns: { vehicleNumber: [driver1, driver2, ...] }
 */
export const getVehicleDriverMap = () => {
    return getFromStorage(STORAGE_KEYS.VEHICLE_DRIVERS) || {};
};

/**
 * Save selected vehicle to current session
 */
export const saveVehicle = (vehicleNumber) => {
    saveToStorage(STORAGE_KEYS.CURRENT_SESSION, {
        vehicleNumber
    });
};

/**
 * Save driver login with vehicle mapping
 * @param {string} vehicleNumber - Vehicle number
 * @param {string} phone - Driver phone number
 * @param {string} name - Driver name (optional)
 */
export const saveDriverLogin = (vehicleNumber, phone, name = '') => {
    const vehicleMap = getVehicleDriverMap();

    // Initialize vehicle array if doesn't exist
    if (!vehicleMap[vehicleNumber]) {
        vehicleMap[vehicleNumber] = [];
    }

    // Check if driver already exists for this vehicle
    const existingDriverIndex = vehicleMap[vehicleNumber].findIndex(
        driver => driver.phone === phone
    );

    const driverData = {
        phone,
        name,
        loginTime: new Date().toISOString(),
        isLoggedIn: true,
        location: null,
        selfie: null
    };

    if (existingDriverIndex >= 0) {
        // Update existing driver
        vehicleMap[vehicleNumber][existingDriverIndex] = {
            ...vehicleMap[vehicleNumber][existingDriverIndex],
            ...driverData
        };
    } else {
        // Add new driver
        vehicleMap[vehicleNumber].push(driverData);
    }

    saveToStorage(STORAGE_KEYS.VEHICLE_DRIVERS, vehicleMap);

    // Save current session
    saveToStorage(STORAGE_KEYS.CURRENT_SESSION, {
        vehicleNumber,
        phone,
        name
    });
};

/**
 * Get current logged-in driver session
 */
export const getCurrentSession = () => {
    return getFromStorage(STORAGE_KEYS.CURRENT_SESSION);
};

/**
 * Get all drivers for a specific vehicle
 * @param {string} vehicleNumber
 * @returns {Array} Array of driver objects
 */
export const getDriversForVehicle = (vehicleNumber) => {
    const vehicleMap = getVehicleDriverMap();
    return vehicleMap[vehicleNumber] || [];
};

/**
 * Get driver info by phone and vehicle
 * @param {string} vehicleNumber
 * @param {string} phone
 */
export const getDriverInfo = (vehicleNumber, phone) => {
    const drivers = getDriversForVehicle(vehicleNumber);
    return drivers.find(driver => driver.phone === phone) || null;
};

/**
 * Update driver location
 */
export const saveDriverLocation = (vehicleNumber, phone, location) => {
    const vehicleMap = getVehicleDriverMap();

    if (vehicleMap[vehicleNumber]) {
        const driverIndex = vehicleMap[vehicleNumber].findIndex(d => d.phone === phone);
        if (driverIndex >= 0) {
            vehicleMap[vehicleNumber][driverIndex].location = location;
            saveToStorage(STORAGE_KEYS.VEHICLE_DRIVERS, vehicleMap);
        }
    }
};

/**
 * Get driver location
 */
export const getDriverLocation = (vehicleNumber, phone) => {
    const driver = getDriverInfo(vehicleNumber, phone);
    return driver ? driver.location : null;
};

/**
 * Save driver selfie
 */
export const saveDriverSelfie = (vehicleNumber, phone, photoData) => {
    const vehicleMap = getVehicleDriverMap();

    if (vehicleMap[vehicleNumber]) {
        const driverIndex = vehicleMap[vehicleNumber].findIndex(d => d.phone === phone);
        if (driverIndex >= 0) {
            vehicleMap[vehicleNumber][driverIndex].selfie = photoData;
            saveToStorage(STORAGE_KEYS.VEHICLE_DRIVERS, vehicleMap);
        }
    }
};

/**
 * Get driver selfie
 */
export const getDriverSelfie = (vehicleNumber, phone) => {
    const driver = getDriverInfo(vehicleNumber, phone);
    return driver ? driver.selfie : null;
};

/**
 * Save bus photos for vehicle
 */
export const saveBusPhotos = (vehicleNumber, photos) => {
    const vehicleMap = getVehicleDriverMap();

    if (vehicleMap[vehicleNumber]) {
        // Store bus photos at vehicle level (shared by all drivers)
        vehicleMap[vehicleNumber].busPhotos = photos;
        saveToStorage(STORAGE_KEYS.VEHICLE_DRIVERS, vehicleMap);
    }
};

/**
 * Get bus photos for vehicle
 */
export const getBusPhotos = (vehicleNumber) => {
    const vehicleMap = getVehicleDriverMap();
    return vehicleMap[vehicleNumber]?.busPhotos || [];
};

/**
 * Start trip for vehicle
 */
export const startTrip = (vehicleNumber) => {
    const tripData = getFromStorage(STORAGE_KEYS.TRIP_ACTIVE) || {};
    tripData[vehicleNumber] = {
        active: true,
        startTime: new Date().toISOString()
    };
    saveToStorage(STORAGE_KEYS.TRIP_ACTIVE, tripData);
};

/**
 * End trip for vehicle
 */
export const endTrip = (vehicleNumber) => {
    const tripData = getFromStorage(STORAGE_KEYS.TRIP_ACTIVE) || {};
    if (tripData[vehicleNumber]) {
        tripData[vehicleNumber].active = false;
        tripData[vehicleNumber].endTime = new Date().toISOString();
    }
    saveToStorage(STORAGE_KEYS.TRIP_ACTIVE, tripData);
};

/**
 * Check if trip is active for vehicle
 */
export const isTripActive = (vehicleNumber) => {
    const tripData = getFromStorage(STORAGE_KEYS.TRIP_ACTIVE) || {};
    return tripData[vehicleNumber]?.active || false;
};

/**
 * Get trip start time for vehicle
 */
export const getTripStartTime = (vehicleNumber) => {
    const tripData = getFromStorage(STORAGE_KEYS.TRIP_ACTIVE) || {};
    return tripData[vehicleNumber]?.startTime || null;
};

/**
 * Get number of logged-in drivers for vehicle
 */
export const getLoggedInDriverCount = (vehicleNumber) => {
    const drivers = getDriversForVehicle(vehicleNumber);
    return drivers.filter(d => d.isLoggedIn).length;
};

/**
 * Check if minimum drivers are logged in (at least 2)
 */
export const hasMinimumDrivers = (vehicleNumber) => {
    return getLoggedInDriverCount(vehicleNumber) >= 2;
};

/**
 * Logout current driver
 */
export const logoutDriver = (vehicleNumber, phone) => {
    const vehicleMap = getVehicleDriverMap();

    if (vehicleMap[vehicleNumber]) {
        const driverIndex = vehicleMap[vehicleNumber].findIndex(d => d.phone === phone);
        if (driverIndex >= 0) {
            vehicleMap[vehicleNumber][driverIndex].isLoggedIn = false;
            vehicleMap[vehicleNumber][driverIndex].logoutTime = new Date().toISOString();
            saveToStorage(STORAGE_KEYS.VEHICLE_DRIVERS, vehicleMap);
        }
    }

    // Clear current session
    removeFromStorage(STORAGE_KEYS.CURRENT_SESSION);
};

/**
 * Add admin notification
 */
export const addAdminNotification = (notification) => {
    const notifications = getFromStorage(STORAGE_KEYS.ADMIN_NOTIFICATIONS) || [];
    notifications.unshift({
        ...notification,
        id: Date.now(),
        timestamp: new Date().toISOString()
    });
    saveToStorage(STORAGE_KEYS.ADMIN_NOTIFICATIONS, notifications);
};

/**
 * Get admin notifications
 */
export const getAdminNotifications = () => {
    return getFromStorage(STORAGE_KEYS.ADMIN_NOTIFICATIONS) || [];
};

/**
 * Clear admin notifications
 */
export const clearAdminNotifications = () => {
    return saveToStorage(STORAGE_KEYS.ADMIN_NOTIFICATIONS, []);
};

/**
 * Get all vehicles with their drivers (for admin dashboard)
 */
export const getAllVehiclesData = () => {
    const vehicleMap = getVehicleDriverMap();
    const tripData = getFromStorage(STORAGE_KEYS.TRIP_ACTIVE) || {};

    return Object.keys(vehicleMap).map(vehicleNumber => ({
        vehicleNumber,
        drivers: vehicleMap[vehicleNumber],
        tripActive: tripData[vehicleNumber]?.active || false,
        tripStartTime: tripData[vehicleNumber]?.startTime || null,
        driverCount: vehicleMap[vehicleNumber].length,
        loggedInCount: vehicleMap[vehicleNumber].filter(d => d.isLoggedIn).length
    }));
};

export { STORAGE_KEYS };


// Add this to storageUtils.js if it doesn't exist
export const getDriverCount = (vehicleNumber) => {
    return getLoggedInDriverCount(vehicleNumber);
};

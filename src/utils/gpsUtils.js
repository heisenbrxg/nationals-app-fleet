/**
 * GPS and Location Utilities
 */

/**
 * Get current GPS position
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
 */
export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date().toISOString()
                });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable. Please check your GPS.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred while getting location.';
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
};

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return Math.round(distance);
};

/**
 * Check if two locations are within specified radius
 * @param {Object} location1 - First location {latitude, longitude}
 * @param {Object} location2 - Second location {latitude, longitude}
 * @param {number} maxDistance - Maximum allowed distance in meters (default: 90)
 * @returns {boolean} True if within range
 */
export const areLocationsWithinRange = (location1, location2, maxDistance = 90) => {
    if (!location1 || !location2) return false;

    const distance = calculateDistance(
        location1.latitude,
        location1.longitude,
        location2.latitude,
        location2.longitude
    );

    return distance <= maxDistance;
};

/**
 * Request GPS permission
 * @returns {Promise<boolean>}
 */
export const requestGPSPermission = async () => {
    try {
        const position = await getCurrentPosition();
        return true;
    } catch (error) {
        console.error('GPS permission error:', error);
        return false;
    }
};

/**
 * Format coordinates for display
 * @param {number} latitude
 * @param {number} longitude
 * @returns {string}
 */
export const formatCoordinates = (latitude, longitude) => {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

/**
 * Simulate GPS check for demo purposes
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
 */
export const simulateGPSPosition = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                latitude: 8.0883 + (Math.random() - 0.5) * 0.001, // Near Nagercoil
                longitude: 77.4324 + (Math.random() - 0.5) * 0.001,
                accuracy: 10 + Math.random() * 20,
                timestamp: new Date().toISOString()
            });
        }, 1000);
    });
};

/**
 * Meta Conversions API (CAPI) Utility
 * Sends events to the server-side endpoint
 */

import { generateEventId } from './pixel';

/**
 * Helper to get specific cookies (_fbc, _fbp)
 */
const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

/**
 * Send event to the Serverless CAPI endpoint
 */
export const sendCAPIEvent = async (eventName, params = {}, eventId, userData = {}) => {
    try {
        const payload = {
            eventName,
            eventId,
            eventSourceUrl: window.location.href,
            fbp: getCookie('_fbp'),
            fbc: getCookie('_fbc'),
            userData: {
                email: userData.email || null,
                phone: userData.phone || null,
                firstName: userData.firstName || null,
                lastName: userData.lastName || null,
                city: userData.city || null,
                state: userData.state || null,
                zip: userData.postalCode || null,
                country: userData.country || null,
                ...userData
            },
            customData: params
        };

        const response = await fetch('/api/meta-capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        return await response.json();
    } catch (error) {
        console.error('[CAPI] Error sending event:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Dual Track: Send to both Pixel and CAPI
 */
export const trackDualEvent = async (eventName, params = {}, userData = {}) => {
    const eventId = generateEventId();

    // 1. Pixel (Browser)
    import('./pixel').then(m => m.trackPixelEvent(eventName, params, eventId));

    // 2. CAPI (Server)
    return sendCAPIEvent(eventName, params, eventId, userData);
};

/**
 * Meta Pixel Utility
 * Manages client-side tracking with deduplication support
 */

export const getPixelId = () => import.meta.env.VITE_META_PIXEL_ID;

/**
 * Initialize Meta Pixel
 */
export const initPixel = () => {
    const pixelId = getPixelId();
    if (!pixelId || typeof window === 'undefined') return;

    if (window.fbq) return;

    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
        'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', pixelId);
};

/**
 * Generate a unique event ID for deduplication
 */
export const generateEventId = () => {
    return 'ev_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

/**
 * Track Pixel Event
 */
export const trackPixelEvent = (eventName, params = {}, eventId = null) => {
    if (typeof window !== 'undefined' && window.fbq) {
        const options = eventId ? { ...params, event_id: eventId } : params;
        window.fbq('track', eventName, options);
    }
};

const crypto = require('crypto');

/**
 * Meta CAPI Serverless Function for Vercel
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        eventName,
        eventId,
        eventSourceUrl,
        fbp,
        fbc,
        userData,
        customData
    } = req.body;

    const PIXEL_ID = process.env.VITE_META_PIXEL_ID || '1733575648020855';
    const ACCESS_TOKEN = process.env.META_CAPI_TOKEN;

    if (!ACCESS_TOKEN) {
        return res.status(500).json({ error: 'META_CAPI_TOKEN is not configured' });
    }

    // Helper to hash data for Meta (SHA256)
    const hashData = (data) => {
        if (!data) return null;
        return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
    };

    try {
        const payload = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    event_id: eventId,
                    event_source_url: eventSourceUrl,
                    user_data: {
                        em: userData.email ? [hashData(userData.email)] : [],
                        ph: userData.phone ? [hashData(userData.phone)] : [],
                        fn: userData.firstName ? [hashData(userData.firstName)] : [],
                        ln: userData.lastName ? [hashData(userData.lastName)] : [],
                        ct: userData.city ? [hashData(userData.city)] : [],
                        zp: userData.zip ? [hashData(userData.zip)] : [],
                        country: userData.country ? [hashData(userData.country)] : [],
                        fbp: fbp,
                        fbc: fbc,
                        client_ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                        client_user_agent: req.headers['user-agent']
                    },
                    custom_data: customData,
                }
            ]
        };

        const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...payload,
                access_token: ACCESS_TOKEN
            })
        });

        const result = await response.json();
        return res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('[CAPI Server] Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

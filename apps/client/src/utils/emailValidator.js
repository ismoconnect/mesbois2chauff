/**
 * Email validator with real TLD (Top-Level Domain) validation
 * Rejects emails with fake extensions like test@gmail.comH
 */

// List of valid TLDs (Top-Level Domains)
// Includes the most common TLDs used worldwide
const VALID_TLDS = [
    // Generic TLDs
    'com', 'net', 'org', 'edu', 'gov', 'mil', 'int',
    'info', 'biz', 'name', 'pro', 'aero', 'coop', 'museum',

    // New generic TLDs
    'io', 'ai', 'app', 'dev', 'tech', 'online', 'site', 'website',
    'store', 'shop', 'blog', 'cloud', 'digital', 'email', 'live',
    'xyz', 'top', 'win', 'club', 'vip', 'me', 'tv', 'cc', 'co',

    // Country code TLDs (Europe)
    'fr', 'de', 'uk', 'it', 'es', 'nl', 'be', 'ch', 'at', 'se',
    'no', 'dk', 'fi', 'pl', 'cz', 'pt', 'gr', 'ie', 'lu', 'ro',

    // Country code TLDs (Americas)
    'us', 'ca', 'mx', 'br', 'ar', 'cl', 'co', 've', 'pe',

    // Country code TLDs (Asia-Pacific)
    'cn', 'jp', 'kr', 'in', 'au', 'nz', 'sg', 'hk', 'tw', 'th',
    'my', 'id', 'ph', 'vn',

    // Country code TLDs (Middle East & Africa)
    'ae', 'sa', 'il', 'tr', 'za', 'eg', 'ma', 'ng',

    // Other common TLDs
    'mobi', 'tel', 'travel', 'jobs', 'cat', 'asia', 'post'
];

/**
 * Validates email format and checks if TLD is real
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid with real TLD
 */
export const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }

    // Basic format check
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return false;
    }

    // Extract TLD (Top-Level Domain)
    const parts = email.toLowerCase().split('@');
    if (parts.length !== 2) {
        return false;
    }

    const domain = parts[1];
    const domainParts = domain.split('.');

    if (domainParts.length < 2) {
        return false;
    }

    // Get the TLD (last part after the last dot)
    const tld = domainParts[domainParts.length - 1];

    // Check if TLD is in the valid list
    return VALID_TLDS.includes(tld);
};

/**
 * Gets a user-friendly error message for invalid email
 * @param {string} email - Email address that failed validation
 * @returns {string} - Error message key for translation
 */
export const getEmailErrorKey = (email) => {
    if (!email) {
        return 'checkout.error_invalid_email';
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return 'checkout.error_invalid_email';
    }

    // If format is OK but TLD is invalid
    return 'checkout.error_invalid_email';
};

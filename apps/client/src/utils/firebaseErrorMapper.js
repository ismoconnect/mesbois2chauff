// Utility to map Firebase auth error codes to translation keys
export const getFirebaseAuthErrorKey = (error) => {
    if (!error) return 'checkout.login_error_failed';

    const errorString = typeof error === 'string' ? error : error.message || error.code || '';

    // Map Firebase error codes to translation keys
    if (errorString.includes('auth/email-already-in-use')) {
        return 'checkout.error_email_already_in_use';
    }

    if (errorString.includes('auth/invalid-login-credentials') ||
        errorString.includes('auth/wrong-password') ||
        errorString.includes('auth/user-not-found')) {
        return 'checkout.login_error_invalid_credentials';
    }

    if (errorString.includes('auth/invalid-email')) {
        return 'checkout.error_invalid_email';
    }

    if (errorString.includes('auth/user-disabled')) {
        return 'checkout.login_error_user_disabled';
    }

    if (errorString.includes('auth/too-many-requests')) {
        return 'checkout.login_error_too_many_attempts';
    }

    if (errorString.includes('auth/network-request-failed')) {
        return 'checkout.login_error_network';
    }

    if (errorString.includes('auth/weak-password')) {
        return 'checkout.error_weak_password';
    }

    // Default fallback
    return 'checkout.login_error_failed';
};

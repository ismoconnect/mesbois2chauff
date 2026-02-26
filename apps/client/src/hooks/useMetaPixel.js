import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initPixel, trackPixelEvent } from '../lib/meta/pixel';

/**
 * Hook to initialize Meta Pixel and track page views
 */
export const useMetaPixel = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize once
        initPixel();
    }, []);

    useEffect(() => {
        // Track PageView on route change
        trackPixelEvent('PageView');
    }, [location.pathname]);
};

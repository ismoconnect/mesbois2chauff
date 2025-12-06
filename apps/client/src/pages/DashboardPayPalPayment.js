import React from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import PayPalPayment from './PayPalPayment';

const DashboardPayPalPayment = () => {
    return (
        <DashboardLayout>
            <PayPalPayment />
        </DashboardLayout>
    );
};

export default DashboardPayPalPayment;

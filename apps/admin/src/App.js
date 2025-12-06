import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ImageManager from './pages/ImageManager';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Carts from './pages/Carts';
import CartDetail from './pages/CartDetail';
import SiteSettings from './pages/SiteSettings';
import PaymentSettings from './pages/PaymentSettings';
import FirestoreDebug from './pages/FirestoreDebug';
import AdminRoute from './components/Auth/AdminRoute';
import AdminLayout from './layout/AdminLayout';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/debug/firestore"
        element={
          <AdminRoute>
            <AdminLayout>
              <FirestoreDebug />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/users/:uid"
        element={
          <AdminRoute>
            <AdminLayout>
              <UserDetail />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <AdminRoute>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <AdminRoute>
            <AdminLayout>
              <OrderDetail />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/carts"
        element={
          <AdminRoute>
            <AdminLayout>
              <Carts />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/carts/:uid"
        element={
          <AdminRoute>
            <AdminLayout>
              <CartDetail />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/images"
        element={
          <AdminRoute>
            <AdminLayout>
              <ImageManager />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/settings/site"
        element={
          <AdminRoute>
            <AdminLayout>
              <SiteSettings />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/settings/payments"
        element={
          <AdminRoute>
            <AdminLayout>
              <PaymentSettings />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;

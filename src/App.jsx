import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./admin/components/Layout";

import Dashboard from "./admin/pages/Dashboard";
import AdminGallery from "./admin/pages/Gallery";
import AdminBookings from "./admin/pages/Bookings";
import AdminReviews from "./admin/pages/Reviews";
import Tutorials from "./admin/pages/Tutorials";

import Login from "./admin/pages/Login";
import Register from "./admin/pages/Register";
import UnavailableBookings from "./admin/pages/UnavailableBookings";

import ProtectedRoute from "./admin/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Redirect root to /admin/dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="gallery" element={<AdminGallery />} />

          <Route path="bookings" element={<AdminBookings />} />

          <Route path="reviews" element={<AdminReviews />} />

          <Route path="/admin/tutorials" element={<Tutorials />} />
          <Route
            path="unavailable-bookings"
            element={<UnavailableBookings />}
          />
        </Route>

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

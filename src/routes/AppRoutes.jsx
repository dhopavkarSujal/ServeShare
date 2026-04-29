import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";

import DashboardLayout from "../components/layout/DashboardLayout";

/* USER PAGES */
import UserDashboard from "../user/UserDashboard";
import UserDonationsPage from "../user/UserDonationsPage";
import UserCreateDonationPage from "../user/UserCreateDonationPage";
import UserNGOsPage from "../user/UserNGOsPage";
import UserActivityPage from "../user/UserActivityPage";
import UserNotificationsPage from "../user/UserNotificationsPage";
import UserProfilePage from "../user/UserProfilePage";
import UserSettingsPage from "../user/UserSettingsPage";
import UserHelpPage from "../user/UserHelpPage";

/* ADMIN PAGES */
import AdminDashboard from "../admin/AdminDashboard";
import AdminNGOsPage from "../admin/AdminNGOsPage";
import AdminDonationsPage from "../admin/AdminDonationsPage";
import AdminUsersPage from "../admin/AdminUsersPage";
import AdminReportsPage from "../admin/AdminReportsPage";
import AdminReviewsPage from "../admin/AdminReviewsPage";
import AdminNotificationsPage from "../admin/AdminNotificationsPage";
import AdminSettingsPage from "../admin/AdminSettingsPage";
import AdminLogsPage from "../admin/AdminLogsPage";

/* NGO PAGES */
import NGODashboard from "../ngo/NGODashboard";
import NGORequestsPage from "../ngo/NGORequestsPage";
import NGODonationsPage from "../ngo/NGODonationsPage";
import NGOPickupsPage from "../ngo/NGOPickupsPage";
import NGOBeneficiariesPage from "../ngo/NGOBeneficiariesPage";
import NGOReportsPage from "../ngo/NGOReportsPage";
import NGOMessagesPage from "../ngo/NGOMessagesPage";
import NGOProfilePage from "../ngo/NGOProfilePage";
import NGOTeamPage from "../ngo/NGOTeamPage";
import NGOSettingsPage from "../ngo/NGOSettingsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* USER */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="donor">
              <DashboardLayout role="user" />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="donations" element={<UserDonationsPage />} />
          <Route path="donations/new" element={<UserCreateDonationPage />} />
          <Route path="ngos" element={<UserNGOsPage />} />
          <Route path="activity" element={<UserActivityPage />} />
          <Route path="notifications" element={<UserNotificationsPage />} />
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="settings" element={<UserSettingsPage />} />
          <Route path="help" element={<UserHelpPage />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="ngos" element={<AdminNGOsPage />} />
          <Route path="donations" element={<AdminDonationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
        </Route>

        {/* NGO */}
        <Route
          path="/ngo"
          element={
            <ProtectedRoute role="ngo">
              <DashboardLayout role="ngo" />
            </ProtectedRoute>
          }
        >
          <Route index element={<NGODashboard />} />
          <Route path="requests" element={<NGORequestsPage />} />
          <Route path="donations" element={<NGODonationsPage />} />
          <Route path="pickups" element={<NGOPickupsPage />} />
          <Route path="beneficiaries" element={<NGOBeneficiariesPage />} />
          <Route path="reports" element={<NGOReportsPage />} />
          <Route path="messages" element={<NGOMessagesPage />} />
          <Route path="profile" element={<NGOProfilePage />} />
          <Route path="team" element={<NGOTeamPage />} />
          <Route path="settings" element={<NGOSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
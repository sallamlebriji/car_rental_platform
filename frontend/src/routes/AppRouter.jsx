import { Navigate, Route, Routes } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import CarsPage from "../pages/CarsPage";
import CarDetailsPage from "../pages/CarDetailsPage";
import ReservationPage from "../pages/ReservationPage";
import ReservationSuccessPage from "../pages/ReservationSuccessPage";
import MyReservationsPage from "../pages/MyReservationsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AgencyLoginPage from "../pages/AgencyLoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminCarsPage from "../pages/AdminCarsPage";
import AdminCarFormPage from "../pages/AdminCarFormPage";
import AdminReservationsPage from "../pages/AdminReservationsPage";
import AdminReservationDetailsPage from "../pages/AdminReservationDetailsPage";
import AdminClientsPage from "../pages/AdminClientsPage";
import AdminEmployeesPage from "../pages/AdminEmployeesPage";
import AdminPacksPage from "../pages/AdminPacksPage";
import AdminOptionsPage from "../pages/AdminOptionsPage";
import AdminPaymentsPage from "../pages/AdminPaymentsPage";
import AdminContractsPage from "../pages/AdminContractsPage";
import AdminSettingsPage from "../pages/AdminSettingsPage";
import AccountSecurityPage from "../pages/AccountSecurityPage";
import SuperAdminDashboardPage from "../pages/SuperAdminDashboardPage";
import SuperAdminAgencySettingsPage from "../pages/SuperAdminAgencySettingsPage";
import SuperAdminVisualSettingsPage from "../pages/SuperAdminVisualSettingsPage";
import SuperAdminReservationSettingsPage from "../pages/SuperAdminReservationSettingsPage";
import SuperAdminRolesPermissionsPage from "../pages/SuperAdminRolesPermissionsPage";
import SuperAdminNotificationSettingsPage from "../pages/SuperAdminNotificationSettingsPage";
import SuperAdminDocumentSettingsPage from "../pages/SuperAdminDocumentSettingsPage";
import SuperAdminAuditLogsPage from "../pages/SuperAdminAuditLogsPage";
import SuperAdminFeatureFlagsPage from "../pages/SuperAdminFeatureFlagsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/reservation/:carId" element={<ReservationPage />} />
        <Route path="/reservation-success" element={<ReservationSuccessPage />} />
        <Route path="/my-reservations" element={<MyReservationsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AgencyLoginPage />} />
        <Route path="/agency/:slug" element={<HomePage />} />
        <Route path="/agency/:slug/cars" element={<CarsPage />} />
        <Route path="/agency/:slug/cars/:id" element={<CarDetailsPage />} />
        <Route path="/agency/:slug/reservation/:carId" element={<ReservationPage />} />
        <Route path="/agency/:slug/reservation-success" element={<ReservationSuccessPage />} />
        <Route path="/agency/:slug/my-reservations" element={<MyReservationsPage />} />
        <Route path="/agency/:slug/login" element={<LoginPage />} />
        <Route path="/agency/:slug/register" element={<RegisterPage />} />
        <Route path="/agency/:slug/admin/login" element={<AgencyLoginPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedTypes={["ADMIN", "SUPER_ADMIN", "EMPLOYEE"]} />}>
        <Route element={<DashboardLayout mode="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/cars" element={<AdminCarsPage />} />
          <Route path="/admin/cars/create" element={<AdminCarFormPage />} />
          <Route path="/admin/cars/edit/:id" element={<AdminCarFormPage />} />
          <Route path="/admin/reservations" element={<AdminReservationsPage />} />
          <Route path="/admin/reservations/:id" element={<AdminReservationDetailsPage />} />
          <Route path="/admin/clients" element={<AdminClientsPage />} />
          <Route path="/admin/employees" element={<AdminEmployeesPage />} />
          <Route path="/admin/packs" element={<AdminPacksPage />} />
          <Route path="/admin/options" element={<AdminOptionsPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/contracts" element={<AdminContractsPage />} />
          <Route path="/admin/account" element={<AccountSecurityPage />} />
          <Route element={<ProtectedRoute requiredPermissions={["settings.manage"]} />}>
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedTypes={["SUPER_ADMIN"]} />}>
        <Route element={<DashboardLayout mode="super-admin" />}>
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboardPage />} />
          <Route path="/super-admin/agency-settings" element={<SuperAdminAgencySettingsPage />} />
          <Route path="/super-admin/visual-settings" element={<SuperAdminVisualSettingsPage />} />
          <Route path="/super-admin/reservation-settings" element={<SuperAdminReservationSettingsPage />} />
          <Route path="/super-admin/roles-permissions" element={<SuperAdminRolesPermissionsPage />} />
          <Route path="/super-admin/notification-settings" element={<SuperAdminNotificationSettingsPage />} />
          <Route path="/super-admin/document-settings" element={<SuperAdminDocumentSettingsPage />} />
          <Route path="/super-admin/audit-logs" element={<SuperAdminAuditLogsPage />} />
          <Route path="/super-admin/feature-flags" element={<SuperAdminFeatureFlagsPage />} />
          <Route path="/super-admin/account" element={<AccountSecurityPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

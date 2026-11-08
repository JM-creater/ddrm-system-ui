import { createBrowserRouter } from 'react-router-dom'
import AppLayout, { GuestOnly, RequireRole, RootRedirect } from './components/AppLayout/AppLayout'
import type { NavItem } from './components/AppLayout/AppLayout'
import AdminOverviewScreen from './screens/AdminOverviewScreen/AdminOverviewScreen'
import AlertsScreen from './screens/AlertsScreen/AlertsScreen'
import AssessmentResultsScreen from './screens/AssessmentResultsScreen/AssessmentResultsScreen'
import AssessmentScreen from './screens/AssessmentScreen/AssessmentScreen'
import DashboardScreen from './screens/DashboardScreen/DashboardScreen'
import DirectoryScreen from './screens/DirectoryScreen/DirectoryScreen'
import GuidesScreen from './screens/GuidesScreen/GuidesScreen'
import IncidentsScreen from './screens/IncidentsScreen/IncidentsScreen'
import LoginScreen from './screens/LoginScreen/LoginScreen'
import ManageAlertsScreen from './screens/ManageAlertsScreen/ManageAlertsScreen'
import ManageDirectoryScreen from './screens/ManageDirectoryScreen/ManageDirectoryScreen'
import ManageGuidesScreen from './screens/ManageGuidesScreen/ManageGuidesScreen'
import ManageIncidentsScreen from './screens/ManageIncidentsScreen/ManageIncidentsScreen'
import NotFoundScreen from './screens/NotFoundScreen/NotFoundScreen'
import ProfileScreen from './screens/ProfileScreen/ProfileScreen'
import QuizScreen from './screens/QuizScreen/QuizScreen'
import ReportIncidentScreen from './screens/ReportIncidentScreen/ReportIncidentScreen'
import ResidentsScreen from './screens/ResidentsScreen/ResidentsScreen'

const residentNav: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/report', label: 'Report Incident', icon: '🚨' },
  { to: '/incidents', label: 'Incident Reports', icon: '📋' },
  { to: '/quiz', label: 'Knowledge Test', icon: '📝' },
  { to: '/assessment', label: 'Preparedness Survey', icon: '🗳️' },
  { to: '/guides', label: 'Preparedness Guides', icon: '📖' },
  { to: '/alerts', label: 'Alerts Bulletin', icon: '📢' },
  { to: '/directory', label: 'Evacuation & Hotlines', icon: '🏠' },
  { to: '/profile', label: 'My Profile', icon: '👤' },
]

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/incidents', label: 'Incident Reports', icon: '📋' },
  { to: '/admin/alerts', label: 'Alerts Bulletin', icon: '📢' },
  { to: '/admin/assessment', label: 'Survey Results', icon: '📈' },
  { to: '/admin/guides', label: 'Preparedness Guides', icon: '📖' },
  { to: '/admin/directory', label: 'Evacuation & Hotlines', icon: '🏠' },
  { to: '/admin/residents', label: 'Residents', icon: '👥' },
  { to: '/admin/profile', label: 'My Profile', icon: '👤' },
]

export const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  {
    path: '/login',
    element: (
      <GuestOnly>
        <LoginScreen />
      </GuestOnly>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestOnly>
        <LoginScreen />
      </GuestOnly>
    ),
  },
  {
    element: (
      <RequireRole role="RESIDENT">
        <AppLayout items={residentNav} section="Resident Portal" note="v2.1 · Residents only" home="/dashboard" />
      </RequireRole>
    ),
    children: [
      { path: '/dashboard', element: <DashboardScreen /> },
      { path: '/report', element: <ReportIncidentScreen /> },
      { path: '/incidents', element: <IncidentsScreen /> },
      { path: '/assessment', element: <AssessmentScreen /> },
      { path: '/quiz', element: <QuizScreen /> },
      { path: '/guides', element: <GuidesScreen /> },
      { path: '/alerts', element: <AlertsScreen /> },
      { path: '/directory', element: <DirectoryScreen /> },
      { path: '/profile', element: <ProfileScreen /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireRole role="ADMIN">
        <AppLayout items={adminNav} section="DRRM Office" note="v2.1 · Barangay officers" home="/admin" />
      </RequireRole>
    ),
    children: [
      { index: true, element: <AdminOverviewScreen /> },
      { path: 'incidents', element: <ManageIncidentsScreen /> },
      { path: 'alerts', element: <ManageAlertsScreen /> },
      { path: 'guides', element: <ManageGuidesScreen /> },
      { path: 'directory', element: <ManageDirectoryScreen /> },
      { path: 'assessment', element: <AssessmentResultsScreen /> },
      { path: 'residents', element: <ResidentsScreen /> },
      { path: 'profile', element: <ProfileScreen /> },
    ],
  },
  { path: '*', element: <NotFoundScreen /> },
])

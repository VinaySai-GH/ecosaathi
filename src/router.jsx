import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import LoginScreen from './pages/auth/LoginPage.jsx';
import RegisterScreen from './pages/auth/RegisterPage.jsx';
import SidebarLayout from './layouts/SidebarLayout.jsx';
import PrivacyPage from './pages/auth/PrivacyPage.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import ProfileSettings from './pages/dashboard/ProfileSettings.jsx';
import NeeruHomeScreen from './pages/neeru/NeeruHome.jsx';
import NeeruResultScreen from './pages/neeru/NeeruResult.jsx';
import CarbonHome from './pages/carbonprints/CarbonPrintsPage';
import GreenSpotHome from './pages/greenspot/GreenSpotHome.jsx';
import EcoPulseHome from './pages/ecopulse/EcoPulseHome.jsx';
import EcoSandhya from './pages/ecosandhya/EcoSandhya.jsx';
import BotInsightsPage from './pages/dashboard/BotInsightsPage.jsx';
import NotificationsPage from './pages/notifications/NotificationsPage.jsx';
import EcoLearnHome from './pages/ecolearn/EcoLearnHome.jsx';
import LessonsHome from './pages/ecolearn/lessons/LessonsHome.jsx';
import LessonPage from './pages/ecolearn/lessons/LessonPage.jsx';
import QuizPage from './pages/ecolearn/lessons/QuizPage.jsx';
import PoliciesHome from './pages/ecolearn/policies/PoliciesHome.jsx';
import PolicyDetail from './pages/ecolearn/policies/PolicyDetail.jsx';
import EngagementHome from './pages/ecolearn/engagement/EngagementHome.jsx';

// Wrapper that redirects to /login if not authenticated
function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a1f14' }}>
        <div className="spinner" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

// Wrapper that redirects logged-in users away from auth pages
function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a1f14' }}>
        <div className="spinner" />
      </div>
    );
  }
  return !user ? children : <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <PublicRoute><LoginScreen /></PublicRoute>,
  },
  {
    path: '/register',
    element: <PublicRoute><RegisterScreen /></PublicRoute>,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/',
    element: <PrivateRoute><SidebarLayout /></PrivateRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'profile', element: <ProfileSettings /> },
      { path: 'neeru', element: <NeeruHomeScreen /> },
      { path: 'neeru/result', element: <NeeruResultScreen /> },
      { path: 'carbon', element: <CarbonHome /> },
      { path: 'greenspot', element: <GreenSpotHome /> },
      { path: 'ecosandhya', element: <EcoSandhya /> },
      { path: 'ecopulse', element: <EcoPulseHome /> },
      { path: 'insights', element: <BotInsightsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'ecolearn', element: <EcoLearnHome /> },
      { path: 'ecolearn/lessons', element: <LessonsHome /> },
      { path: 'ecolearn/lessons/:moduleId/:lessonId', element: <LessonPage /> },
      { path: 'ecolearn/lessons/:moduleId/quiz', element: <QuizPage /> },
      { path: 'ecolearn/policies', element: <PoliciesHome /> },
      { path: 'ecolearn/policies/:policyId', element: <PolicyDetail /> },
      { path: 'ecolearn/engagement', element: <EngagementHome /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

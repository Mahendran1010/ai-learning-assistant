import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import ProfilePage from './components/profile/ProfilePage';
import SkillsPage from './components/skills/SkillsPage';
import SchedulePage from './components/schedule/SchedulePage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/" />;
    }
    return children;
};

function AppContent() {
    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/signup" element={
                <PublicRoute>
                    <Signup />
                </PublicRoute>
            } />
            <Route path="/" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <DashboardHome />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <ProfilePage />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/skills" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <SkillsPage />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/schedule" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <SchedulePage />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <UserProvider>
                    <div className="App">
                        <AppContent />
                    </div>
                </UserProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
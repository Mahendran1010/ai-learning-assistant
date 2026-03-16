import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { FaHome, FaUser, FaChartBar, FaCalendarAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Dashboard.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { user, logout } = useAuth();
    const { profile } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', icon: <FaHome />, label: 'Dashboard' },
        { path: '/profile', icon: <FaUser />, label: 'Profile' },
        { path: '/skills', icon: <FaChartBar />, label: 'Skills' },
        { path: '/schedule', icon: <FaCalendarAlt />, label: 'Schedule' },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar Navigation */}
            <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>AI Learning Assistant</h2>
                    <p>Your Personal Learning Guide</p>
                </div>

                <div className="user-info">
                    <div className="user-avatar">
                        {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-details">
                        <h3>{profile?.name || user?.email || 'User'}</h3>
                        <p>{profile?.education || 'Student'}</p>
                    </div>
                </div>

                <ul className="nav-menu">
                    {navItems.map(item => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="sidebar-footer">
                    <div className="profile-dropdown">
                        <button 
                            className="profile-trigger"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <div className="profile-avatar-small">
                                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span>My Account</span>
                        </button>
                        
                        {showProfileMenu && (
                            <div className="dropdown-menu">
                                <Link to="/profile" onClick={() => setShowProfileMenu(false)}>
                                    <FaUser /> Profile Settings
                                </Link>
                                <button onClick={handleLogout}>
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Overlay for mobile */}
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Navbar;
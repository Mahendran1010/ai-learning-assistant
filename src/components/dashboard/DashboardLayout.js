import React from 'react';
import Navbar from './Navbar';
import './Dashboard.css';

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-container">
            <Navbar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
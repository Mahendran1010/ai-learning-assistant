import React, { useEffect } from 'react';
import emailService from '../services/emailService';
import notificationScheduler from '../services/notificationScheduler';
import calendarService from '../services/calendarService';
import { useAuth } from '../context/AuthContext';

const TestServices = () => {
    const { user } = useAuth();

    const testEmail = () => {
        if (user && user.email) {
            emailService.sendEmail(user.email, 'studyReminder', {
                name: user.email.split('@')[0],
                topics: ['JavaScript', 'React'],
                duration: 60,
                skill: 'Web Development',
                startLink: window.location.origin
            });
        }
    };

    const testNotification = () => {
        notificationScheduler.showBrowserNotification(
            'Test Notification',
            'This is a test notification from AI Learning Assistant'
        );
    };

    const testCalendar = () => {
        calendarService.addEvent({
            title: 'Test Study Session',
            start: new Date().toISOString(),
            end: new Date(Date.now() + 3600000).toISOString(),
            description: 'Test event for calendar integration'
        });
    };

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px', margin: '20px' }}>
            <h3>Service Test Panel</h3>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={testEmail} style={{ padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Test Email
                </button>
                <button onClick={testNotification} style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Test Notification
                </button>
                <button onClick={testCalendar} style={{ padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Test Calendar
                </button>
            </div>
        </div>
    );
};

export default TestServices;
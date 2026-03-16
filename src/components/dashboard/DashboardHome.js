import React from 'react';
import { useUser } from '../../context/UserContext';
import { Link } from 'react-router-dom';
import { FaBook, FaTasks, FaTrophy, FaClock, FaArrowRight } from 'react-icons/fa';
import './Dashboard.css';

const DashboardHome = () => {
    const { profile, skills, progress } = useUser();

    // Mock data for demonstration
    const todayTasks = [
        { id: 1, title: 'Complete JavaScript Basics', type: 'Learning', duration: '45 min', completed: false },
        { id: 2, title: 'Practice Arrays & Objects', type: 'Assignment', duration: '30 min', completed: false },
        { id: 3, title: 'Review Previous Topics', type: 'Revision', duration: '20 min', completed: true },
    ];

    const upcomingAssignments = [
        { id: 1, title: 'JavaScript Quiz', due: 'Today, 6:00 PM', status: 'pending' },
        { id: 2, title: 'React Components', due: 'Tomorrow, 10:00 AM', status: 'pending' },
    ];

    const skillProgress = [
        { name: 'JavaScript', level: 65, color: '#667eea' },
        { name: 'React', level: 30, color: '#764ba2' },
        { name: 'HTML/CSS', level: 80, color: '#10b981' },
    ];

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="dashboard-home">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div>
                    <h1>{getGreeting()}, {profile?.name?.split(' ')[0] || 'Learner'}! 👋</h1>
                    <p>Ready to learn something new today?</p>
                </div>
                <div className="streak-card">
                    <FaTrophy className="streak-icon" />
                    <div>
                        <h3>7 Day Streak</h3>
                        <p>Keep it up!</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <FaBook className="stat-icon" />
                    <div>
                        <h3>12</h3>
                        <p>Topics Learned</p>
                    </div>
                </div>
                <div className="stat-card">
                    <FaTasks className="stat-icon" />
                    <div>
                        <h3>8</h3>
                        <p>Assignments Done</p>
                    </div>
                </div>
                <div className="stat-card">
                    <FaClock className="stat-icon" />
                    <div>
                        <h3>15h</h3>
                        <p>Study Time</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Today's Tasks */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Today's Learning Plan</h2>
                        <Link to="/schedule" className="view-all">View Schedule <FaArrowRight /></Link>
                    </div>
                    <div className="task-list">
                        {todayTasks.map(task => (
                            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                <div className="task-checkbox">
                                    <input 
                                        type="checkbox" 
                                        checked={task.completed}
                                        readOnly
                                    />
                                </div>
                                <div className="task-info">
                                    <h4>{task.title}</h4>
                                    <p>{task.type} • {task.duration}</p>
                                </div>
                                <span className={`task-badge ${task.type.toLowerCase()}`}>
                                    {task.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skill Progress */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Skill Progress</h2>
                        <Link to="/skills" className="view-all">View All <FaArrowRight /></Link>
                    </div>
                    <div className="skill-list">
                        {skillProgress.map(skill => (
                            <div key={skill.name} className="skill-item">
                                <div className="skill-header">
                                    <span>{skill.name}</span>
                                    <span>{skill.level}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ 
                                            width: `${skill.level}%`,
                                            backgroundColor: skill.color 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Assignments */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Upcoming Assignments</h2>
                        <Link to="/skills" className="view-all">View All <FaArrowRight /></Link>
                    </div>
                    <div className="assignment-list">
                        {upcomingAssignments.map(assignment => (
                            <div key={assignment.id} className="assignment-item">
                                <div className="assignment-info">
                                    <h4>{assignment.title}</h4>
                                    <p className="due-date">Due: {assignment.due}</p>
                                </div>
                                <button className="btn-start">Start</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Learning */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Recommended for You</h2>
                        <Link to="/skills" className="view-all">Explore <FaArrowRight /></Link>
                    </div>
                    <div className="recommendation-list">
                        <div className="recommendation-item">
                            <img src="https://via.placeholder.com/60" alt="React" />
                            <div>
                                <h4>React Hooks Deep Dive</h4>
                                <p>Based on your interest in React</p>
                            </div>
                        </div>
                        <div className="recommendation-item">
                            <img src="https://via.placeholder.com/60" alt="JavaScript" />
                            <div>
                                <h4>Advanced JavaScript Concepts</h4>
                                <p>Complete your JS learning path</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <button className="action-btn">
                        <FaBook /> Start Today's Lesson
                    </button>
                    <button className="action-btn">
                        <FaTasks /> Take Assignment
                    </button>
                    <button className="action-btn">
                        <FaClock /> View Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
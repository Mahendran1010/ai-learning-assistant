import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { FaClock, FaBed, FaLaptop, FaGamepad, FaBook, FaCalendarAlt, FaBell, FaSave, FaEdit, FaTrash, FaPlus, FaSun, FaMoon, FaCoffee, FaUtensils } from 'react-icons/fa';
import emailService from '../../services/emailService';
import notificationScheduler from '../../services/notificationScheduler';
import calendarService from '../../services/calendarService';
import './Schedule.css';

const SchedulePage = () => {
    const { schedule, updateSchedule } = useUser();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('setup');
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedDay, setSelectedDay] = useState('monday');
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Request notification permission on component mount
    useEffect(() => {
        notificationScheduler.requestNotificationPermission();
        
        // Cleanup when component unmounts
        return () => {
            notificationScheduler.stop();
        };
    }, []);

    // Form state for daily routine
    const [routine, setRoutine] = useState({
        wakeUpTime: '07:00',
        sleepTime: '23:00',
        workStart: '09:00',
        workEnd: '18:00',
        studyHours: 2,
        preferredStudyTime: 'evening', // morning, afternoon, evening
        breakDuration: 15, // minutes
        hasWeekendStudy: true,
        weekendStudyHours: 1,
        
        // Weekly commitments
        weeklySchedule: {
            monday: {
                commitments: [],
                studySlots: []
            },
            tuesday: {
                commitments: [],
                studySlots: []
            },
            wednesday: {
                commitments: [],
                studySlots: []
            },
            thursday: {
                commitments: [],
                studySlots: []
            },
            friday: {
                commitments: [],
                studySlots: []
            },
            saturday: {
                commitments: [],
                studySlots: []
            },
            sunday: {
                commitments: [],
                studySlots: []
            }
        }
    });

    // Mock generated study plan
    const [studyPlan, setStudyPlan] = useState(null);

    // Days of week
    const daysOfWeek = [
        { id: 'monday', label: 'Monday' },
        { id: 'tuesday', label: 'Tuesday' },
        { id: 'wednesday', label: 'Wednesday' },
        { id: 'thursday', label: 'Thursday' },
        { id: 'friday', label: 'Friday' },
        { id: 'saturday', label: 'Saturday' },
        { id: 'sunday', label: 'Sunday' }
    ];

    // Mock topics for study plan
    const availableTopics = [
        { id: 1, name: 'JavaScript Fundamentals', duration: 45, skill: 'JavaScript' },
        { id: 2, name: 'React Hooks', duration: 60, skill: 'React' },
        { id: 3, name: 'Array Methods', duration: 30, skill: 'JavaScript' },
        { id: 4, name: 'Component Lifecycle', duration: 45, skill: 'React' },
        { id: 5, name: 'CSS Flexbox', duration: 30, skill: 'CSS' },
        { id: 6, name: 'Async/Await', duration: 40, skill: 'JavaScript' },
        { id: 7, name: 'State Management', duration: 60, skill: 'React' },
        { id: 8, name: 'API Integration', duration: 45, skill: 'JavaScript' }
    ];

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRoutine(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Generate time slots
    const generateTimeSlots = (day, hours) => {
        const slots = [];
        const startHour = routine.preferredStudyTime === 'morning' ? 8 : 
                         routine.preferredStudyTime === 'afternoon' ? 14 : 19;
        
        for (let i = 0; i < hours; i++) {
            slots.push({
                start: `${startHour + i}:00`,
                end: `${startHour + i + 1}:00`,
                topic: null,
                completed: false,
                notificationSent: false,
                missedNotified: false
            });
        }
        return slots;
    };

    // Generate study schedule
    const generateSchedule = () => {
        // Calculate available study time based on routine
        const wakeTime = parseInt(routine.wakeUpTime.split(':')[0]);
        const sleepTime = parseInt(routine.sleepTime.split(':')[0]);
        const workStart = parseInt(routine.workStart.split(':')[0]);
        const workEnd = parseInt(routine.workEnd.split(':')[0]);
        
        const totalAvailableHours = sleepTime - wakeTime;
        const workHours = workEnd - workStart;
        const freeHours = totalAvailableHours - workHours - 8; // 8 hours for other activities
        
        // Generate study slots
        const generatedPlan = {
            totalStudyHours: routine.studyHours,
            preferredTime: routine.preferredStudyTime,
            weeklyPlan: {},
            recommendations: [],
            nextWeekTopics: []
        };

        // Generate daily plan for each day
        daysOfWeek.forEach(day => {
            if (day.id === 'saturday' || day.id === 'sunday') {
                if (routine.hasWeekendStudy) {
                    generatedPlan.weeklyPlan[day.id] = {
                        studyHours: routine.weekendStudyHours,
                        slots: generateTimeSlots(day.id, routine.weekendStudyHours)
                    };
                } else {
                    generatedPlan.weeklyPlan[day.id] = {
                        studyHours: 0,
                        slots: []
                    };
                }
            } else {
                generatedPlan.weeklyPlan[day.id] = {
                    studyHours: routine.studyHours,
                    slots: generateTimeSlots(day.id, routine.studyHours)
                };
            }
        });

        // Generate topic recommendations
        generatedPlan.nextWeekTopics = availableTopics.slice(0, 5);
        
        // Add recommendations
        generatedPlan.recommendations = [
            "Based on your skill assessment, focus on JavaScript fundamentals this week",
            "Schedule your study sessions in the evening when you're most productive",
            "Take 15-minute breaks between study sessions for better retention",
            "Review previous topics every weekend to strengthen your understanding"
        ];

        setStudyPlan(generatedPlan);
        
        // Send email notifications and setup calendar
        if (user && user.email) {
            // Send welcome email
            emailService.sendEmail(user.email, 'weeklyReport', {
                name: user.email.split('@')[0],
                week: 'This Week',
                studyHours: routine.studyHours * 5,
                topicsCompleted: 0,
                assignmentsDone: 0,
                streak: 0,
                skillsImproved: [],
                nextFocus: generatedPlan.nextWeekTopics.map(t => t.name),
                dashboardLink: 'http://localhost:3000'
            });
            
            // Start notification scheduler
            notificationScheduler.start(user.email, user.email.split('@')[0], generatedPlan);
            
            // Create calendar events
            calendarService.createStudyEvents(generatedPlan, user.email.split('@')[0]);
            
            // Log for debugging
            console.log('✅ Email notification sent to:', user.email);
            console.log('✅ Calendar events created');
            console.log('✅ Notification scheduler started');
        }
        
        setActiveTab('view');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    // Add commitment
    const handleAddCommitment = (commitment) => {
        setRoutine(prev => ({
            ...prev,
            weeklySchedule: {
                ...prev.weeklySchedule,
                [selectedDay]: {
                    ...prev.weeklySchedule[selectedDay],
                    commitments: [...prev.weeklySchedule[selectedDay].commitments, commitment]
                }
            }
        }));
        setShowAddTask(false);
    };

    // Remove commitment
    const handleRemoveCommitment = (day, index) => {
        setRoutine(prev => ({
            ...prev,
            weeklySchedule: {
                ...prev.weeklySchedule,
                [day]: {
                    ...prev.weeklySchedule[day],
                    commitments: prev.weeklySchedule[day].commitments.filter((_, i) => i !== index)
                }
            }
        }));
    };

    // Mark task as completed
    const markTaskCompleted = (day, slotIndex) => {
        if (studyPlan) {
            const updatedPlan = { ...studyPlan };
            updatedPlan.weeklyPlan[day].slots[slotIndex].completed = 
                !updatedPlan.weeklyPlan[day].slots[slotIndex].completed;
            setStudyPlan(updatedPlan);
        }
    };

    // Reschedule missed day
    const rescheduleDay = (day) => {
        if (studyPlan) {
            const updatedPlan = { ...studyPlan };
            // Move today's tasks to tomorrow
            const todaySlots = updatedPlan.weeklyPlan[day].slots;
            const tomorrow = daysOfWeek[(daysOfWeek.findIndex(d => d.id === day) + 1) % 7].id;
            
            if (updatedPlan.weeklyPlan[tomorrow]) {
                updatedPlan.weeklyPlan[tomorrow].slots = [
                    ...todaySlots.filter(slot => !slot.completed),
                    ...updatedPlan.weeklyPlan[tomorrow].slots
                ];
                updatedPlan.weeklyPlan[day].slots = todaySlots.filter(slot => slot.completed);
            }
            
            setStudyPlan(updatedPlan);
        }
    };

    return (
        <div className="schedule-page">
            {/* Success Message */}
            {showSuccess && (
                <div className="success-message">
                    Schedule generated successfully! Check your email for reminders.
                </div>
            )}

            {/* Header */}
            <div className="schedule-header">
                <h1>Learning Schedule</h1>
                <p>Set up your daily routine and get a personalized study plan</p>
            </div>

            {/* Tabs */}
            <div className="schedule-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'setup' ? 'active' : ''}`}
                    onClick={() => setActiveTab('setup')}
                >
                    <FaClock /> Setup Routine
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
                    onClick={() => setActiveTab('view')}
                    disabled={!studyPlan}
                >
                    <FaCalendarAlt /> View Schedule
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Setup Tab */}
                {activeTab === 'setup' && (
                    <div className="setup-container">
                        <div className="routine-form">
                            {/* Daily Schedule */}
                            <div className="form-section">
                                <h2><FaClock /> Daily Routine</h2>
                                
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label><FaSun /> Wake Up Time</label>
                                        <input
                                            type="time"
                                            name="wakeUpTime"
                                            value={routine.wakeUpTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label><FaMoon /> Sleep Time</label>
                                        <input
                                            type="time"
                                            name="sleepTime"
                                            value={routine.sleepTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label><FaLaptop /> Work Start</label>
                                        <input
                                            type="time"
                                            name="workStart"
                                            value={routine.workStart}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label><FaLaptop /> Work End</label>
                                        <input
                                            type="time"
                                            name="workEnd"
                                            value={routine.workEnd}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Study Preferences */}
                            <div className="form-section">
                                <h2><FaBook /> Study Preferences</h2>
                                
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Daily Study Hours</label>
                                        <input
                                            type="number"
                                            name="studyHours"
                                            value={routine.studyHours}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="8"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Preferred Study Time</label>
                                        <select
                                            name="preferredStudyTime"
                                            value={routine.preferredStudyTime}
                                            onChange={handleInputChange}
                                        >
                                            <option value="morning">Morning (8 AM - 12 PM)</option>
                                            <option value="afternoon">Afternoon (2 PM - 6 PM)</option>
                                            <option value="evening">Evening (7 PM - 11 PM)</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Break Duration (minutes)</label>
                                        <input
                                            type="number"
                                            name="breakDuration"
                                            value={routine.breakDuration}
                                            onChange={handleInputChange}
                                            min="5"
                                            max="60"
                                            step="5"
                                        />
                                    </div>

                                    <div className="form-group checkbox">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="hasWeekendStudy"
                                                checked={routine.hasWeekendStudy}
                                                onChange={handleInputChange}
                                            />
                                            Study on Weekends
                                        </label>
                                    </div>

                                    {routine.hasWeekendStudy && (
                                        <div className="form-group">
                                            <label>Weekend Study Hours</label>
                                            <input
                                                type="number"
                                                name="weekendStudyHours"
                                                value={routine.weekendStudyHours}
                                                onChange={handleInputChange}
                                                min="1"
                                                max="4"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Weekly Commitments */}
                            <div className="form-section">
                                <h2><FaCalendarAlt /> Weekly Commitments</h2>
                                
                                <div className="day-selector">
                                    {daysOfWeek.map(day => (
                                        <button
                                            key={day.id}
                                            className={`day-btn ${selectedDay === day.id ? 'active' : ''}`}
                                            onClick={() => setSelectedDay(day.id)}
                                        >
                                            {day.label.substring(0, 3)}
                                        </button>
                                    ))}
                                </div>

                                <div className="commitments-list">
                                    <h3>{daysOfWeek.find(d => d.id === selectedDay)?.label}</h3>
                                    
                                    {routine.weeklySchedule[selectedDay]?.commitments.map((commitment, index) => (
                                        <div key={index} className="commitment-item">
                                            <div className="commitment-info">
                                                <span className="commitment-time">{commitment.time}</span>
                                                <span className="commitment-title">{commitment.title}</span>
                                            </div>
                                            <button 
                                                className="remove-btn"
                                                onClick={() => handleRemoveCommitment(selectedDay, index)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}

                                    <button 
                                        className="add-commitment-btn"
                                        onClick={() => setShowAddTask(true)}
                                    >
                                        <FaPlus /> Add Commitment
                                    </button>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="form-actions">
                                <button 
                                    className="btn-generate"
                                    onClick={generateSchedule}
                                >
                                    Generate My Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Schedule Tab */}
                {activeTab === 'view' && studyPlan && (
                    <div className="view-container">
                        {/* Schedule Summary */}
                        <div className="schedule-summary">
                            <div className="summary-card">
                                <h3>Daily Study Time</h3>
                                <p className="summary-value">{studyPlan.totalStudyHours} hours</p>
                                <p>{studyPlan.preferredTime} sessions</p>
                            </div>
                            <div className="summary-card">
                                <h3>Weekly Total</h3>
                                <p className="summary-value">
                                    {Object.values(studyPlan.weeklyPlan).reduce((acc, day) => acc + day.studyHours, 0)} hours
                                </p>
                                <p>Including weekends</p>
                            </div>
                            <div className="summary-card">
                                <h3>Topics This Week</h3>
                                <p className="summary-value">{studyPlan.nextWeekTopics.length}</p>
                                <p>New skills to learn</p>
                            </div>
                        </div>

                        {/* Weekly Schedule Grid */}
                        <div className="weekly-schedule">
                            {daysOfWeek.map(day => (
                                <div key={day.id} className="day-schedule">
                                    <div className="day-header">
                                        <h3>{day.label}</h3>
                                        <span className="study-hours">
                                            {studyPlan.weeklyPlan[day.id]?.studyHours}h
                                        </span>
                                    </div>
                                    
                                    <div className="time-slots">
                                        {studyPlan.weeklyPlan[day.id]?.slots.map((slot, index) => (
                                            <div 
                                                key={index} 
                                                className={`time-slot ${slot.completed ? 'completed' : ''}`}
                                            >
                                                <div className="slot-time">
                                                    {slot.start} - {slot.end}
                                                </div>
                                                <div className="slot-content">
                                                    <input
                                                        type="checkbox"
                                                        checked={slot.completed}
                                                        onChange={() => markTaskCompleted(day.id, index)}
                                                    />
                                                    <span className="slot-topic">
                                                        {slot.topic || 'Study Session'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {routine.weeklySchedule[day.id]?.commitments.map((commitment, index) => (
                                            <div key={`commit-${index}`} className="time-slot commitment">
                                                <div className="slot-time">
                                                    {commitment.time}
                                                </div>
                                                <div className="slot-content">
                                                    <FaCoffee className="commitment-icon" />
                                                    <span className="slot-topic">{commitment.title}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Reschedule button for missed days */}
                                    {day.id === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() && (
                                        <button 
                                            className="reschedule-btn"
                                            onClick={() => rescheduleDay(day.id)}
                                        >
                                            Reschedule Missed Sessions
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Recommendations */}
                        <div className="recommendations-section">
                            <h3>Recommendations & Tips</h3>
                            <div className="recommendations-list">
                                {studyPlan.recommendations.map((rec, index) => (
                                    <div key={index} className="recommendation-item">
                                        <span className="rec-bullet">•</span>
                                        <p>{rec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Topics for Next Week */}
                        <div className="topics-section">
                            <h3>Topics for Next Week</h3>
                            <div className="topics-grid">
                                {studyPlan.nextWeekTopics.map(topic => (
                                    <div key={topic.id} className="topic-card">
                                        <h4>{topic.name}</h4>
                                        <p>{topic.skill} • {topic.duration} mins</p>
                                        <button className="btn-preview">Preview</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Email Notification Settings */}
                        <div className="notification-settings">
                            <h3><FaBell /> Notification Settings</h3>
                            <div className="settings-grid">
                                <label className="setting-item">
                                    <input type="checkbox" defaultChecked />
                                    Email me daily study reminders
                                </label>
                                <label className="setting-item">
                                    <input type="checkbox" defaultChecked />
                                    Notify before study session starts
                                </label>
                                <label className="setting-item">
                                    <input type="checkbox" />
                                    Weekly progress report
                                </label>
                                <label className="setting-item">
                                    <input type="checkbox" defaultChecked />
                                    Remind me of upcoming assignments
                                </label>
                            </div>
                            <button className="btn-save-settings">
                                <FaSave /> Save Preferences
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Commitment Modal */}
            {showAddTask && (
                <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Add Commitment</h2>
                        
                        <AddCommitmentForm 
                            onAdd={handleAddCommitment}
                            onClose={() => setShowAddTask(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// Add Commitment Form Component
const AddCommitmentForm = ({ onAdd, onClose }) => {
    const [commitment, setCommitment] = useState({
        time: '18:00',
        title: '',
        type: 'personal' // personal, work, study, other
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (commitment.title.trim()) {
            onAdd(commitment);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="commitment-form">
            <div className="form-group">
                <label>Time</label>
                <input
                    type="time"
                    value={commitment.time}
                    onChange={(e) => setCommitment({...commitment, time: e.target.value})}
                    required
                />
            </div>

            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    placeholder="e.g., Team Meeting, Gym, etc."
                    value={commitment.title}
                    onChange={(e) => setCommitment({...commitment, title: e.target.value})}
                    required
                />
            </div>

            <div className="form-group">
                <label>Type</label>
                <select
                    value={commitment.type}
                    onChange={(e) => setCommitment({...commitment, type: e.target.value})}
                >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="study">Study</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="btn-primary">
                    Add Commitment
                </button>
            </div>
        </form>
    );
};

export default SchedulePage;
import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaGraduationCap, FaBirthdayCake, FaBriefcase, FaEdit, FaSave, FaCamera } from 'react-icons/fa';
import './Profile.css';

const ProfilePage = () => {
    const { profile, updateProfile } = useUser();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        email: profile?.email || user?.email || '',
        age: profile?.age || '',
        education: profile?.education || '',
        occupation: profile?.occupation || '',
        phone: profile?.phone || '',
        location: profile?.location || '',
        bio: profile?.bio || '',
        learningGoals: profile?.learningGoals || '',
        experience: profile?.experience || 'beginner',
        interests: profile?.interests || []
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const educationLevels = [
        'High School',
        'Bachelor\'s Degree',
        'Master\'s Degree',
        'PhD',
        'Self-taught',
        'Other'
    ];

    const experienceLevels = [
        { value: 'beginner', label: 'Beginner (0-1 years)' },
        { value: 'intermediate', label: 'Intermediate (1-3 years)' },
        { value: 'advanced', label: 'Advanced (3+ years)' }
    ];

    const interestOptions = [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Cloud Computing',
        'Cybersecurity',
        'UI/UX Design',
        'Digital Marketing',
        'Business',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInterestChange = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    profilePicture: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-page">
            {/* Success Message */}
            {showSuccess && (
                <div className="success-message">
                    Profile updated successfully!
                </div>
            )}

            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-cover">
                    <div className="profile-avatar-container">
                        <div className="profile-avatar-large">
                            {formData.profilePicture ? (
                                <img src={formData.profilePicture} alt="Profile" />
                            ) : (
                                formData.name?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        {isEditing && (
                            <label className="avatar-upload">
                                <FaCamera />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        )}
                    </div>
                    <div className="profile-title">
                        <h1>{formData.name || 'Your Name'}</h1>
                        <p>{formData.occupation || 'Add your occupation'}</p>
                    </div>
                    <button 
                        className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel' : <><FaEdit /> Edit Profile</>}
                    </button>
                </div>
            </div>

            {/* Profile Content */}
            <div className="profile-content">
                <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="profile-section">
                        <h2>Personal Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <FaUser className="info-icon" />
                                <div className="info-content">
                                    <label>Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                        />
                                    ) : (
                                        <p>{formData.name || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="info-item">
                                <FaEnvelope className="info-icon" />
                                <div className="info-content">
                                    <label>Email Address</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                        />
                                    ) : (
                                        <p>{formData.email || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="info-item">
                                <FaBirthdayCake className="info-icon" />
                                <div className="info-content">
                                    <label>Age</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="Enter your age"
                                            min="15"
                                            max="100"
                                        />
                                    ) : (
                                        <p>{formData.age || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="info-item">
                                <FaGraduationCap className="info-icon" />
                                <div className="info-content">
                                    <label>Education</label>
                                    {isEditing ? (
                                        <select
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select education</option>
                                            {educationLevels.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p>{formData.education || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="info-item">
                                <FaBriefcase className="info-icon" />
                                <div className="info-content">
                                    <label>Occupation</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="occupation"
                                            value={formData.occupation}
                                            onChange={handleChange}
                                            placeholder="Enter your occupation"
                                        />
                                    ) : (
                                        <p>{formData.occupation || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="info-item">
                                <FaBriefcase className="info-icon" />
                                <div className="info-content">
                                    <label>Location</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="City, Country"
                                        />
                                    ) : (
                                        <p>{formData.location || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="profile-section">
                        <h2>About Me</h2>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                rows="4"
                            />
                        ) : (
                            <p className="bio-text">{formData.bio || 'No bio provided yet.'}</p>
                        )}
                    </div>

                    {/* Learning Preferences */}
                    <div className="profile-section">
                        <h2>Learning Preferences</h2>
                        
                        <div className="preferences-grid">
                            <div className="preference-item">
                                <label>Experience Level</label>
                                {isEditing ? (
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                    >
                                        {experienceLevels.map(level => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p>{experienceLevels.find(l => l.value === formData.experience)?.label || 'Not set'}</p>
                                )}
                            </div>

                            <div className="preference-item full-width">
                                <label>Learning Goals</label>
                                {isEditing ? (
                                    <textarea
                                        name="learningGoals"
                                        value={formData.learningGoals}
                                        onChange={handleChange}
                                        placeholder="What do you want to achieve?"
                                        rows="3"
                                    />
                                ) : (
                                    <p>{formData.learningGoals || 'No goals set yet.'}</p>
                                )}
                            </div>

                            <div className="preference-item full-width">
                                <label>Areas of Interest</label>
                                {isEditing ? (
                                    <div className="interests-grid">
                                        {interestOptions.map(interest => (
                                            <label key={interest} className="interest-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.interests.includes(interest)}
                                                    onChange={() => handleInterestChange(interest)}
                                                />
                                                {interest}
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="interests-display">
                                        {formData.interests.length > 0 ? (
                                            formData.interests.map(interest => (
                                                <span key={interest} className="interest-tag">
                                                    {interest}
                                                </span>
                                            ))
                                        ) : (
                                            <p>No interests selected</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Account Statistics */}
                    <div className="profile-section">
                        <h2>Account Statistics</h2>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <h3>Learning Streak</h3>
                                <p className="stat-value">7 days</p>
                            </div>
                            <div className="stat-box">
                                <h3>Topics Completed</h3>
                                <p className="stat-value">12</p>
                            </div>
                            <div className="stat-box">
                                <h3>Assignments Done</h3>
                                <p className="stat-value">8</p>
                            </div>
                            <div className="stat-box">
                                <h3>Total Study Hours</h3>
                                <p className="stat-value">15h</p>
                            </div>
                            <div className="stat-box">
                                <h3>Member Since</h3>
                                <p className="stat-value">Jan 2024</p>
                            </div>
                            <div className="stat-box">
                                <h3>Last Active</h3>
                                <p className="stat-value">Today</p>
                            </div>
                        </div>
                    </div>

                    {/* Save Button (when editing) */}
                    {isEditing && (
                        <div className="profile-actions">
                            <button type="submit" className="btn btn-primary btn-large">
                                <FaSave /> Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
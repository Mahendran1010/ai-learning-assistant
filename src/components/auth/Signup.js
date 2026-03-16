import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Account Info
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        
        // Personal Info
        age: '',
        education: '',
        occupation: '',
        
        // Preferences
        learningGoals: '',
        experience: 'beginner',
        interests: []
    });
    
    const [errors, setErrors] = useState({});
    const { signup, loading, error } = useAuth();
    const { updateProfile } = useUser();
    const navigate = useNavigate();

    // Available options
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

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            // Handle checkbox for interests
            if (checked) {
                setFormData(prev => ({
                    ...prev,
                    interests: [...prev.interests, value]
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    interests: prev.interests.filter(item => item !== value)
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate step 1 (Account Info)
    const validateStep1 = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        return newErrors;
    };

    // Validate step 2 (Personal Info)
    const validateStep2 = () => {
        const newErrors = {};
        
        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else if (formData.age < 15 || formData.age > 100) {
            newErrors.age = 'Please enter a valid age';
        }
        
        if (!formData.education) {
            newErrors.education = 'Education level is required';
        }
        
        return newErrors;
    };

    // Handle next step
    const handleNext = () => {
        let stepErrors = {};
        
        if (step === 1) {
            stepErrors = validateStep1();
        } else if (step === 2) {
            stepErrors = validateStep2();
        }
        
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return;
        }
        
        setStep(step + 1);
    };

    // Handle previous step
    const handlePrev = () => {
        setStep(step - 1);
        setErrors({});
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (step === 3) {
            try {
                // Save to user context
                updateProfile({
                    name: formData.name,
                    email: formData.email,
                    age: formData.age,
                    education: formData.education,
                    occupation: formData.occupation,
                    learningGoals: formData.learningGoals,
                    experience: formData.experience,
                    interests: formData.interests
                });
                
                // Create account
                await signup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                
                // Navigate to skills assessment
                navigate('/skills');
            } catch (err) {
                console.error('Signup failed:', err);
            }
        }
    };

    // Render step indicators
    const renderStepIndicators = () => {
        return (
            <div className="step-indicators">
                <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Account</span>
                </div>
                <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Personal</span>
                </div>
                <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Preferences</span>
                </div>
            </div>
        );
    };

    // Render step 1: Account Information
    const renderStep1 = () => (
        <>
            <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
        </>
    );

    // Render step 2: Personal Information
    const renderStep2 = () => (
        <>
            <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter your age"
                    min="15"
                    max="100"
                    className={errors.age ? 'error' : ''}
                />
                {errors.age && <span className="field-error">{errors.age}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="education">Education Level *</label>
                <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className={errors.education ? 'error' : ''}
                >
                    <option value="">Select education level</option>
                    {educationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>
                {errors.education && <span className="field-error">{errors.education}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="occupation">Current Occupation</label>
                <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="e.g., Student, Working Professional, etc."
                />
            </div>
        </>
    );

    // Render step 3: Preferences
    const renderStep3 = () => (
        <>
            <div className="form-group">
                <label htmlFor="experience">Experience Level</label>
                <select
                    id="experience"
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
            </div>

            <div className="form-group">
                <label>Areas of Interest (Select multiple)</label>
                <div className="checkbox-group">
                    {interestOptions.map(interest => (
                        <label key={interest} className="checkbox-label">
                            <input
                                type="checkbox"
                                name="interests"
                                value={interest}
                                checked={formData.interests.includes(interest)}
                                onChange={handleChange}
                            />
                            {interest}
                        </label>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="learningGoals">Learning Goals</label>
                <textarea
                    id="learningGoals"
                    name="learningGoals"
                    value={formData.learningGoals}
                    onChange={handleChange}
                    placeholder="What do you want to achieve? (e.g., Get a job in web development, Learn data science, etc.)"
                    rows="4"
                />
            </div>
        </>
    );

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join our learning community</p>
                </div>

                {renderStepIndicators()}
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="auth-form">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    
                    <div className="form-navigation">
                        {step > 1 && (
                            <button 
                                type="button" 
                                onClick={handlePrev}
                                className="btn btn-secondary"
                                disabled={loading}
                            >
                                Previous
                            </button>
                        )}
                        
                        {step < 3 ? (
                            <button 
                                type="button" 
                                onClick={handleNext}
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                Next
                            </button>
                        ) : (
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        )}
                    </div>
                </form>
                
                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
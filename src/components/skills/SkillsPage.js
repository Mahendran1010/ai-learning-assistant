import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaStar, FaChartBar, FaBook, FaLaptop, FaCode, FaDatabase, FaCloud, FaShieldAlt, FaPalette, FaChartLine } from 'react-icons/fa';
import './Skills.css';

const SkillsPage = () => {
    const { skills, addSkills } = useUser();
    const [activeTab, setActiveTab] = useState('my-skills');
    const [showAddSkill, setShowAddSkill] = useState(false);
    const [showAssessment, setShowAssessment] = useState(false);
    const [currentAssessment, setCurrentAssessment] = useState(null);
    const [assessmentAnswers, setAssessmentAnswers] = useState({});
    const [assessmentResult, setAssessmentResult] = useState(null);

    // Mock data for available skills
    const availableSkills = [
        { id: 1, name: 'JavaScript', category: 'Programming', icon: <FaCode />, level: 'Beginner to Advanced', duration: '40 hours' },
        { id: 2, name: 'React', category: 'Frontend', icon: <FaLaptop />, level: 'Intermediate', duration: '30 hours' },
        { id: 3, name: 'Python', category: 'Programming', icon: <FaCode />, level: 'Beginner to Advanced', duration: '35 hours' },
        { id: 4, name: 'Node.js', category: 'Backend', icon: <FaDatabase />, level: 'Intermediate', duration: '25 hours' },
        { id: 5, name: 'SQL', category: 'Database', icon: <FaDatabase />, level: 'Beginner', duration: '15 hours' },
        { id: 6, name: 'AWS', category: 'Cloud', icon: <FaCloud />, level: 'Intermediate', duration: '30 hours' },
        { id: 7, name: 'Cybersecurity', category: 'Security', icon: <FaShieldAlt />, level: 'Beginner', duration: '20 hours' },
        { id: 8, name: 'UI/UX Design', category: 'Design', icon: <FaPalette />, level: 'Beginner', duration: '25 hours' },
        { id: 9, name: 'Data Science', category: 'Data', icon: <FaChartLine />, level: 'Advanced', duration: '45 hours' },
    ];

    // Mock user skills (will come from context)
    const [userSkills, setUserSkills] = useState([
        { id: 1, name: 'JavaScript', level: 65, progress: 65, lastAssessed: '2024-01-15' },
        { id: 2, name: 'React', level: 30, progress: 30, lastAssessed: '2024-01-10' },
        { id: 3, name: 'HTML/CSS', level: 80, progress: 80, lastAssessed: '2024-01-05' },
    ]);

    // Mock assessment questions
    const assessments = {
        JavaScript: [
            {
                id: 1,
                question: "What is closure in JavaScript?",
                options: [
                    "A function bundled with its lexical environment",
                    "A way to close browser windows",
                    "A type of loop",
                    "A debugging tool"
                ],
                correct: 0
            },
            {
                id: 2,
                question: "Which method is used to add elements at the end of an array?",
                options: [
                    "push()",
                    "pop()",
                    "shift()",
                    "unshift()"
                ],
                correct: 0
            },
            {
                id: 3,
                question: "What does 'this' keyword refer to in JavaScript?",
                options: [
                    "The current function",
                    "The global object",
                    "The object that is executing the current function",
                    "The parent object"
                ],
                correct: 2
            },
            {
                id: 4,
                question: "Which of the following is not a JavaScript data type?",
                options: [
                    "Symbol",
                    "Boolean",
                    "Integer",
                    "String"
                ],
                correct: 2
            },
            {
                id: 5,
                question: "What is the output of 2 + '2' in JavaScript?",
                options: [
                    "4",
                    "22",
                    "Error",
                    "undefined"
                ],
                correct: 1
            }
        ]
    };

    // Handle adding new skill
    const handleAddSkill = (skill) => {
        setUserSkills([...userSkills, {
            id: skill.id,
            name: skill.name,
            level: 0,
            progress: 0,
            lastAssessed: 'Not assessed'
        }]);
        setShowAddSkill(false);
    };

    // Handle remove skill
    const handleRemoveSkill = (skillId) => {
        setUserSkills(userSkills.filter(skill => skill.id !== skillId));
    };

    // Start assessment
    const startAssessment = (skillName) => {
        setCurrentAssessment(skillName);
        setAssessmentAnswers({});
        setAssessmentResult(null);
        setShowAssessment(true);
    };

    // Handle answer selection
    const handleAnswerSelect = (questionId, answerIndex) => {
        setAssessmentAnswers({
            ...assessmentAnswers,
            [questionId]: answerIndex
        });
    };

    // Submit assessment
    const submitAssessment = () => {
        const questions = assessments[currentAssessment];
        let correct = 0;
        const total = questions.length;

        questions.forEach(q => {
            if (assessmentAnswers[q.id] === q.correct) {
                correct++;
            }
        });

        const score = Math.round((correct / total) * 100);
        
        // Update user skill level
        setUserSkills(userSkills.map(skill => 
            skill.name === currentAssessment 
                ? { ...skill, level: score, progress: score, lastAssessed: new Date().toISOString().split('T')[0] }
                : skill
        ));

        setAssessmentResult({
            score,
            correct,
            total,
            feedback: getFeedback(score)
        });
    };

    // Get feedback based on score
    const getFeedback = (score) => {
        if (score >= 80) {
            return "Excellent! You have strong knowledge in this area. Ready for advanced topics!";
        } else if (score >= 60) {
            return "Good job! You have a solid foundation. Keep practicing to improve further.";
        } else if (score >= 40) {
            return "Fair attempt! You understand the basics but need more practice.";
        } else {
            return "Keep learning! This area needs more attention. Don't give up!";
        }
    };

    // Close assessment
    const closeAssessment = () => {
        setShowAssessment(false);
        setCurrentAssessment(null);
        setAssessmentAnswers({});
        setAssessmentResult(null);
    };

    return (
        <div className="skills-page">
            {/* Header */}
            <div className="skills-header">
                <h1>Skills Assessment</h1>
                <p>Assess your skills and track your learning progress</p>
            </div>

            {/* Tabs */}
            <div className="skills-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'my-skills' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-skills')}
                >
                    <FaChartBar /> My Skills
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'available-skills' ? 'active' : ''}`}
                    onClick={() => setActiveTab('available-skills')}
                >
                    <FaBook /> Available Skills
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {/* My Skills Tab */}
                {activeTab === 'my-skills' && (
                    <div className="my-skills">
                        <div className="skills-grid">
                            {userSkills.map(skill => (
                                <div key={skill.id} className="skill-card">
                                    <div className="skill-card-header">
                                        <h3>{skill.name}</h3>
                                        <div className="skill-actions">
                                            <button 
                                                className="icon-btn edit"
                                                onClick={() => startAssessment(skill.name)}
                                                title="Take Assessment"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="icon-btn delete"
                                                onClick={() => handleRemoveSkill(skill.id)}
                                                title="Remove Skill"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="skill-level">
                                        <div className="level-badge">
                                            {skill.level >= 70 ? 'Advanced' : skill.level >= 40 ? 'Intermediate' : 'Beginner'}
                                        </div>
                                        <span className="last-assessed">Last assessed: {skill.lastAssessed}</span>
                                    </div>

                                    <div className="progress-section">
                                        <div className="progress-header">
                                            <span>Proficiency Level</span>
                                            <span className="progress-percentage">{skill.level}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{ 
                                                    width: `${skill.level}%`,
                                                    backgroundColor: skill.level >= 70 ? '#10b981' : skill.level >= 40 ? '#f59e0b' : '#ef4444'
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <button 
                                        className="btn-assess"
                                        onClick={() => startAssessment(skill.name)}
                                    >
                                        Take Assessment
                                    </button>
                                </div>
                            ))}

                            {/* Add Skill Card */}
                            <div className="skill-card add-skill-card" onClick={() => setShowAddSkill(true)}>
                                <FaPlus className="add-icon" />
                                <h3>Add New Skill</h3>
                                <p>Start learning a new skill</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Skills Tab */}
                {activeTab === 'available-skills' && (
                    <div className="available-skills">
                        <div className="skills-categories">
                            {['All', 'Programming', 'Frontend', 'Backend', 'Database', 'Cloud', 'Security', 'Design', 'Data'].map(category => (
                                <button key={category} className="category-filter">
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="skills-grid">
                            {availableSkills.map(skill => (
                                <div key={skill.id} className="skill-card available">
                                    <div className="skill-icon">{skill.icon}</div>
                                    <h3>{skill.name}</h3>
                                    <span className="skill-category">{skill.category}</span>
                                    <div className="skill-details">
                                        <p>Level: {skill.level}</p>
                                        <p>Duration: {skill.duration}</p>
                                    </div>
                                    <button 
                                        className="btn-add-skill"
                                        onClick={() => handleAddSkill(skill)}
                                    >
                                        <FaPlus /> Add to My Skills
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Skill Modal */}
            {showAddSkill && (
                <div className="modal-overlay" onClick={() => setShowAddSkill(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Add New Skill</h2>
                        <p>Search and select skills you want to learn</p>
                        
                        <input 
                            type="text" 
                            placeholder="Search skills..." 
                            className="search-input"
                        />

                        <div className="skill-list">
                            {availableSkills.map(skill => (
                                <div key={skill.id} className="skill-list-item">
                                    <div className="skill-info">
                                        <span className="skill-icon-small">{skill.icon}</span>
                                        <div>
                                            <h4>{skill.name}</h4>
                                            <p>{skill.category}</p>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn-add"
                                        onClick={() => handleAddSkill(skill)}
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button className="btn-close" onClick={() => setShowAddSkill(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Assessment Modal */}
            {showAssessment && currentAssessment && (
                <div className="modal-overlay" onClick={closeAssessment}>
                    <div className="modal-content assessment-modal" onClick={e => e.stopPropagation()}>
                        {!assessmentResult ? (
                            <>
                                <div className="assessment-header">
                                    <h2>{currentAssessment} Assessment</h2>
                                    <p>Answer the following questions to assess your knowledge</p>
                                </div>

                                <div className="assessment-questions">
                                    {assessments[currentAssessment]?.map((q, index) => (
                                        <div key={q.id} className="question-card">
                                            <h3>Question {index + 1}:</h3>
                                            <p className="question-text">{q.question}</p>
                                            
                                            <div className="options">
                                                {q.options.map((option, optIndex) => (
                                                    <label key={optIndex} className="option-label">
                                                        <input
                                                            type="radio"
                                                            name={`q${q.id}`}
                                                            value={optIndex}
                                                            checked={assessmentAnswers[q.id] === optIndex}
                                                            onChange={() => handleAnswerSelect(q.id, optIndex)}
                                                        />
                                                        <span>{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="assessment-actions">
                                    <button className="btn-secondary" onClick={closeAssessment}>
                                        Cancel
                                    </button>
                                    <button 
                                        className="btn-primary"
                                        onClick={submitAssessment}
                                        disabled={Object.keys(assessmentAnswers).length !== assessments[currentAssessment]?.length}
                                    >
                                        Submit Assessment
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="assessment-result">
                                <div className="result-icon">
                                    {assessmentResult.score >= 60 ? <FaCheck /> : <FaChartBar />}
                                </div>
                                
                                <h2>Assessment Complete!</h2>
                                
                                <div className="score-display">
                                    <div className="score-circle">
                                        <span className="score-number">{assessmentResult.score}%</span>
                                    </div>
                                    <p className="score-details">
                                        You got {assessmentResult.correct} out of {assessmentResult.total} questions correct
                                    </p>
                                </div>

                                <div className="feedback-section">
                                    <h3>Feedback:</h3>
                                    <p>{assessmentResult.feedback}</p>
                                </div>

                                <div className="recommendations">
                                    <h3>Recommended Learning Path:</h3>
                                    <ul>
                                        {assessmentResult.score < 40 && (
                                            <>
                                                <li>Review the basics of {currentAssessment}</li>
                                                <li>Complete beginner tutorials</li>
                                                <li>Practice with simple exercises</li>
                                            </>
                                        )}
                                        {assessmentResult.score >= 40 && assessmentResult.score < 60 && (
                                            <>
                                                <li>Strengthen your fundamentals</li>
                                                <li>Work on intermediate projects</li>
                                                <li>Take more practice quizzes</li>
                                            </>
                                        )}
                                        {assessmentResult.score >= 60 && assessmentResult.score < 80 && (
                                            <>
                                                <li>Move on to advanced topics</li>
                                                <li>Build real-world projects</li>
                                                <li>Explore frameworks and libraries</li>
                                            </>
                                        )}
                                        {assessmentResult.score >= 80 && (
                                            <>
                                                <li>You're ready for advanced concepts!</li>
                                                <li>Consider contributing to open source</li>
                                                <li>Prepare for certification</li>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                <button className="btn-primary" onClick={closeAssessment}>
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillsPage;
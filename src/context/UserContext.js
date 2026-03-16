import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        education: '',
        age: '',
        careerGoal: '',
        profilePicture: null
    });

    const [skills, setSkills] = useState([]);
    const [schedule, setSchedule] = useState(null);
    const [progress, setProgress] = useState({});

    // Update profile
    const updateProfile = (profileData) => {
        setProfile(prev => ({ ...prev, ...profileData }));
    };

    // Add skills
    const addSkills = (newSkills) => {
        setSkills(newSkills);
    };

    // Update schedule
    const updateSchedule = (scheduleData) => {
        setSchedule(scheduleData);
    };

    // Update progress
    const updateProgress = (progressData) => {
        setProgress(prev => ({ ...prev, ...progressData }));
    };

    const value = {
        profile,
        skills,
        schedule,
        progress,
        updateProfile,
        addSkills,
        updateSchedule,
        updateProgress
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
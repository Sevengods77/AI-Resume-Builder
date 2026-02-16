import React, { createContext, useState, useContext } from 'react';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }) => {
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            github: ''
        },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: []
    });

    const updatePersonalInfo = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value
            }
        }));
    };

    const updateSection = (section, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: value
        }));
    };

    const loadSampleData = () => {
        setResumeData({
            personalInfo: {
                fullName: 'Alex Morgan',
                email: 'alex.morgan@example.com',
                phone: '(555) 123-4567',
                location: 'San Francisco, CA',
                website: 'alexmorgan.dev',
                linkedin: 'linkedin.com/in/alexmorgan',
                github: 'github.com/alexmorgan'
            },
            summary: 'Experienced Full Stack Developer with a passion for building scalable web applications and intuitive user interfaces. Proven track record of delivering high-quality code and leading development teams.',
            education: [
                {
                    id: 1,
                    institution: 'University of California, Berkeley',
                    degree: 'B.S. Computer Science',
                    year: '2018 - 2022'
                }
            ],
            experience: [
                {
                    id: 1,
                    company: 'TechFlow Solutions',
                    role: 'Senior Frontend Engineer',
                    duration: '2022 - Present',
                    description: 'Led the migration of legacy codebase to React 18. Improved site performance by 40% using code-splitting and lazy loading.'
                },
                {
                    id: 2,
                    company: 'Creative Digital',
                    role: 'Web Developer Intern',
                    duration: 'Summer 2021',
                    description: 'Collaborated with designers to implement responsive landing pages. Assisted in backend API integration using Node.js.'
                }
            ],
            projects: [
                {
                    id: 1,
                    name: 'E-commerce Dashboard',
                    description: 'A comprehensive analytics dashboard for online retailers. Built with React, D3.js, and Firebase.'
                },
                {
                    id: 2,
                    name: 'TaskMaster',
                    description: 'Productivity application with real-time collaboration features using Socket.io and MongoDB.'
                }
            ],
            skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'AWS', 'Docker', 'Git']
        });
    };

    return (
        <ResumeContext.Provider value={{ resumeData, updatePersonalInfo, updateSection, loadSampleData }}>
            {children}
        </ResumeContext.Provider>
    );
};

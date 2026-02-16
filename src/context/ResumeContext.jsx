import React, { createContext, useState, useContext } from 'react';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

export const ResumeProvider = ({ children }) => {
    // 1. Initialize from localStorage or default
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        const defaultData = {
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
        };
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    });

    const [atsScore, setAtsScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(() => {
        return localStorage.getItem('resumeBuilderTemplate') || 'modern';
    });

    // 2. Autosave & Calculate Score on change
    React.useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
        calculateScore(resumeData);
    }, [resumeData]);

    React.useEffect(() => {
        localStorage.setItem('resumeBuilderTemplate', selectedTemplate);
    }, [selectedTemplate]);

    const calculateScore = (data) => {
        let score = 0;
        const improvements = []; // Priority list

        // --- SCORING LOGIC (Stable from Phase 3) ---

        // Rule 1: Summary Length (40-120 words) (+15)
        const summaryWords = data.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (summaryWords >= 40 && summaryWords <= 120) score += 15;

        // Rule 2: Projects >= 2 (+10)
        if (data.projects.length >= 2) score += 10;

        // Rule 3: Experience >= 1 (+10)
        if (data.experience.length >= 1) score += 10;

        // Rule 4: Skills >= 8 (+10)
        if (data.skills.length >= 8) score += 10;

        // Rule 5: GitHub or LinkedIn (+10)
        if (data.personalInfo.linkedin || data.personalInfo.github) score += 10;

        // Rule 6: Metrics in bullets (+15)
        const hasNumbers = [
            ...data.experience.map(e => e.description),
            ...data.projects.map(p => p.description)
        ].some(text => /\d+|%|\$|k\b/i.test(text || ''));
        if (hasNumbers) score += 15;

        // Rule 7: Education Complete (+10)
        const eduComplete = data.education.length > 0 && data.education.every(e => e.institution && e.degree && e.year);
        if (eduComplete) score += 10;

        // Rule 8: Contact Info (+20) to cap at 100
        if (data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone) score += 20;

        setAtsScore(Math.min(100, score));


        // --- IMPROVEMENT LOGIC (Strict Priority) ---
        // 1. If <2 projects → suggest adding project.
        if (data.projects.length < 2) {
            improvements.push("Add at least 2 projects to showcase your skills.");
        }

        // 2. If no numbers → suggest measurable impact.
        if (!hasNumbers) {
            improvements.push("Add measurable impact (numbers, %, $) to your descriptions.");
        }

        // 3. If summary <40 words → suggest expanding.
        if (summaryWords < 40) {
            improvements.push("Expand your summary to at least 40 words.");
        }

        // 4. If skills <8 → suggest expanding.
        if (data.skills.length < 8) {
            improvements.push("Add more skills (target at least 8).");
        }

        // 5. If no experience → suggest adding internship/project work.
        if (data.experience.length === 0) {
            improvements.push("Add work experience or internships.");
        }

        // Cap at 3 suggestions
        setSuggestions(improvements.slice(0, 3));
    };

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
            summary: 'Experienced Full Stack Developer with a passion for building scalable web applications and intuitive user interfaces. Proven track record of delivering high-quality code and leading development teams. I have increased performance by 40% and reduced costs by $10k annually through efficient engineering practices.',
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
                    location: 'San Francisco, CA',
                    description: 'Led the migration of legacy codebase to React 18. Improved site performance by 40% using code-splitting and lazy loading. Managed a team of 4 engineers.'
                },
                {
                    id: 2,
                    company: 'Creative Digital',
                    role: 'Web Developer Intern',
                    duration: 'Summer 2021',
                    location: 'Remote',
                    description: 'Collaborated with designers to implement responsive landing pages. Assisted in backend API integration using Node.js.'
                }
            ],
            projects: [
                {
                    id: 1,
                    name: 'E-commerce Dashboard',
                    description: 'A comprehensive analytics dashboard for online retailers. Built with React, D3.js, and Firebase. Processed 10k+ transactions daily.'
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
        <ResumeContext.Provider value={{
            resumeData,
            atsScore,
            suggestions,
            selectedTemplate,
            setSelectedTemplate,
            updatePersonalInfo,
            updateSection,
            loadSampleData
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

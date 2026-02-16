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

    // Default Teal: hsl(168, 60%, 40%)
    const [selectedColor, setSelectedColor] = useState(() => {
        return localStorage.getItem('resumeBuilderColor') || 'hsl(168, 60%, 40%)';
    });

    // 2. Autosave & Calculate Score on change
    React.useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
        calculateScore(resumeData);
    }, [resumeData]);

    React.useEffect(() => {
        localStorage.setItem('resumeBuilderTemplate', selectedTemplate);
    }, [selectedTemplate]);

    React.useEffect(() => {
        localStorage.setItem('resumeBuilderColor', selectedColor);
    }, [selectedColor]);

    const calculateScore = (data) => {
        let score = 0;
        // Priority list moved to end of function

        // --- SCORING LOGIC (Stable from Phase 3) ---

        // Rule 1: Summary Length (40-120 words) (+15)
        const summaryWords = data.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (summaryWords >= 40 && summaryWords <= 120) score += 15;

        // Rule 2: Projects >= 2 (+10)
        if (data.projects.length >= 2) score += 10;

        // Rule 3: Experience >= 1 (+10)
        if (data.experience.length >= 1) score += 10;

        // Rule 4: Skills >= 8 (+10)
        const totalSkills = Array.isArray(data.skills)
            ? data.skills.length
            : (data.skills?.technical?.length || 0) + (data.skills?.soft?.length || 0) + (data.skills?.tools?.length || 0);

        if (totalSkills >= 8) score += 10;

        // Rule 5: GitHub or LinkedIn (+10)
        if (data.personalInfo.linkedin || data.personalInfo.github) score += 10;

        // Rule 6: Education Complete (+10)
        const eduComplete = data.education.length > 0 && data.education.every(e => e.institution && e.degree && e.year);
        if (eduComplete) score += 10;

        // Rule 7: Contact Info (+20) to cap at 100
        if (data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone) score += 20;

        setAtsScore(Math.min(100, score));

        // --- SUGGESTIONS LOGIC ---
        const improvements = [];

        // 1. Projects
        if (data.projects.length < 2) {
            improvements.push("Add at least 2 projects to showcase your skills.");
        }

        // 2. Metrics Check
        const hasNumbers = [
            ...data.experience.map(e => e.description),
            ...data.projects.map(p => p.description)
        ].some(text => /\d+|%|\$|k\b/i.test(text || ''));

        if (!hasNumbers) {
            improvements.push("Add measurable impact (numbers, %, $) to your descriptions.");
        }

        // 3. Summary Length
        if (summaryWords < 40) {
            improvements.push("Expand your summary to at least 40 words.");
        }

        // 4. Skills
        if (totalSkills < 8) {
            improvements.push("Add more skills (aim for 8+ total).");
        }

        // 5. Experience
        if (data.experience.length === 0) {
            improvements.push("Add work experience or internships.");
        }

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
                fullName: 'Alex Johnson',
                email: 'alex.j@example.com',
                phone: '+1 (555) 123-4567',
                location: 'San Francisco, CA',
                linkedin: 'linkedin.com/in/alexj',
                github: 'github.com/alexj',
                website: 'alexj.dev',
                role: 'Senior Full Stack Developer'
            },
            summary: 'Results-driven Full Stack Developer with 5+ years of experience in building scalable web applications. Expert in React and Node.js with a strong focus on code quality and performance optimization.',
            experience: [
                {
                    id: 1,
                    company: 'TechFlow Solutions',
                    role: 'Senior Developer',
                    duration: '2021 - Present',
                    location: 'San Francisco, CA',
                    description: '• Led a team of 5 engineers to rebuild the core legacy platform using React and Node.js, improving load times by 40%\n• implemented CI/CD pipelines reducing deployment time by 60%\n• Mentored junior developers and conducted code reviews'
                },
                {
                    id: 2,
                    company: 'StartUp Inc',
                    role: 'Frontend Developer',
                    duration: '2019 - 2021',
                    location: 'Remote',
                    description: '• Developed responsive UI components using React and Tailwind CSS\n• Collaborated with UX designers to implement pixel-perfect designs\n• Optimized application performance achieving a 98/100 Lighthouse score'
                }
            ],
            projects: [
                {
                    id: 1,
                    name: 'E-Commerce Dashboard',
                    description: 'Built a comprehensive analytics dashboard for e-commerce store owners to track sales and inventory in real-time.',
                    techStack: ['React', 'D3.js', 'Firebase'],
                    liveUrl: 'https://demo-dashboard.com',
                    githubUrl: 'https://github.com/alexj/dashboard'
                },
                {
                    id: 2,
                    name: 'Task Management API',
                    description: 'Designed and implemented a RESTful API for a collaborative task management tool supporting real-time updates.',
                    techStack: ['Node.js', 'Express', 'MongoDB', 'Socket.io'],
                    liveUrl: '',
                    githubUrl: 'https://github.com/alexj/task-api'
                }
            ],
            education: [
                {
                    id: 1,
                    institution: 'University of Technology',
                    degree: 'BS in Computer Science',
                    year: '2015 - 2019'
                }
            ],
            skills: {
                technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS'],
                soft: ['Leadership', 'Communication', 'Problem Solving'],
                tools: ['Git', 'Docker', 'Jira', 'Figma']
            }
        });
    };

    return (
        <ResumeContext.Provider value={{
            resumeData,
            atsScore,
            suggestions,
            selectedTemplate,
            setSelectedTemplate,
            selectedColor,
            setSelectedColor,
            updatePersonalInfo,
            updateSection,
            loadSampleData
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

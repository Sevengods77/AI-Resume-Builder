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
        const improvements = [];

        // Rule 1: Name provided (+10)
        if (data.personalInfo.fullName?.trim()) score += 10;
        else improvements.push("Add your full name (+10)");

        // Rule 2: Email provided (+10)
        if (data.personalInfo.email?.trim()) score += 10;
        else improvements.push("Add a professional email (+10)");

        // Rule 3: Summary > 50 chars (+10)
        if (data.summary?.length > 50) score += 10;
        else improvements.push("Expand summary to >50 characters (+10)");

        // Rule 4: Experience entry exists & has bullets/newlines (+15)
        const hasDetailedExp = data.experience.some(exp => exp.description?.includes('\n') || exp.description?.includes('•') || exp.description?.length > 20);
        if (hasDetailedExp) score += 15;
        else improvements.push("Add detailed status/bullets to experience (+15)");

        // Rule 5: Education entry exists (+10)
        if (data.education.length > 0) score += 10;
        else improvements.push("Add education details (+10)");

        // Rule 6: Skills count >= 5 (+10)
        const totalSkills = (data.skills?.technical?.length || 0) + (data.skills?.soft?.length || 0) + (data.skills?.tools?.length || 0);
        if (totalSkills >= 5) score += 10;
        else improvements.push(`Add ${5 - totalSkills} more skills (+10)`);

        // Rule 7: Project entry exists (+10)
        if (data.projects.length > 0) score += 10;
        else improvements.push("Add at least one project (+10)");

        // Rule 8: Phone provided (+5)
        if (data.personalInfo.phone?.trim()) score += 5;
        else improvements.push("Add phone number (+5)");

        // Rule 9: LinkedIn provided (+5)
        if (data.personalInfo.linkedin?.trim()) score += 5;
        else improvements.push("Add LinkedIn profile (+5)");

        // Rule 10: GitHub provided (+5)
        if (data.personalInfo.github?.trim()) score += 5;
        else improvements.push("Add GitHub profile (+5)");

        // Rule 11: Summary contains action verbs (+10)
        const actionVerbs = ['built', 'led', 'designed', 'developed', 'managed', 'created', 'improved', 'optimized', 'engineered', 'implemented'];
        const hasActionVerbs = actionVerbs.some(verb => data.summary?.toLowerCase().includes(verb));
        if (hasActionVerbs) score += 10;
        else improvements.push("Use action verbs (Built, Led, Designed) in summary (+10)");

        setAtsScore(Math.min(100, score));
        setSuggestions(improvements);
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

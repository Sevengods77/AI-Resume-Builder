import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import Button from '../../components/ui/Button';
import { Download, RotateCcw, Plus, Trash2, Globe, Github, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';

const FormSection = ({ title, children }) => (
    <div className="mb-8 border-b border-gray-100 pb-8 last:border-0">
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">{title}</h3>
        {children}
    </div>
);

const TagInput = ({ label, tags = [], onAdd, onRemove, placeholder }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.trim()) {
                onAdd(input.trim());
                setInput('');
            }
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label} <span className="text-gray-400 text-xs font-normal">({tags.length})</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[44px]">
                {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 shadow-sm">
                        {tag}
                        <button
                            type="button" // Prevent form submission
                            onClick={() => onRemove(i)}
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    className="bg-transparent outline-none flex-1 min-w-[120px] text-sm"
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};

// ... InputGroup component (same as before but ensuring no dups)
const InputGroup = ({ label, value, onChange, placeholder, type = "text", as = "input", guidance = false, formatBullets = false, maxLength }) => {
    // Bullet Guidance Logic
    const getGuidance = (text) => {
        if (!text || !guidance) return null;

        const issues = [];
        const lowerText = text.toLowerCase();

        // Check for action verbs
        const actionVerbs = ['built', 'developed', 'designed', 'implemented', 'led', 'improved', 'created', 'optimized', 'automated', 'managed', 'orchestrated', 'engineered'];
        const startsWithAction = actionVerbs.some(verb => lowerText.trim().startsWith(verb));

        if (!startsWithAction && text.length > 5) {
            issues.push("Start with a strong action verb (e.g., Built, Developed).");
        }

        // Check for numbers
        const hasNumbers = /\d+|%|\$|k\b/i.test(text);
        if (!hasNumbers && text.length > 20) {
            issues.push("Add measurable impact (numbers, %, $).");
        }

        return issues;
    };

    // Bullet Formatting Logic
    const toggleBullets = () => {
        if (!value) return;
        const lines = value.split('\n').filter(line => line.trim() !== '');
        const hasBullets = lines.every(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'));

        let newValue;
        if (hasBullets) {
            newValue = lines.map(line => line.trim().replace(/^[•\-\*]\s*/, '')).join('\n');
        } else {
            newValue = lines.map(line => line.trim().startsWith('•') ? line : `• ${line.trim()}`).join('\n');
        }
        onChange({ target: { value: newValue } });
    };

    const issues = getGuidance(value);
    const hasBullets = value && value.split('\n').some(line => line.trim().startsWith('•'));

    // Character Counter Logic
    const charCount = value ? value.length : 0;
    const isNearLimit = maxLength && charCount > maxLength * 0.9;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="flex items-center gap-2">
                    {maxLength && (
                        <span className={`text-xs ${isOverLimit ? 'text-red-500 font-bold' : isNearLimit ? 'text-amber-500' : 'text-gray-400'}`}>
                            {charCount}/{maxLength}
                        </span>
                    )}
                    {formatBullets && (
                        <button
                            type="button"
                            onClick={toggleBullets}
                            className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600 font-medium"
                            title={hasBullets ? "Remove bullet points" : "Add bullet points"}
                        >
                            {hasBullets ? '✓ Bullets' : '+ Bullets'}
                        </button>
                    )}
                </div>
            </div>
            {as === "textarea" ? (
                <textarea
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm min-h-[100px] ${isOverLimit ? 'border-red-300 ring-red-100' : 'border-gray-200'}`}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type={type}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            )}
            {guidance && issues && issues.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                    {issues.map((issue, i) => (
                        <span key={i} className="text-xs text-amber-600 flex items-center gap-1 font-medium">
                            <span className="w-1 h-1 rounded-full bg-amber-500 inline-block" /> {issue}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

const Builder = () => {
    const {
        resumeData,
        atsScore,
        suggestions,
        selectedTemplate,
        setSelectedTemplate,
        updatePersonalInfo,
        updateSection,
        loadSampleData
    } = useResume();

    // UI Local State for Suggest Button loading
    const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
    // UI State for collapsing projects (by ID)
    const [collapsedProjects, setCollapsedProjects] = useState({});

    // --- Helper Functions ---
    const addExperience = () => {
        updateSection('experience', [...resumeData.experience, { id: Date.now(), company: '', role: '', duration: '', location: '', description: '' }]);
    };

    const addProject = () => {
        updateSection('projects', [...resumeData.projects, { id: Date.now(), name: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }]);
    };

    const addEducation = () => {
        updateSection('education', [...resumeData.education, { id: Date.now(), institution: '', degree: '', year: '' }]);
    };

    const removeExperience = (index) => {
        const newExp = [...resumeData.experience];
        newExp.splice(index, 1);
        updateSection('experience', newExp);
    };

    const removeProject = (index) => {
        const newProj = [...resumeData.projects];
        newProj.splice(index, 1);
        updateSection('projects', newProj);
    };

    const removeEducation = (index) => {
        const newEdu = [...resumeData.education];
        newEdu.splice(index, 1);
        updateSection('education', newEdu);
    };

    const toggleProjectCollapse = (id) => {
        setCollapsedProjects(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // --- Skills Helpers ---
    const handleAddSkill = (category, skill) => {
        const currentSkills = resumeData.skills && resumeData.skills[category] ? resumeData.skills[category] : [];
        if (!currentSkills.includes(skill)) {
            updateSection('skills', {
                ...resumeData.skills,
                [category]: [...currentSkills, skill]
            });
        }
    };

    const handleRemoveSkill = (category, index) => {
        const currentSkills = [...resumeData.skills[category]];
        currentSkills.splice(index, 1);
        updateSection('skills', {
            ...resumeData.skills,
            [category]: currentSkills
        });
    };

    const suggestSkills = () => {
        setIsSuggestingSkills(true);
        setTimeout(() => {
            const suggestions = {
                technical: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
                soft: ["Team Leadership", "Problem Solving"],
                tools: ["Git", "Docker", "AWS"]
            };

            // Merge suggestions ensuring no duplicates
            const newSkills = { ...resumeData.skills };

            // Initialize if undefined
            if (!newSkills.technical) newSkills.technical = [];
            if (!newSkills.soft) newSkills.soft = [];
            if (!newSkills.tools) newSkills.tools = [];

            suggestions.technical.forEach(s => { if (!newSkills.technical.includes(s)) newSkills.technical.push(s); });
            suggestions.soft.forEach(s => { if (!newSkills.soft.includes(s)) newSkills.soft.push(s); });
            suggestions.tools.forEach(s => { if (!newSkills.tools.includes(s)) newSkills.tools.push(s); });

            updateSection('skills', newSkills);
            setIsSuggestingSkills(false);
        }, 1000);
    };

    // --- Projects Tech Stack Helper ---
    const handleAddProjectTag = (index, tag) => {
        const newProj = [...resumeData.projects];
        if (!newProj[index].techStack) newProj[index].techStack = []; // Safety check
        newProj[index].techStack.push(tag);
        updateSection('projects', newProj);
    };

    const handleRemoveProjectTag = (projIndex, tagIndex) => {
        const newProj = [...resumeData.projects];
        newProj[projIndex].techStack.splice(tagIndex, 1);
        updateSection('projects', newProj);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Left: Editor Panel */}
            <div className="w-1/2 overflow-y-auto border-r border-gray-100 bg-white">
                <div className="p-8 max-w-2xl mx-auto">

                    {/* Template Selector */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Select Template</label>
                        <div className="flex gap-2">
                            {['classic', 'modern', 'minimal'].map((template) => (
                                <button
                                    key={template}
                                    onClick={() => setSelectedTemplate(template)}
                                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all capitalize border ${selectedTemplate === template
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    {template}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ATS Score Panel */}
                    <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-end mb-2 relative z-10">
                            <div>
                                <h3 className="text-lg font-bold font-heading text-gray-900">ATS Readiness Score</h3>
                                <p className="text-sm text-gray-500">Optimize your resume for applicant tracking systems.</p>
                            </div>
                            <span className={`text-3xl font-bold font-heading ${atsScore >= 80 ? 'text-green-600' : atsScore >= 50 ? 'text-amber-500' : 'text-red-500'
                                }`}>
                                {atsScore}/100
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-4 relative z-10">
                            <div
                                className={`h-full transition-all duration-1000 ease-out ${atsScore >= 80 ? 'bg-green-500' : atsScore >= 50 ? 'bg-amber-400' : 'bg-red-400'
                                    }`}
                                style={{ width: `${atsScore}%` }}
                            />
                        </div>

                        {/* Top 3 Improvements */}
                        {suggestions.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200 relative z-10">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Top 3 Improvements</h4>
                                <ul className="space-y-2">
                                    {suggestions.map((s, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                            <span className="text-amber-500 mt-0.5">•</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold font-heading">Editor</h2>
                        <Button variant="secondary" onClick={loadSampleData} className="text-sm">
                            <RotateCcw size={14} className="mr-2" /> Load Sample Data
                        </Button>
                    </div>

                    <FormSection title="Personal Information">
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup
                                label="Full Name"
                                value={resumeData.personalInfo.fullName}
                                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                                placeholder="Jane Doe"
                            />
                            <InputGroup
                                label="Job Title"
                                value={resumeData.personalInfo.role || ''}
                                onChange={(e) => updatePersonalInfo('role', e.target.value)}
                                placeholder="Software Engineer"
                            />
                            <InputGroup
                                label="Email"
                                value={resumeData.personalInfo.email}
                                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                placeholder="jane@example.com"
                            />
                            <InputGroup
                                label="Phone"
                                value={resumeData.personalInfo.phone}
                                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                placeholder="+1 (555) 000-0000"
                            />
                            <InputGroup
                                label="Location"
                                value={resumeData.personalInfo.location}
                                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                placeholder="New York, NY"
                            />
                            <InputGroup
                                label="LinkedIn"
                                value={resumeData.personalInfo.linkedin}
                                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                                placeholder="linkedin.com/in/jane"
                            />
                            <InputGroup
                                label="GitHub"
                                value={resumeData.personalInfo.github}
                                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                                placeholder="github.com/jane"
                            />
                            <InputGroup
                                label="Website"
                                value={resumeData.personalInfo.website}
                                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                                placeholder="janedoe.com"
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Professional Summary">
                        <InputGroup
                            label="Summary"
                            as="textarea"
                            value={resumeData.summary}
                            onChange={(e) => updateSection('summary', e.target.value)}
                            placeholder="Write a compelling summary of your experience..."
                        />
                    </FormSection>

                    <FormSection title="Experience">
                        {resumeData.experience.map((exp, index) => (
                            <div key={exp.id || index} className="mb-6 p-4 border border-gray-200 rounded bg-gray-50 relative group">
                                <button
                                    onClick={() => removeExperience(index)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <InputGroup
                                        label="Company"
                                        value={exp.company}
                                        onChange={(e) => {
                                            const newExp = [...resumeData.experience];
                                            newExp[index].company = e.target.value;
                                            updateSection('experience', newExp);
                                        }}
                                    />
                                    <InputGroup
                                        label="Role"
                                        value={exp.role}
                                        onChange={(e) => {
                                            const newExp = [...resumeData.experience];
                                            newExp[index].role = e.target.value;
                                            updateSection('experience', newExp);
                                        }}
                                    />
                                    <InputGroup
                                        label="Duration"
                                        value={exp.duration}
                                        onChange={(e) => {
                                            const newExp = [...resumeData.experience];
                                            newExp[index].duration = e.target.value;
                                            updateSection('experience', newExp);
                                        }}
                                    />
                                    <InputGroup
                                        label="Location"
                                        value={exp.location}
                                        onChange={(e) => {
                                            const newExp = [...resumeData.experience];
                                            newExp[index].location = e.target.value;
                                            updateSection('experience', newExp);
                                        }}
                                    />
                                </div>
                                <InputGroup
                                    label="Description"
                                    as="textarea"
                                    guidance={true}
                                    formatBullets={true}
                                    value={exp.description}
                                    onChange={(e) => {
                                        const newExp = [...resumeData.experience];
                                        newExp[index].description = e.target.value;
                                        updateSection('experience', newExp);
                                    }}
                                    placeholder="Write each achievement on a new line, then click '+ Bullets' to format\nExample:\nBuilt feature X that improved performance by 50%\nLed team of 5 engineers on migration project"
                                />
                            </div>
                        ))}
                        <Button variant="secondary" onClick={addExperience} className="w-full justify-center border-dashed">
                            <Plus size={14} className="mr-2" /> Add Experience
                        </Button>
                    </FormSection>

                    <FormSection title="Projects">
                        <div className="space-y-4">
                            {resumeData.projects.map((proj, index) => (
                                <div key={proj.id || index} className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    {/* Header / Click to Collapse */}
                                    <div
                                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => toggleProjectCollapse(proj.id)}
                                    >
                                        <h4 className="font-bold text-gray-800">{proj.name || `Project #${index + 1}`}</h4>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeProject(index); }}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            {collapsedProjects[proj.id] ? <ChevronDown size={18} className="text-gray-500" /> : <ChevronUp size={18} className="text-gray-500" />}
                                        </div>
                                    </div>

                                    {/* Collapsible Content */}
                                    {!collapsedProjects[proj.id] && (
                                        <div className="p-4 pt-0 border-t border-gray-100">
                                            <div className="mb-4 mt-4">
                                                <InputGroup
                                                    label="Project Name"
                                                    value={proj.name}
                                                    onChange={(e) => {
                                                        const newProj = [...resumeData.projects];
                                                        newProj[index].name = e.target.value;
                                                        updateSection('projects', newProj);
                                                    }}
                                                    placeholder="E-Commerce Dashboard"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <InputGroup
                                                    label="Live URL (Optional)"
                                                    value={proj.liveUrl || ''}
                                                    onChange={(e) => {
                                                        const newProj = [...resumeData.projects];
                                                        newProj[index].liveUrl = e.target.value;
                                                        updateSection('projects', newProj);
                                                    }}
                                                    placeholder="https://myapp.com"
                                                />
                                                <InputGroup
                                                    label="GitHub URL (Optional)"
                                                    value={proj.githubUrl || ''}
                                                    onChange={(e) => {
                                                        const newProj = [...resumeData.projects];
                                                        newProj[index].githubUrl = e.target.value;
                                                        updateSection('projects', newProj);
                                                    }}
                                                    placeholder="https://github.com/me/repo"
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <TagInput
                                                    label="Tech Stack"
                                                    tags={proj.techStack || []}
                                                    onAdd={(tag) => handleAddProjectTag(index, tag)}
                                                    onRemove={(tagIndex) => handleRemoveProjectTag(index, tagIndex)}
                                                    placeholder="Type tech (e.g., React) & Enter"
                                                />
                                            </div>

                                            <InputGroup
                                                label="Description"
                                                as="textarea"
                                                guidance={true}
                                                formatBullets={true}
                                                maxLength={200}
                                                value={proj.description}
                                                onChange={(e) => {
                                                    const newProj = [...resumeData.projects];
                                                    newProj[index].description = e.target.value;
                                                    updateSection('projects', newProj);
                                                }}
                                                placeholder="Briefly describe what you built..."
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button variant="secondary" onClick={addProject} className="w-full justify-center border-dashed mt-4">
                            <Plus size={14} className="mr-2" /> Add Project
                        </Button>
                    </FormSection>

                    <FormSection title="Skills">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-500">Categorize your skills for better impact.</p>
                            <Button
                                variant="secondary"
                                onClick={suggestSkills}
                                disabled={isSuggestingSkills}
                                className="text-xs"
                            >
                                {isSuggestingSkills ? (
                                    <>Loading...</>
                                ) : (
                                    <><Sparkles size={12} className="mr-1" /> Suggest Skills</>
                                )}
                            </Button>
                        </div>

                        <TagInput
                            label="Technical Skills"
                            tags={resumeData.skills?.technical || []}
                            onAdd={(tag) => handleAddSkill('technical', tag)}
                            onRemove={(i) => handleRemoveSkill('technical', i)}
                            placeholder="Type skill & press Enter (e.g. React)"
                        />

                        <TagInput
                            label="Soft Skills"
                            tags={resumeData.skills?.soft || []}
                            onAdd={(tag) => handleAddSkill('soft', tag)}
                            onRemove={(i) => handleRemoveSkill('soft', i)}
                            placeholder="Type skill & press Enter (e.g. Leadership)"
                        />

                        <TagInput
                            label="Tools & Technologies"
                            tags={resumeData.skills?.tools || []}
                            onAdd={(tag) => handleAddSkill('tools', tag)}
                            onRemove={(i) => handleRemoveSkill('tools', i)}
                            placeholder="Type tool & press Enter (e.g. Docker)"
                        />
                    </FormSection>

                    <FormSection title="Education">
                        {resumeData.education.map((edu, index) => (
                            <div key={edu.id || index} className="mb-6 p-4 border border-gray-200 rounded bg-gray-50 relative group">
                                <button
                                    onClick={() => removeEducation(index)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup
                                        label="Institution"
                                        value={edu.institution}
                                        onChange={(e) => {
                                            const newEdu = [...resumeData.education];
                                            newEdu[index].institution = e.target.value;
                                            updateSection('education', newEdu);
                                        }}
                                    />
                                    <InputGroup
                                        label="Year"
                                        value={edu.year}
                                        onChange={(e) => {
                                            const newEdu = [...resumeData.education];
                                            newEdu[index].year = e.target.value;
                                            updateSection('education', newEdu);
                                        }}
                                    />
                                </div>
                                <div className="mt-2">
                                    <InputGroup
                                        label="Degree"
                                        value={edu.degree}
                                        onChange={(e) => {
                                            const newEdu = [...resumeData.education];
                                            newEdu[index].degree = e.target.value;
                                            updateSection('education', newEdu);
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button variant="secondary" onClick={addEducation} className="w-full justify-center border-dashed">
                            <Plus size={14} className="mr-2" /> Add Education
                        </Button>
                    </FormSection>
                </div>
            </div>

            {/* Right: Live Preview */}
            <div className="w-1/2 bg-gray-100 p-8 overflow-y-auto flex justify-center">
                <div className={`shadow-2xl w-[210mm] min-h-[297mm] p-[15mm] text-gray-900 bg-white
                                ${selectedTemplate === 'classic' ? 'font-serif' : ''}
                                ${selectedTemplate === 'minimal' ? 'font-mono' : ''}
                                `}>
                    {/* Header */}
                    <header className={`pb-6 mb-6 ${selectedTemplate === 'classic' ? 'border-b-2 border-black text-center' : ''} ${selectedTemplate === 'modern' ? 'border-b-2 border-gray-900' : ''} ${selectedTemplate === 'minimal' ? 'pb-4 mb-4' : ''}`}>
                        <h1 className={`text-4xl font-bold font-serif text-gray-900 mb-2 uppercase tracking-wide ${selectedTemplate === 'minimal' ? 'text-2xl lowercase tracking-tight font-sans' : ''} ${selectedTemplate === 'classic' ? 'font-serif' : 'font-heading'}`}>
                            {resumeData.personalInfo.fullName || "Your Name"}
                        </h1>
                        <div className={`text-sm text-gray-600 flex flex-wrap gap-3 ${selectedTemplate === 'classic' ? 'justify-center' : ''}`}>
                            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                            {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                            {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                            {resumeData.personalInfo.linkedin && <span>• <a href={`https://${resumeData.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.personalInfo.linkedin.replace(/^https?:\/\//, '')}</a></span>}
                            {resumeData.personalInfo.github && <span>• <a href={`https://${resumeData.personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.personalInfo.github.replace(/^https?:\/\//, '')}</a></span>}
                            {resumeData.personalInfo.website && <span>• <a href={`https://${resumeData.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.personalInfo.website.replace(/^https?:\/\//, '')}</a></span>}
                        </div>
                    </header>

                    {/* Summary */}
                    {resumeData.summary && (
                        <section className="mb-6">
                            <h2 className={`text-sm font-bold uppercase tracking-widest text-gray-500 mb-2 ${selectedTemplate === 'classic' ? 'text-center border-b border-gray-200 pb-1 text-black' : ''}  ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}>Summary</h2>
                            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{resumeData.summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                        <section className="mb-6">
                            <h2 className={`text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 ${selectedTemplate === 'classic' ? 'text-center border-b border-gray-200 pb-1 text-black' : ''} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}>Experience</h2>
                            <div className="space-y-4">
                                {resumeData.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-900">{exp.company}</h3>
                                            <span className="text-xs text-gray-500 font-medium">{exp.duration}</span>
                                        </div>
                                        <div className="text-sm text-gray-700 italic mb-2">{exp.role}</div>
                                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects - Simplified Preview for now, will call tool to update Preview.jsx next */}
                    {resumeData.projects.length > 0 && (
                        <section className="mb-6">
                            <h2 className={`text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 ${selectedTemplate === 'classic' ? 'text-center border-b border-gray-200 pb-1 text-black' : ''} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}>Projects</h2>
                            <div className="space-y-4">
                                {resumeData.projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-gray-900 mb-1">{proj.name}</h3>
                                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                        <section className="mb-6">
                            <h2 className={`text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 ${selectedTemplate === 'classic' ? 'text-center border-b border-gray-200 pb-1 text-black' : ''} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}>Education</h2>
                            {resumeData.education.map((edu, i) => (
                                <div key={i} className="mb-2">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                                        <span className="text-xs text-gray-500 font-medium">{edu.year}</span>
                                    </div>
                                    <div className="text-sm text-gray-700">{edu.degree}</div>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Skills */}
                    {resumeData.skills && (resumeData.skills.technical?.length > 0 || resumeData.skills.soft?.length > 0 || resumeData.skills.tools?.length > 0) && (
                        <section>
                            <h2 className={`text-sm font-bold uppercase tracking-widest text-gray-500 mb-2 ${selectedTemplate === 'classic' ? 'text-center border-b border-gray-200 pb-1 text-black' : ''} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}>Skills</h2>
                            <div className="text-sm text-gray-800 leading-relaxed">
                                {resumeData.skills.technical?.length > 0 && (
                                    <div className="mb-1">
                                        <span className="font-bold mr-2">Technical:</span>
                                        {resumeData.skills.technical.join(', ')}
                                    </div>
                                )}
                                {resumeData.skills.soft?.length > 0 && (
                                    <div className="mb-1">
                                        <span className="font-bold mr-2">Soft Skills:</span>
                                        {resumeData.skills.soft.join(', ')}
                                    </div>
                                )}
                                {resumeData.skills.tools?.length > 0 && (
                                    <div className="mb-1">
                                        <span className="font-bold mr-2">Tools:</span>
                                        {resumeData.skills.tools.join(', ')}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Builder;

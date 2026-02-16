import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import Button from '../../components/ui/Button';
import { Download, RotateCcw, Plus, Trash2, Globe, Github, Sparkles, X, ChevronDown, ChevronUp, Check } from 'lucide-react';

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
        selectedColor,
        setSelectedColor,
        updatePersonalInfo,
        updateSection,
        loadSampleData
    } = useResume();

    // Debug logging
    React.useEffect(() => {
        console.log('Builder: selectedColor updated to:', selectedColor);
    }, [selectedColor]);

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
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Select Template</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'classic', label: 'Classic' },
                                { id: 'modern', label: 'Modern' },
                                { id: 'minimal', label: 'Minimal' }
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setSelectedTemplate(t.id)}
                                    className={`relative group rounded-lg border-2 overflow-hidden transition-all ${selectedTemplate === t.id
                                        ? 'border-blue-600 ring-2 ring-blue-100'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    {/* Mini Preview Placeholder */}
                                    <div className="h-24 bg-gray-50 relative">
                                        {/* Abstract Layout Sketch */}
                                        {t.id === 'classic' && (
                                            <div className="p-2 space-y-1 opacity-50">
                                                <div className="h-2 w-16 bg-gray-400 mx-auto rounded"></div>
                                                <div className="h-0.5 w-full bg-gray-300 rounded"></div>
                                                <div className="h-1 w-full bg-gray-200 rounded"></div>
                                                <div className="h-1 w-20 bg-gray-200 rounded"></div>
                                            </div>
                                        )}
                                        {t.id === 'modern' && (
                                            <div className="flex h-full">
                                                <div className="w-[30%] bg-gray-200 h-full"></div>
                                                <div className="w-[70%] p-2 space-y-1 opacity-50">
                                                    <div className="h-2 w-16 bg-gray-400 rounded"></div>
                                                    <div className="h-1 w-full bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                        )}
                                        {t.id === 'minimal' && (
                                            <div className="p-2 space-y-2 opacity-50 text-left">
                                                <div className="h-3 w-12 bg-gray-800 rounded"></div>
                                                <div className="h-1 w-full bg-gray-200 rounded"></div>
                                                <div className="h-1 w-16 bg-gray-200 rounded"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="py-2 text-xs font-semibold text-center bg-white border-t border-gray-100">
                                        {t.label}
                                    </div>
                                    {selectedTemplate === t.id && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Check size={10} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Theme Picker */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Color Theme</label>
                        <div className="flex gap-4">
                            {[
                                { name: 'Teal', value: 'hsl(168, 60%, 40%)' },
                                { name: 'Navy', value: 'hsl(220, 60%, 35%)' },
                                { name: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
                                { name: 'Forest', value: 'hsl(150, 50%, 30%)' },
                                { name: 'Charcoal', value: 'hsl(0, 0%, 25%)' }
                            ].map((color) => (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => {
                                        console.log('Setting color to:', color.value);
                                        setSelectedColor(color.value);
                                    }}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none ${selectedColor === color.value
                                        ? 'border-gray-900 scale-110 shadow-sm'
                                        : 'border-white shadow-sm'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                >
                                    {selectedColor === color.value && (
                                        <Check size={14} className="text-white mx-auto" />
                                    )}
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
                <div className={`shadow-2xl w-[210mm] min-h-[297mm] text-gray-900 bg-white overflow-hidden
                                ${selectedTemplate === 'classic' ? 'font-serif p-[15mm]' : ''}
                                ${selectedTemplate === 'minimal' ? 'font-mono p-[15mm]' : ''}
                                ${selectedTemplate === 'modern' ? 'font-sans' : ''}
                                `}>

                    {/* MODERN LAYOUT */}
                    {selectedTemplate === 'modern' && (
                        <div className="flex min-h-[297mm]">
                            {/* Sidebar */}
                            <div className="w-[32%] p-8 text-white" style={{ backgroundColor: selectedColor }}>
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold font-heading mb-2 leading-tight">
                                        {resumeData.personalInfo.fullName || "Your Name"}
                                    </h1>
                                    <p className="text-white/80 text-sm font-medium">{resumeData.personalInfo.role}</p>
                                </div>

                                <div className="space-y-6 text-sm">
                                    <section>
                                        <h3 className="font-bold uppercase tracking-wider mb-3 text-white/70 border-b border-white/20 pb-1 text-xs">Contact</h3>
                                        <div className="space-y-2 text-white/90">
                                            <div className="break-all">{resumeData.personalInfo.email}</div>
                                            <div>{resumeData.personalInfo.phone}</div>
                                            <div>{resumeData.personalInfo.location}</div>
                                            {resumeData.personalInfo.linkedin && <div className="break-all text-xs opacity-90">{resumeData.personalInfo.linkedin.replace(/^https?:\/\//, '')}</div>}
                                            {resumeData.personalInfo.github && <div className="break-all text-xs opacity-90">{resumeData.personalInfo.github.replace(/^https?:\/\//, '')}</div>}
                                            {resumeData.personalInfo.website && <div className="break-all text-xs opacity-90">{resumeData.personalInfo.website.replace(/^https?:\/\//, '')}</div>}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="font-bold uppercase tracking-wider mb-3 text-white/70 border-b border-white/20 pb-1 text-xs">Skills</h3>
                                        {['Technical', 'Soft', 'Tools'].map(category => {
                                            const key = category.toLowerCase() === 'soft' ? 'soft' : category.toLowerCase();
                                            const skills = resumeData.skills?.[key];
                                            if (!skills?.length) return null;
                                            return (
                                                <div key={key} className="mb-3">
                                                    <span className="font-bold text-sm block mb-1 text-white/90">{category}</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {skills.map((s, i) => (
                                                            <span key={i} className="text-xs px-2 py-1 rounded bg-white/20 text-white">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </section>

                                    {resumeData.education.length > 0 && (
                                        <section>
                                            <h3 className="font-bold uppercase tracking-wider mb-3 text-white/70 border-b border-white/20 pb-1 text-xs">Education</h3>
                                            {resumeData.education.map((edu, i) => (
                                                <div key={i} className="mb-3">
                                                    <div className="font-bold text-white">{edu.institution}</div>
                                                    <div className="text-xs text-white/80">{edu.degree}</div>
                                                    <div className="text-xs text-white/60">{edu.year}</div>
                                                </div>
                                            ))}
                                        </section>
                                    )}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="w-[68%] p-8">
                                {resumeData.summary && (
                                    <section className="mb-8">
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-100 pb-1" style={{ color: selectedColor }}>Profile</h2>
                                        <p className="text-gray-800 text-sm leading-relaxed">{resumeData.summary}</p>
                                    </section>
                                )}

                                {resumeData.experience.length > 0 && (
                                    <section className="mb-8">
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-100 pb-1" style={{ color: selectedColor }}>Experience</h2>
                                        <div className="space-y-5">
                                            {resumeData.experience.map((exp, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className="font-bold text-gray-900 text-base">{exp.role}</h3>
                                                        <span className="text-xs text-gray-500 font-medium">{exp.duration}</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700 mb-2">{exp.company} | {exp.location}</div>
                                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {resumeData.projects.length > 0 && (
                                    <section>
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-100 pb-1" style={{ color: selectedColor }}>Projects</h2>
                                        <div className="space-y-5">
                                            {resumeData.projects.map((proj, i) => (
                                                <div key={i}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                                        <div className="flex gap-2">
                                                            {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer"><Globe size={12} className="text-gray-400 hover:text-gray-900" /></a>}
                                                            {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer"><Github size={12} className="text-gray-400 hover:text-gray-900" /></a>}
                                                        </div>
                                                    </div>
                                                    {proj.techStack && (
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {proj.techStack.map((t, k) => (
                                                                <span key={k} className="text-[10px] px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-gray-500">{t}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CLASSIC & MINIMAL LAYOUTS */}
                    {selectedTemplate !== 'modern' && (
                        <>
                            {/* Header */}
                            <header className={`pb-6 mb-6 ${selectedTemplate === 'classic' ? 'border-b-2 text-center' : ''} ${selectedTemplate === 'minimal' ? 'pb-4 mb-4' : ''}`}
                                style={{ borderColor: selectedTemplate === 'classic' ? selectedColor : 'transparent' }}>
                                <h1 className={`text-4xl font-bold font-serif text-gray-900 mb-2 uppercase tracking-wide ${selectedTemplate === 'minimal' ? 'text-2xl lowercase tracking-tight font-sans' : ''} ${selectedTemplate === 'classic' ? 'font-serif' : 'font-heading'}`}
                                    style={{ color: selectedTemplate === 'minimal' ? selectedColor : 'inherit' }}>
                                    {resumeData.personalInfo.fullName || "Your Name"}
                                </h1>
                                <div className={`text-sm text-gray-600 flex flex-wrap gap-3 ${selectedTemplate === 'classic' ? 'justify-center' : ''}`}>
                                    {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                                    {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                                    {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                                    {resumeData.personalInfo.linkedin && <span>• {resumeData.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>}
                                </div>
                            </header>

                            {/* Summary */}
                            {resumeData.summary && (
                                <section className="mb-6">
                                    <h2 className={`text-sm font-bold uppercase tracking-widest mb-2 ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'}  ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}
                                        style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
                                        Summary
                                    </h2>
                                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{resumeData.summary}</p>
                                </section>
                            )}

                            {/* Experience */}
                            {resumeData.experience.length > 0 && (
                                <section className="mb-6">
                                    <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}
                                        style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
                                        Experience
                                    </h2>
                                    <div className="space-y-4">
                                        {resumeData.experience.map((exp, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-bold text-gray-900">{exp.company}</h3>
                                                    <span className="text-xs text-gray-500 font-medium">{exp.duration}</span>
                                                </div>
                                                <div className="text-sm italic mb-2" style={{ color: selectedColor }}>{exp.role}</div>
                                                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Projects */}
                            {resumeData.projects.length > 0 && (
                                <section className="mb-6">
                                    <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}
                                        style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
                                        Projects
                                    </h2>
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
                                    <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}
                                        style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
                                        Education
                                    </h2>
                                    {resumeData.education.map((edu, i) => (
                                        <div key={i} className="mb-2">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                                                <span className="text-xs text-gray-500 font-medium">{edu.year}</span>
                                            </div>
                                            <div className="text-sm" style={{ color: selectedColor }}>{edu.degree}</div>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Skills */}
                            {resumeData.skills && (resumeData.skills.technical?.length > 0 || resumeData.skills.soft?.length > 0 || resumeData.skills.tools?.length > 0) && (
                                <section>
                                    <h2 className={`text-sm font-bold uppercase tracking-widest mb-2 ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}
                                        style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
                                        Skills
                                    </h2>
                                    <div className="text-sm text-gray-800 leading-relaxed">
                                        {['Technical', 'Soft', 'Tools'].map(category => {
                                            const key = category.toLowerCase() === 'soft' ? 'soft' : category.toLowerCase();
                                            const skills = resumeData.skills?.[key];
                                            if (!skills?.length) return null;
                                            return (
                                                <div key={key} className="mb-1">
                                                    <span className="font-bold mr-2">{category}:</span>
                                                    {skills.join(', ')}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Builder;

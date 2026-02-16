import React from 'react';
import { useResume } from '../../context/ResumeContext';
import Button from '../../components/ui/Button';
import { Download, RotateCcw, Plus, Trash2 } from 'lucide-react';

const FormSection = ({ title, children }) => (
    <div className="mb-8 border-b border-gray-100 pb-8 last:border-0">
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-4">{title}</h3>
        {children}
    </div>
);

const InputGroup = ({ label, value, onChange, placeholder, type = "text", as = "input" }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {as === "textarea" ? (
            <textarea
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm min-h-[100px]"
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
    </div>
);

const Builder = () => {
    const { resumeData, atsScore, suggestions, updatePersonalInfo, updateSection, loadSampleData } = useResume();

    // Helper to add empty items
    const addExperience = () => {
        updateSection('experience', [...resumeData.experience, { id: Date.now(), company: '', role: '', duration: '', description: '' }]);
    };

    const addProject = () => {
        updateSection('projects', [...resumeData.projects, { id: Date.now(), name: '', description: '' }]);
    };

    const addEducation = () => {
        updateSection('education', [...resumeData.education, { id: Date.now(), institution: '', degree: '', year: '' }]);
    };

    // Helper to remove items - simple implementation for now
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

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Left: Editor Panel */}
            <div className="w-1/2 overflow-y-auto border-r border-gray-100 bg-white">
                <div className="p-8 max-w-2xl mx-auto">

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

                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="bg-white p-4 rounded-lg border border-gray-200 relative z-10">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Suggestions</h4>
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
                                    value={exp.description}
                                    onChange={(e) => {
                                        const newExp = [...resumeData.experience];
                                        newExp[index].description = e.target.value;
                                        updateSection('experience', newExp);
                                    }}
                                />
                            </div>
                        ))}
                        <Button variant="secondary" onClick={addExperience} className="w-full justify-center border-dashed">
                            <Plus size={14} className="mr-2" /> Add Experience
                        </Button>
                    </FormSection>

                    <FormSection title="Projects">
                        {resumeData.projects.map((proj, index) => (
                            <div key={proj.id || index} className="mb-6 p-4 border border-gray-200 rounded bg-gray-50 relative group">
                                <button
                                    onClick={() => removeProject(index)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div className="mb-2">
                                    <InputGroup
                                        label="Project Name"
                                        value={proj.name}
                                        onChange={(e) => {
                                            const newProj = [...resumeData.projects];
                                            newProj[index].name = e.target.value;
                                            updateSection('projects', newProj);
                                        }}
                                    />
                                </div>
                                <InputGroup
                                    label="Description"
                                    as="textarea"
                                    value={proj.description}
                                    onChange={(e) => {
                                        const newProj = [...resumeData.projects];
                                        newProj[index].description = e.target.value;
                                        updateSection('projects', newProj);
                                    }}
                                />
                            </div>
                        ))}
                        <Button variant="secondary" onClick={addProject} className="w-full justify-center border-dashed">
                            <Plus size={14} className="mr-2" /> Add Project
                        </Button>
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

                    <FormSection title="Skills">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Comma separated)</label>
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-sm min-h-[80px]"
                                value={resumeData.skills.join(', ')}
                                onChange={(e) => updateSection('skills', e.target.value.split(',').map(s => s.trim()))}
                                placeholder="React, Node.js, Python, Leadership..."
                            />
                        </div>
                    </FormSection>
                </div>
            </div>

            {/* Right: Live Preview */}
            <div className="w-1/2 bg-gray-100 p-8 overflow-y-auto flex justify-center">
                <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[15mm] text-gray-900">
                    {/* Resume Header */}
                    <header className="border-b-2 border-gray-900 pb-6 mb-6">
                        <h1 className="text-4xl font-bold font-serif text-gray-900 mb-2 uppercase tracking-wide">
                            {resumeData.personalInfo.fullName || "Your Name"}
                        </h1>
                        <div className="text-sm text-gray-600 flex flex-wrap gap-3">
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
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Summary</h2>
                            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{resumeData.summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Experience</h2>
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

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Projects</h2>
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
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Education</h2>
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
                    {resumeData.skills.length > 0 && resumeData.skills[0] !== "" && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Skills</h2>
                            <div className="text-sm text-gray-800 leading-relaxed">
                                {resumeData.skills.join(', ')}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Builder;

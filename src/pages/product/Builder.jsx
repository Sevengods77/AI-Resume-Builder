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
    const { resumeData, updatePersonalInfo, updateSection, loadSampleData } = useResume();

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Left: Editor Panel */}
            <div className="w-1/2 overflow-y-auto border-r border-gray-100 bg-white">
                <div className="p-8 max-w-2xl mx-auto">
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
                                value={resumeData.personalInfo.role} // Added role field to state if needed, assuming mapped or separate
                                onChange={(e) => updatePersonalInfo('role', e.target.value)} // Might need to add to context
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
                            <div key={exp.id || index} className="mb-6 p-4 border border-gray-50 rounded bg-gray-50/50">
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
                        <Button variant="secondary" className="w-full justify-center border-dashed">
                            <Plus size={14} className="mr-2" /> Add Experience
                        </Button>
                    </FormSection>

                    {/* Placeholder for Education, Projects, Skills */}
                    <div className="p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-100 text-sm">
                        Additional sections (Education, Projects, Skills) would go here in the full implementation.
                        Current skeleton demonstrates structure.
                    </div>
                </div>
            </div>

            {/* Right: Live Preview */}
            <div className="w-1/2 bg-gray-100 p-8 overflow-y-auto flex justify-center">
                <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[15mm]">
                    {/* Resume Header */}
                    <header className="border-b-2 border-gray-900 pb-6 mb-6">
                        <h1 className="text-4xl font-bold font-serif text-gray-900 mb-2 uppercase tracking-wide">
                            {resumeData.personalInfo.fullName || "Your Name"}
                        </h1>
                        <div className="text-sm text-gray-600 flex flex-wrap gap-3">
                            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                            {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                            {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                            {resumeData.personalInfo.linkedin && <span>• {resumeData.personalInfo.linkedin}</span>}
                        </div>
                    </header>

                    {/* Summary */}
                    {resumeData.summary && (
                        <section className="mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Summary</h2>
                            <p className="text-gray-800 text-sm leading-relaxed">{resumeData.summary}</p>
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
                                        <p className="text-sm text-gray-800 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education - Rendered from state if present */}
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
                    {resumeData.skills.length > 0 && (
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

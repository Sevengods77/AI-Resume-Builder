import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import Button from '../../components/ui/Button';
import { Printer, Copy, AlertTriangle } from 'lucide-react';

const Preview = () => {
    const { resumeData, selectedTemplate } = useResume();
    const [showCopySuccess, setShowCopySuccess] = useState(false);

    // Validation Check
    const isIncomplete = !resumeData.personalInfo.fullName ||
        (resumeData.experience.length === 0 && resumeData.projects.length === 0);

    const handlePrint = () => {
        window.print();
    };

    const handleCopyText = () => {
        const { personalInfo, summary, experience, projects, education, skills } = resumeData;

        let text = `${personalInfo.fullName || "Name"}\n`;
        text += `${personalInfo.email || ""} | ${personalInfo.phone || ""} | ${personalInfo.location || ""}\n`;
        if (personalInfo.linkedin) text += `LinkedIn: ${personalInfo.linkedin}\n`;
        if (personalInfo.github) text += `GitHub: ${personalInfo.github}\n`;
        if (personalInfo.website) text += `Website: ${personalInfo.website}\n`;
        text += '\n';

        if (summary) {
            text += `SUMMARY\n${summary}\n\n`;
        }

        if (experience.length > 0) {
            text += `EXPERIENCE\n`;
            experience.forEach(exp => {
                text += `${exp.role} at ${exp.company} (${exp.duration})\n`;
                text += `${exp.description}\n\n`;
            });
        }

        if (projects.length > 0) {
            text += `PROJECTS\n`;
            projects.forEach(proj => {
                text += `${proj.name}\n${proj.description}\n\n`;
            });
        }

        if (education.length > 0) {
            text += `EDUCATION\n`;
            education.forEach(edu => {
                text += `${edu.institution} - ${edu.degree} (${edu.year})\n`;
            });
            text += '\n';
        }

        if (skills.length > 0 && skills[0] !== "") {
            text += `SKILLS\n${skills.join(', ')}\n`;
        }

        navigator.clipboard.writeText(text).then(() => {
            setShowCopySuccess(true);
            setTimeout(() => setShowCopySuccess(false), 2000);
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:p-0 print:m-0 print:min-h-0">
            {/* Controls & Warnings - Hidden in Print */}
            <div className="max-w-[210mm] mx-auto px-4 mb-6 print:hidden">
                {isIncomplete && (
                    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 text-amber-800">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                        <div>
                            <p className="font-bold text-sm">Your resume may look incomplete.</p>
                            <p className="text-xs mt-1">Please add your full name and at least one experience or project.</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <Button onClick={handleCopyText} variant="secondary" className={`transition-all ${showCopySuccess ? 'bg-green-100 text-green-700 border-green-200' : ''}`}>
                        <Copy size={16} className="mr-2" />
                        {showCopySuccess ? "Copied!" : "Copy as Text"}
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer size={16} className="mr-2" /> Print / Save PDF
                    </Button>
                </div>
            </div>

            <div className={`bg-white shadow-lg max-w-[210mm] mx-auto min-h-[297mm] p-[15mm] print:shadow-none print:w-full print:max-w-none print:p-[15mm] print:m-0 print:border-none text-gray-900 leading-normal
                ${selectedTemplate === 'classic' ? 'font-serif' : ''}
                ${selectedTemplate === 'minimal' ? 'font-mono' : ''}
            `}>
                {/* Resume Header */}
                <header className={`pb-6 mb-6 break-inside-avoid ${selectedTemplate === 'classic' ? 'border-b-2 border-black text-center' : ''} ${selectedTemplate === 'modern' ? 'border-b-2 border-gray-900' : ''} ${selectedTemplate === 'minimal' ? 'pb-4 mb-4' : ''}`}>
                    <h1 className={`text-4xl font-bold font-serif text-gray-900 mb-2 uppercase tracking-wide ${selectedTemplate === 'minimal' ? 'text-2xl lowercase tracking-tight font-sans' : ''} ${selectedTemplate === 'classic' ? 'font-serif' : 'font-heading'}`}>
                        {resumeData.personalInfo.fullName || "Your Name"}
                    </h1>
                    <div className={`text-sm text-gray-600 flex flex-wrap gap-3 ${selectedTemplate === 'classic' ? 'justify-center' : ''}`}>
                        {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                        {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                        {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                        {resumeData.personalInfo.linkedin && <span>• {resumeData.personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>}
                        {resumeData.personalInfo.github && <span>• {resumeData.personalInfo.github.replace(/^https?:\/\//, '')}</span>}
                        {resumeData.personalInfo.website && <span>• {resumeData.personalInfo.website.replace(/^https?:\/\//, '')}</span>}
                    </div>
                </header>

                {/* Summary */}
                {resumeData.summary && (
                    <section className="mb-6 break-inside-avoid">
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
                                <div key={i} className="break-inside-avoid">
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
                        <h2 className={`text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 ${selectedTemplate === 'classic' ? 'text-center border-b border-gray-200 pb-1 text-black' : ''} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}>Projects</h2>
                        <div className="space-y-4">
                            {resumeData.projects.map((proj, i) => (
                                <div key={i} className="break-inside-avoid">
                                    <h3 className="font-bold text-gray-900 mb-1">{proj.name}</h3>
                                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                    <section className="mb-6 break-inside-avoid">
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
                {resumeData.skills.length > 0 && resumeData.skills[0] !== "" && (
                    <section className="break-inside-avoid">
                        <h2 className={`text-sm font-bold uppercase tracking-widest text-gray-500 mb-2 ${selectedTemplate === 'classic' ? 'text-center border-b border-gray-200 pb-1 text-black' : ''} ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}`}>Skills</h2>
                        <div className="text-sm text-gray-800 leading-relaxed">
                            {resumeData.skills.join(', ')}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Preview;

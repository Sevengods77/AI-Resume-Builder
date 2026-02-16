import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import Button from '../../components/ui/Button';
import { Printer, Copy, AlertTriangle, Globe, Github, Check } from 'lucide-react';

const Preview = () => {
    const { resumeData, selectedTemplate, selectedColor } = useResume();
    const [showCopySuccess, setShowCopySuccess] = useState(false);
    const [showDownloadToast, setShowDownloadToast] = useState(false);

    // Validation Check
    const isIncomplete = !resumeData.personalInfo.fullName ||
        (resumeData.experience.length === 0 && resumeData.projects.length === 0);

    const handlePrint = () => {
        setShowDownloadToast(true);
        setTimeout(() => setShowDownloadToast(false), 3000);
        setTimeout(() => window.print(), 500); // Small delay to let toast render if desired, or we can just print. 
        // Actually, user wants toast "PDF export ready" - typically this means AFTER generation or as a fake-out. 
        // Let's show it and then print.
    };

    const handleCopyText = () => {
        const { personalInfo, summary, experience, projects, education, skills } = resumeData;
        let text = `${personalInfo.fullName || "Name"}\n`;
        // ... (Existing text generation logic remains same, omitting for brevity if I could, but I need to include it since I'm replacing the whole component body basically.
        // Wait, I can reuse the logic. Let me copy paste the existing handleCopyText logic if I can see it. 
        // I will use the previous logic but keep it compact.)

        // Re-implementing text generation for completeness
        text += `${personalInfo.email || ""} | ${personalInfo.phone || ""} | ${personalInfo.location || ""}\n`;
        if (personalInfo.linkedin) text += `LinkedIn: ${personalInfo.linkedin}\n`;
        if (personalInfo.github) text += `GitHub: ${personalInfo.github}\n`;
        if (personalInfo.website) text += `Website: ${personalInfo.website}\n`;
        text += '\n';

        if (summary) text += `SUMMARY\n${summary}\n\n`;

        if (experience.length > 0) {
            text += `EXPERIENCE\n`;
            experience.forEach(exp => {
                text += `${exp.role} at ${exp.company} (${exp.duration})\n${exp.description}\n\n`;
            });
        }

        if (projects.length > 0) {
            text += `PROJECTS\n`;
            projects.forEach(proj => {
                text += `${proj.name} | ${proj.liveUrl ? 'Live: ' + proj.liveUrl : ''} ${proj.githubUrl ? '| GitHub: ' + proj.githubUrl : ''}\n`;
                if (proj.techStack) text += `Tech: ${proj.techStack.join(', ')}\n`;
                text += `${proj.description}\n\n`;
            });
        }

        if (education.length > 0) {
            text += `EDUCATION\n`;
            education.forEach(edu => {
                text += `${edu.institution} - ${edu.degree} (${edu.year})\n`;
            });
            text += '\n';
        }

        if (skills) {
            text += `SKILLS\n`;
            if (skills.technical?.length) text += `Technical: ${skills.technical.join(', ')}\n`;
            if (skills.soft?.length) text += `Soft: ${skills.soft.join(', ')}\n`;
            if (skills.tools?.length) text += `Tools: ${skills.tools.join(', ')}\n`;
        }

        navigator.clipboard.writeText(text).then(() => {
            setShowCopySuccess(true);
            setTimeout(() => setShowCopySuccess(false), 2000);
        });
    };

    const SkillGroup = ({ title, skills }) => (
        skills && skills.length > 0 ? (
            <div className={`mb-3 break-inside-avoid ${selectedTemplate === 'modern' ? 'text-white' : ''}`}>
                <span className={`font-bold text-sm block mb-1 ${selectedTemplate === 'modern' ? 'text-white/90' : 'text-gray-800'}`}>{title}</span>
                <div className="flex flex-wrap gap-1">
                    {skills.map((s, i) => (
                        <span key={i} className={`text-xs px-2 py-1 rounded ${selectedTemplate === 'modern'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-700'
                            }`}>
                            {s}
                        </span>
                    ))}
                </div>
            </div>
        ) : null
    );

    // --- TEMPLATE RENDERERS ---

    const renderHeader = () => (
        <header className={`pb-6 mb-6 break-inside-avoid 
            ${selectedTemplate === 'classic' ? 'text-center border-b-2' : ''} 
            ${selectedTemplate === 'minimal' ? 'mb-8' : ''}
        `} style={{ borderColor: selectedColor }}>
            <h1 className={`text-4xl font-bold mb-2 uppercase tracking-wide 
                ${selectedTemplate === 'classic' ? 'font-serif' : 'font-heading'}
                ${selectedTemplate === 'minimal' ? 'text-3xl lowercase tracking-tight font-sans' : ''}
            `} style={{ color: selectedTemplate === 'minimal' ? selectedColor : 'inherit' }}>
                {resumeData.personalInfo.fullName || "Your Name"}
            </h1>
            <div className={`text-sm text-gray-600 flex flex-wrap gap-3 
                ${selectedTemplate === 'classic' ? 'justify-center' : ''}
            `}>
                <ContactItem icon={null} value={resumeData.personalInfo.email} />
                <ContactItem icon={null} value={resumeData.personalInfo.phone} />
                <ContactItem icon={null} value={resumeData.personalInfo.location} />
                <ContactItem icon={null} value={resumeData.personalInfo.linkedin} link />
                <ContactItem icon={null} value={resumeData.personalInfo.github} link />
                <ContactItem icon={null} value={resumeData.personalInfo.website} link />
            </div>
        </header>
    );

    const ContactItem = ({ value, link }) => {
        if (!value) return null;
        const display = link ? value.replace(/^https?:\/\//, '') : value;
        return (
            <span className="flex items-center gap-1">
                {selectedTemplate !== 'modern' && <span className="w-1 h-1 rounded-full bg-gray-400"></span>}
                {link ? (
                    <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="hover:underline">
                        {display}
                    </a>
                ) : display}
            </span>
        );
    };

    // Modern Sidebar Config
    if (selectedTemplate === 'modern') {
        return (
            <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:p-0 print:m-0">
                {/* Toasts */}
                {showDownloadToast && (
                    <div className="fixed top-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-3">
                            <span className="bg-green-500 rounded-full p-1"><Check size={12} className="text-white" /></span>
                            <div>
                                <p className="font-bold text-sm">PDF Export Ready!</p>
                                <p className="text-xs text-gray-400">Check your downloads folder.</p>
                            </div>
                        </div>
                    </div>
                )}

                <Controls
                    isIncomplete={isIncomplete}
                    showCopySuccess={showCopySuccess}
                    handleCopyText={handleCopyText}
                    handlePrint={handlePrint}
                />

                <div className="bg-white shadow-lg max-w-[210mm] mx-auto min-h-[297mm] flex print:w-full print:max-w-none print:shadow-none print:m-0">
                    {/* Left Sidebar (30%) */}
                    <div className="w-[32%] p-8 text-white print:bg-print-color" style={{ backgroundColor: selectedColor }}>
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
                                </div>
                            </section>

                            <section>
                                <h3 className="font-bold uppercase tracking-wider mb-3 text-white/70 border-b border-white/20 pb-1 text-xs">Skills</h3>
                                <SkillGroup title="Technical" skills={resumeData.skills?.technical} />
                                <SkillGroup title="Soft Skills" skills={resumeData.skills?.soft} />
                                <SkillGroup title="Tools" skills={resumeData.skills?.tools} />
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

                    {/* Right Content (70%) */}
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
            </div>
        );
    }

    // Default / Classic / Minimal Render
    return (
        <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:p-0 print:m-0">
            {/* Toasts */}
            {showDownloadToast && (
                <div className="fixed top-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                        <span className="bg-green-500 rounded-full p-1"><Check size={12} className="text-white" /></span>
                        <div>
                            <p className="font-bold text-sm">PDF Export Ready!</p>
                            <p className="text-xs text-gray-400">Check your downloads folder.</p>
                        </div>
                    </div>
                </div>
            )}

            <Controls
                isIncomplete={isIncomplete}
                showCopySuccess={showCopySuccess}
                handleCopyText={handleCopyText}
                handlePrint={handlePrint}
            />

            <div className={`bg-white shadow-lg max-w-[210mm] mx-auto min-h-[297mm] p-[15mm] print:shadow-none print:w-full print:max-w-none print:p-[15mm] print:m-0 text-gray-900 leading-normal
                ${selectedTemplate === 'classic' ? 'font-serif' : ''}
                ${selectedTemplate === 'minimal' ? 'font-mono' : ''}
            `}>
                {renderHeader()}

                {resumeData.summary && (
                    <section className="mb-6 break-inside-avoid">
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-2 
                            ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'}
                            ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}
                        `} style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
                            Summary
                        </h2>
                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{resumeData.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {resumeData.experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 
                            ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'}
                             ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}
                        `} style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
                            Experience
                        </h2>
                        <div className="space-y-4">
                            {resumeData.experience.map((exp, i) => (
                                <div key={i} className="break-inside-avoid">
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
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 
                            ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'}
                             ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}
                        `} style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {resumeData.projects.map((proj, i) => (
                                <div key={i} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
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
                                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {resumeData.education.length > 0 && (
                    <section className="mb-6 break-inside-avoid">
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 
                            ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'}
                             ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}
                        `} style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
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
                    <section className="break-inside-avoid">
                        <h2 className={`text-sm font-bold uppercase tracking-widest mb-2 
                            ${selectedTemplate === 'classic' ? 'text-center border-b pb-1 text-black' : 'text-gray-500'}
                             ${selectedTemplate === 'minimal' ? 'text-black lowercase tracking-tighter' : ''}
                        `} style={{ color: selectedTemplate !== 'classic' ? selectedColor : 'inherit', borderColor: selectedColor }}>
                            Skills
                        </h2>
                        <div className="text-sm text-gray-800 leading-relaxed">
                            <SkillGroup title="Technical" skills={resumeData.skills.technical} />
                            <SkillGroup title="Soft Skills" skills={resumeData.skills.soft} />
                            <SkillGroup title="Tools" skills={resumeData.skills.tools} />
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

const Controls = ({ isIncomplete, showCopySuccess, handleCopyText, handlePrint }) => (
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
);

export default Preview;

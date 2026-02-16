import React from 'react';
import { useResume } from '../../context/ResumeContext';
import Button from '../../components/ui/Button';
import { Printer } from 'lucide-react';

const Preview = () => {
    const { resumeData } = useResume();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-gray-100 min-h-screen py-8 print:bg-white print:p-0 print:m-0 print:min-h-0">
            <div className="max-w-4xl mx-auto flex justify-end mb-6 px-4 print:hidden">
                <Button onClick={handlePrint}>
                    <Printer size={16} className="mr-2" /> Print Results
                </Button>
            </div>

            <div className="bg-white shadow-lg max-w-[210mm] mx-auto min-h-[297mm] p-[15mm] print:shadow-none print:w-full print:max-w-none print:p-[15mm] print:m-0 print:border-none text-gray-900 leading-normal">
                {/* Resume Header */}
                <header className="border-b-2 border-gray-900 pb-6 mb-6">
                    <h1 className="text-4xl font-bold font-serif text-gray-900 mb-2 uppercase tracking-wide">
                        {resumeData.personalInfo.fullName || "Your Name"}
                    </h1>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-3">
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
    );
};

export default Preview;

import React, { useState, useEffect } from 'react';
import ContextHeader from '../components/layout/ContextHeader';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CheckCircle2, AlertCircle, Copy, Rocket, Package } from 'lucide-react';
import {
    getSteps,
    getSubmission,
    saveSubmission,
    isProjectShipped,
    BUILD_STEPS,
    generateSubmissionText,
    validateUrl,
    saveChecklist
} from '../services/proofService';

const ProofPage = () => {
    const [steps, setSteps] = useState({});
    const [submission, setSubmission] = useState({ lovableUrl: '', githubUrl: '', deployedUrl: '' });
    const [isShipped, setIsShipped] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState({});

    // Checklist State
    const [checklist, setChecklist] = useState({
        storage: false,
        preview: false,
        template: false,
        color: false,
        ats: false,
        score_update: false,
        export: false,
        empty_state: false,
        mobile: false,
        console: false
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setSteps(getSteps());
        setSubmission(getSubmission());
        setIsShipped(isProjectShipped());
    };

    // Verify if all checklist items are checked
    const allChecklistPassed = Object.values(checklist).every(Boolean);

    // Effect to update global checklist status when local state changes
    useEffect(() => {
        saveChecklist(allChecklistPassed);
        setIsShipped(isProjectShipped());
    }, [checklist, submission, steps]); // Re-check shipping status heavily

    const handleUrlChange = (field, value) => {
        const newSubmission = { ...submission, [field]: value };
        setSubmission(newSubmission);
        saveSubmission(newSubmission);

        // Validate
        if (value && !validateUrl(value)) {
            setErrors(prev => ({ ...prev, [field]: 'Invalid URL' }));
        } else {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const toggleChecklist = (key) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCopy = () => {
        const text = generateSubmissionText();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <ContextHeader
                title="Project Proof"
                subtitle="Track your build progress and finalize submission."
            />

            <div className="space-y-8">
                {/* Status Banner */}
                <div className={`p-6 rounded-lg border-2 flex items-center gap-4 transition-colors duration-500 ${isShipped
                    ? 'bg-green-50 border-green-200 text-green-900'
                    : 'bg-white border-gray-200 text-gray-600'
                    }`}>
                    {isShipped ? <CheckCircle2 size={32} className="text-green-600" /> : <Package size={32} className="text-gray-400" />}
                    <div>
                        <h2 className="text-xl font-bold font-heading">
                            {isShipped ? 'Project 3 Shipped Successfully.' : 'Build In Progress'}
                        </h2>
                        <p className="opacity-90 text-sm">
                            {isShipped
                                ? 'All systems operational. Ready for submission.'
                                : 'Complete all steps, pass the checklist, and provide artifacts to ship.'}
                        </p>
                    </div>
                </div>

                {/* Final Verification Checklist */}
                <Card>
                    <CardHeader>
                        <CardTitle>1. Final Verification Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { id: 'storage', label: 'All form sections save to localStorage' },
                                { id: 'preview', label: 'Live preview updates in real-time' },
                                { id: 'template', label: 'Template switching preserves data' },
                                { id: 'color', label: 'Color theme persists after refresh' },
                                { id: 'ats', label: 'ATS score calculates correctly' },
                                { id: 'score_update', label: 'Score updates live on edit' },
                                { id: 'export', label: 'Export buttons work (copy/download)' },
                                { id: 'empty_state', label: 'Empty states handled gracefully' },
                                { id: 'mobile', label: 'Mobile responsive layout works' },
                                { id: 'console', label: 'No console errors on any page' }
                            ].map(item => (
                                <label key={item.id} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={checklist[item.id]}
                                        onChange={() => toggleChecklist(item.id)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                </label>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Artifacts Input */}
                <Card>
                    <CardHeader>
                        <CardTitle>2. Deployment Artifacts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { id: 'lovableUrl', label: 'Lovable Project Link', placeholder: 'https://lovable.dev/...' },
                            { id: 'githubUrl', label: 'GitHub Repository', placeholder: 'https://github.com/...' },
                            { id: 'deployedUrl', label: 'Live Deployment URL', placeholder: 'https://vercel.app/...' }
                        ].map(field => (
                            <div key={field.id}>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {field.label} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${errors[field.id] ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder={field.placeholder}
                                    value={submission[field.id]}
                                    onChange={(e) => handleUrlChange(field.id, e.target.value)}
                                />
                                {errors[field.id] && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} /> {errors[field.id]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Final Submission */}
                <Card>
                    <CardHeader>
                        <CardTitle>3. Final Submission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Copy this text to submit your project proof. Button enabled only when shipped.
                        </p>
                        <Button
                            className={`w-full justify-center transition-all ${isShipped ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
                            disabled={!isShipped}
                            onClick={handleCopy}
                        >
                            {copied ? <CheckCircle2 size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                            {copied ? 'Copied to Clipboard' : 'Copy Final Submission'}
                        </Button>
                        {!isShipped && (
                            <div className="text-center mt-3 space-y-1">
                                {!allChecklistPassed && (
                                    <p className="text-xs text-amber-600 flex items-center justify-center gap-1">
                                        <AlertCircle size={12} /> Complete all checklist items
                                    </p>
                                )}
                                {(!validateUrl(submission.lovableUrl) || !validateUrl(submission.githubUrl) || !validateUrl(submission.deployedUrl)) && (
                                    <p className="text-xs text-amber-600 flex items-center justify-center gap-1">
                                        <AlertCircle size={12} /> Provide all 3 valid URLs (https://...)
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProofPage;

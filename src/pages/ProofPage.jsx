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
    validateUrl
} from '../services/proofService';

const ProofPage = () => {
    const [steps, setSteps] = useState({});
    const [submission, setSubmission] = useState({ lovableUrl: '', githubUrl: '', deployedUrl: '' });
    const [isShipped, setIsShipped] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setSteps(getSteps());
        setSubmission(getSubmission());
        setIsShipped(isProjectShipped());
    };

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

        setIsShipped(isProjectShipped());
    };

    const handleCopy = () => {
        const text = generateSubmissionText();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const completedCount = Object.values(steps).filter(Boolean).length;
    const progress = Math.round((completedCount / 8) * 100);

    return (
        <div>
            <ContextHeader
                title="Project Proof"
                subtitle="Track your build progress and finalize submission."
            />

            <div className="space-y-8">
                {/* Status Banner */}
                <div className={`p-6 rounded-lg border-2 flex items-center gap-4 ${isShipped
                        ? 'bg-green-50 border-green-200 text-green-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                    {isShipped ? <CheckCircle2 size={32} /> : <Rocket size={32} />}
                    <div>
                        <h2 className="text-xl font-bold font-heading">
                            {isShipped ? 'Project Shipped!' : 'Build In Progress'}
                        </h2>
                        <p className="opacity-90">
                            {isShipped
                                ? 'All steps completed and artifacts provided. Ready for review.'
                                : 'Complete all 8 steps and provide deployment links to ship.'}
                        </p>
                    </div>
                </div>

                {/* Progress Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Build Track Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex justify-between text-sm font-semibold">
                            <span>{completedCount} of 8 Steps Completed</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {BUILD_STEPS.map((step, i) => (
                                <div
                                    key={step.id}
                                    className={`p-3 rounded border flex items-center gap-3 ${steps[step.id]
                                            ? 'bg-green-50 border-green-100 text-green-900'
                                            : 'bg-gray-50 border-gray-100 text-gray-500'
                                        }`}
                                >
                                    {steps[step.id] ? <CheckCircle2 size={18} /> : <span className="w-[18px] text-center text-xs font-bold">{i + 1}</span>}
                                    <span className="font-medium">{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Artifacts Input */}
                <Card>
                    <CardHeader>
                        <CardTitle>Deployment Artifacts</CardTitle>
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
                                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:outline-none ${errors[field.id] ? 'border-red-300' : 'border-gray-300'
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
                        <CardTitle>Final Submission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Copy this text to submit your project proof. Button enabled only when shipped.
                        </p>
                        <Button
                            className="w-full justify-center"
                            disabled={!isShipped}
                            onClick={handleCopy}
                        >
                            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied to Clipboard' : 'Copy Final Submission'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProofPage;

import React, { useState, useEffect } from 'react';
import ContextHeader from '../components/layout/ContextHeader';
import SecondaryPanel from '../components/layout/SecondaryPanel';
import { updateStep, getSteps } from '../services/proofService';
import Button from '../components/ui/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const StepPage = ({ stepId, title, subtitle, prompt, description }) => {
    const [artifact, setArtifact] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    const artifactKey = `rb_${stepId}_artifact`;

    useEffect(() => {
        // Load saved artifact
        const savedArtifact = localStorage.getItem(artifactKey);
        if (savedArtifact) {
            setArtifact(savedArtifact);
            setIsComplete(true);
            updateStep(stepId, true);
        } else {
            // Sync with service if manually cleared
            const steps = getSteps();
            if (steps[stepId]) {
                // Component mounted but no local artifact found? 
                // We might want to clear the step completion or keep it.
                // For stricter gating, let's keep it sync.
            }
        }
    }, [stepId, artifactKey]);

    const handleSave = () => {
        if (!artifact.trim()) return;

        localStorage.setItem(artifactKey, artifact);
        updateStep(stepId, true);
        setIsComplete(true);

        // Force update for layout to unlock Next button
        window.dispatchEvent(new Event('storage'));
        // Reload to reflect state immediately if needed, or rely on react state
        // In ProjectLayout, we read from localStorage on render, so a re-render is needed.
        // We can use a context or simple window event.
        // For now, let's just set local state. Layout might need to listen to storage event or use a context.
        // To be safe, we can use a small timeout to ensure localStorage is written.
    };

    return (
        <div>
            <ContextHeader title={title} subtitle={subtitle} />

            <div className="bg-white p-8 rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm">
                <h2 className="text-xl font-bold font-heading mb-4">Output Artifact</h2>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Paste your result here to complete this step:
                    </label>
                    <textarea
                        className="w-full h-32 p-4 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:outline-none resize-none font-mono text-sm"
                        placeholder="Paste code snippet, screenshot URL, or text description..."
                        value={artifact}
                        onChange={(e) => setArtifact(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={handleSave} disabled={!artifact.trim()}>
                        {isComplete ? 'Update Artifact' : 'Complete Step'}
                    </Button>

                    {isComplete && (
                        <div className="flex items-center text-green-700 fade-in">
                            <CheckCircle2 size={18} className="mr-2" />
                            <span className="font-medium">Step Completed</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StepPage;

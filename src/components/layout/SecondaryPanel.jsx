import React, { useState } from 'react';
import Button from '../ui/Button';
import { Copy, Rocket, Check, ExternalLink } from 'lucide-react';

const SecondaryPanel = ({ stepData }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(stepData.prompt || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <aside className="w-[30%] border-l border-[rgba(0,0,0,0.08)] bg-[#F7F6F3] flex flex-col h-[calc(100vh-64px)] fixed right-0 top-16">
            <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
                <h3 className="text-lg font-bold font-heading mb-2">Step Analysis</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {stepData.description || "Follow the instructions to complete this step."}
                </p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-white rounded border border-[rgba(0,0,0,0.08)] p-4 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">AI Prompt</span>
                        <Button variant="secondary" onClick={handleCopy} className="!p-1 h-8 w-8">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                    </div>
                    <div className="text-sm text-gray-800 font-mono bg-gray-50 p-3 rounded border border-gray-100 whitespace-pre-wrap">
                        {stepData.prompt || "No prompt available for this step."}
                    </div>
                </div>

                <div className="space-y-3">
                    <Button variant="primary" className="w-full justify-center">
                        <Rocket size={16} /> Build in Lovable
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="secondary" className="justify-center">It Worked</Button>
                        <Button variant="secondary" className="justify-center">Error</Button>
                    </div>

                    <Button variant="secondary" className="w-full justify-center">
                        Add Screenshot
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default SecondaryPanel;

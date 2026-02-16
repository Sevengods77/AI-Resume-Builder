import React from 'react';
import { Layout } from 'lucide-react';

const TopBar = ({ projectName = "AI Resume Builder", step = 1, totalSteps = 8, status = "In Progress" }) => {
    return (
        <div className="h-16 border-b border-[rgba(0,0,0,0.08)] bg-white flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
                <Layout className="w-5 h-5 text-primary" />
                {projectName}
            </div>

            <div className="font-medium text-gray-600">
                Step {step} of {totalSteps}
            </div>

            <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${status === "Shipped"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                    {status}
                </span>
            </div>
        </div>
    );
};

export default TopBar;

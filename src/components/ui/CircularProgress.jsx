import React from 'react';

const CircularProgress = ({ value, size = 120, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    // Color Logic
    let colorClass = 'text-red-500'; // Default Needs Work
    if (value >= 71) colorClass = 'text-green-500'; // Strong
    else if (value >= 41) colorClass = 'text-amber-500'; // Getting There

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    className="text-gray-200"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Circle */}
                <circle
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            {/* Percentage Text */}
            <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-bold ${colorClass}`}>
                    {Math.round(value)}%
                </span>
            </div>
        </div>
    );
};

export default CircularProgress;

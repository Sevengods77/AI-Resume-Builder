import React from 'react';

const ContextHeader = ({ title, subtitle }) => {
    return (
        <header className="mb-8 border-b border-[rgba(0,0,0,0.08)] pb-6">
            <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600 text-lg">{subtitle}</p>
        </header>
    );
};

export default ContextHeader;

import React from 'react';

export const LogoMark = ({ className = "w-6 h-6" }: { className?: string }) => {
    return (
        <div className={`relative flex items-center justify-center rounded-lg bg-emerald-500/10 p-1.5 border border-emerald-500/20 ${className}`}>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full text-[#05C168]"
            >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        </div>
    );
};

import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FileText, LayoutTemplate, CheckCircle } from 'lucide-react';

const ProductLayout = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-white font-body text-gray-900 flex flex-col">
            <nav className="h-16 border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 bg-white/90 backdrop-blur-sm z-50 print:hidden">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-heading font-bold text-xl">
                        AI
                    </div>
                    <span className="font-heading font-bold text-lg tracking-tight">Resume Builder</span>
                </div>

                <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
                    <Link
                        to="/builder"
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isActive('/builder')
                            ? 'bg-white shadow-sm text-black'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Builder
                    </Link>
                    <Link
                        to="/preview"
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isActive('/preview')
                            ? 'bg-white shadow-sm text-black'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Preview
                    </Link>
                    <Link
                        to="/proof"
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${isActive('/proof')
                            ? 'bg-white shadow-sm text-black'
                            : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Proof
                    </Link>
                </div>

                <div>
                    <Link to="/rb/01-problem" className="text-xs font-medium text-gray-400 hover:text-gray-600">
                        Build Track &rarr;
                    </Link>
                </div>
            </nav>

            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default ProductLayout;

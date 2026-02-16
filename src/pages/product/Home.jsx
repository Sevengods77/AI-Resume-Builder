import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center px-4">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 mb-4">
                    <Sparkles size={16} className="text-gray-900" />
                    <span className="text-sm font-medium text-gray-600">AI-Powered Resume Builder</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-heading font-bold text-gray-900 leading-tight tracking-tight">
                    Build a Resume <br />
                    <span className="text-gray-400 font-serif italic">That Gets Read.</span>
                </h1>

                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Create professional, ATS-friendly resumes in minutes with our calm, intelligent builder.
                    No distractions, just focus on your career story.
                </p>

                <div className="flex items-center justify-center gap-4 pt-4">
                    <Link to="/builder">
                        <Button className="!px-8 !py-4 !text-lg !rounded-full shadow-lg hover:shadow-xl transition-all">
                            Start Building <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                    <Link to="/preview">
                        <Button variant="secondary" className="!px-8 !py-4 !text-lg !rounded-full !bg-transparent border-gray-200 hover:border-gray-900">
                            View Examples
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex gap-12 items-center justify-center">
                    {/* Placeholder logos */}
                    <span className="font-heading font-bold text-xl text-gray-400">Google</span>
                    <span className="font-heading font-bold text-xl text-gray-400">Netflix</span>
                    <span className="font-heading font-bold text-xl text-gray-400">Stripe</span>
                    <span className="font-heading font-bold text-xl text-gray-400">Airbnb</span>
                </div>
            </div>
        </div>
    );
};

export default Home;

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import SecondaryPanel from './SecondaryPanel';
import Button from '../ui/Button';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { getStep, getSteps, BUILD_STEPS } from '../../services/proofService';

const ProjectLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentStepIndex = BUILD_STEPS.findIndex(s => s.path === location.pathname);
    const currentStep = BUILD_STEPS[currentStepIndex];
    const nextStep = BUILD_STEPS[currentStepIndex + 1];
    const prevStep = BUILD_STEPS[currentStepIndex - 1];

    // Gating Logic
    const [stepsData, setStepsData] = React.useState(getSteps());

    React.useEffect(() => {
        const handleStorageChange = () => {
            setStepsData(getSteps());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const isCurrentStepComplete = stepsData[currentStep?.id] || false;

    // For Proof page, no gating
    const isProofPage = location.pathname === '/rb/proof';

    const handleNext = () => {
        if (nextStep) navigate(nextStep.path);
    };

    const handlePrev = () => {
        if (prevStep) navigate(prevStep.path);
    };

    return (
        <div className="min-h-screen bg-[#F7F6F3] font-body">
            <TopBar
                step={currentStepIndex + 1}
                totalSteps={8}
                status={isProofPage ? "Shipped" : "In Progress"}
            />

            <div className="flex">
                {/* Main Workspace (70%) */}
                <main className="w-[70%] p-12 pb-32 min-h-[calc(100vh-64px)]">
                    <div className="max-w-3xl mx-auto">
                        <Outlet />

                        {/* Navigation Footer */}
                        {!isProofPage && (
                            <div className="mt-12 flex justify-between items-center pt-8 border-t border-[rgba(0,0,0,0.08)]">
                                <Button
                                    variant="secondary"
                                    onClick={handlePrev}
                                    disabled={!prevStep}
                                    className={!prevStep ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                    <ChevronLeft size={16} /> Previous
                                </Button>

                                <Button
                                    variant="primary"
                                    onClick={handleNext}
                                    disabled={!isCurrentStepComplete}
                                    className={!isCurrentStepComplete ? "opacity-50 cursor-not-allowed" : ""}
                                    title={!isCurrentStepComplete ? "Complete this step to proceed" : ""}
                                >
                                    {!isCurrentStepComplete && <Lock size={14} className="mr-2" />}
                                    Next Step <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                </main>

                {/* Build Panel (30%) */}
                {!isProofPage && (
                    <SecondaryPanel stepData={{}} />
                )}
            </div>
        </div>
    );
};

export default ProjectLayout;

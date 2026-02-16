/**
 * Proof Service
 * Manages project completion tracking and final submission
 */

const STEPS_KEY = 'rb_steps_completion';
const SUBMISSION_KEY = 'rb_final_submission';
const CHECKLIST_KEY = 'rb_checklist_passed';

/**
 * 8 Build Steps
 */
export const BUILD_STEPS = [
    { id: 'step1', label: 'Problem & Solution', path: '/rb/01-problem' },
    { id: 'step2', label: 'Market Analysis', path: '/rb/02-market' },
    { id: 'step3', label: 'Architecture', path: '/rb/03-architecture' },
    { id: 'step4', label: 'HLD', path: '/rb/04-hld' },
    { id: 'step5', label: 'LLD', path: '/rb/05-lld' },
    { id: 'step6', label: 'Build', path: '/rb/06-build' },
    { id: 'step7', label: 'Test', path: '/rb/07-test' },
    { id: 'step8', label: 'Ship', path: '/rb/08-ship' }
];

/**
 * Get steps completion state
 * @returns {Object} - Map of stepId -> boolean
 */
export function getSteps() {
    try {
        const data = localStorage.getItem(STEPS_KEY);
        if (!data) {
            // Initialize all steps as incomplete
            const initialState = {};
            BUILD_STEPS.forEach(step => {
                initialState[step.id] = false;
            });
            return initialState;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('[PROOF] Error reading steps:', error);
        return {};
    }
}

/**
 * Get URL for a specific step ID
 */
export function getStepPath(stepId) {
    const step = BUILD_STEPS.find(s => s.id === stepId);
    return step ? step.path : '/';
}

/**
 * Update a single step completion status
 * @param {string} stepId - Step ID
 * @param {boolean} completed - Completion state
 */
export function updateStep(stepId, completed) {
    try {
        const steps = getSteps();
        steps[stepId] = completed;
        localStorage.setItem(STEPS_KEY, JSON.stringify(steps));
        console.log(`[PROOF] Updated ${stepId} to ${completed}`);
        // Dispatch event for reactive updates if needed
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error('[PROOF] Error updating step:', error);
    }
}

/**
 * Get submission artifacts
 * @returns {Object} - { lovableUrl, githubUrl, deployedUrl }
 */
export function getSubmission() {
    try {
        const data = localStorage.getItem(SUBMISSION_KEY);
        if (!data) {
            return {
                lovableUrl: '',
                githubUrl: '',
                deployedUrl: ''
            };
        }
        return JSON.parse(data);
    } catch (error) {
        return {
            lovableUrl: '',
            githubUrl: '',
            deployedUrl: ''
        };
    }
}

/**
 * Save submission artifacts
 * @param {Object} submission - { lovableUrl, githubUrl, deployedUrl }
 */
export function saveSubmission(submission) {
    try {
        localStorage.setItem(SUBMISSION_KEY, JSON.stringify(submission));
    } catch (error) {
        console.error('[PROOF] Error saving submission:', error);
    }
}

/**
 * Get Checklist Status
 */
export function getChecklist() {
    return localStorage.getItem(CHECKLIST_KEY) === 'true';
}

/**
 * Save Checklist Status
 */
export function saveChecklist(passed) {
    localStorage.setItem(CHECKLIST_KEY, passed);
    window.dispatchEvent(new Event('storage'));
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export function validateUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return false;
    }
    try {
        new URL(trimmed);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Check if all steps are completed
 * @returns {boolean}
 */
export function allStepsComplete() {
    const steps = getSteps();
    return BUILD_STEPS.every(step => steps[step.id] === true);
}

/**
 * Check if all artifacts are provided
 * @returns {boolean}
 */
export function allArtifactsProvided() {
    const { lovableUrl, githubUrl, deployedUrl } = getSubmission();
    return validateUrl(lovableUrl) && validateUrl(githubUrl) && validateUrl(deployedUrl);
}

/**
 * Check if project is shipped (all conditions met)
 * @returns {boolean}
 */
export function isProjectShipped() {
    return allArtifactsProvided() && getChecklist();
}

/**
 * Get completion progress
 * @returns {Object} - { steps, artifacts }
 */
export function getCompletionStatus() {
    return {
        steps: allStepsComplete(),
        artifacts: allArtifactsProvided()
    };
}

/**
 * Generate formatted submission text
 * @returns {string}
 */
export function generateSubmissionText() {
    const { lovableUrl, githubUrl, deployedUrl } = getSubmission();
    const checklistPassed = getChecklist();

    return `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${lovableUrl}
GitHub Repository: ${githubUrl}
Live Deployment: ${deployedUrl}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`;
}

/**
 * Helper to get a specific step by ID
 */
export function getStep(stepId) {
    return BUILD_STEPS.find(s => s.id === stepId);
}

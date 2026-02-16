import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProjectLayout from './components/layout/ProjectLayout';
import StepPage from './pages/StepPage';
import ProofPage from './pages/ProofPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/rb/01-problem" replace />} />

        <Route element={<ProjectLayout />}>
          {/* Step 1: Problem */}
          <Route path="/rb/01-problem" element={
            <StepPage
              stepId="step1"
              title="Problem & Solution"
              subtitle="Define the core problem you are solving and your solution hypothesis."
              prompt="Write a clear problem statement and your solution. What are you building and why?"
            />
          } />

          {/* Step 2: Market */}
          <Route path="/rb/02-market" element={
            <StepPage
              stepId="step2"
              title="Market Analysis"
              subtitle="Identify your target audience and competitors."
              prompt="Who is this for? analyze the market size and existing competitors."
            />
          } />

          {/* Step 3: Architecture */}
          <Route path="/rb/03-architecture" element={
            <StepPage
              stepId="step3"
              title="System Architecture"
              subtitle="Design the high-level architecture of your system."
              prompt="Create a system architecture diagram or description. What are the key components?"
            />
          } />

          {/* Step 4: HLD */}
          <Route path="/rb/04-hld" element={
            <StepPage
              stepId="step4"
              title="High Level Design (HLD)"
              subtitle="Define the data flow and major modules."
              prompt="Outline the High Level Design. How do data and requests flow through the system?"
            />
          } />

          {/* Step 5: LLD */}
          <Route path="/rb/05-lld" element={
            <StepPage
              stepId="step5"
              title="Low Level Design (LLD)"
              subtitle="Detail the class structure and API contracts."
              prompt="Specify the Low Level Design. Define API endpoints, database schema, and class methods."
            />
          } />

          {/* Step 6: Build */}
          <Route path="/rb/06-build" element={
            <StepPage
              stepId="step6"
              title="Build & Implementation"
              subtitle="Execute the coding phase based on your designs."
              prompt="Start building! Paste your GitHub repo link or core implementation details here."
            />
          } />

          {/* Step 7: Test */}
          <Route path="/rb/07-test" element={
            <StepPage
              stepId="step7"
              title="Testing & Validation"
              subtitle="Ensure your system works as expected."
              prompt="Run your tests. Paste the test results or a screenshot of the passing test suite."
            />
          } />

          {/* Step 8: Ship */}
          <Route path="/rb/08-ship" element={
            <StepPage
              stepId="step8"
              title="Ship & Deploy"
              subtitle="Deploy your application to production."
              prompt="Deploy the app. Paste the live URL here."
            />
          } />

          {/* Proof Page */}
          <Route path="/rb/proof" element={<ProofPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

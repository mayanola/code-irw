import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IntroForm from './IntroForm';
import ProjectPage from './ProjectPage';
import SubstepPage from './SubstepPage'; // Import the SubstepPage component

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<IntroForm />} />
                <Route path="/project" element={<ProjectPage />}>
                    <Route path="step/:stepIndex/substep/:substepIndex" element={<SubstepPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;

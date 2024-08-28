import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IntroForm from './IntroForm';
import ProjectPage from './ProjectPage';
import SubstepPage from './SubstepPage'; // Import the SubstepPage component
import DummyLogin from './DummyLogin';
import Home from './Home';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DummyLogin />} />
                <Route path="/home/:userId" element={<Home />} />
                <Route path="/intro/:userId/:projectId" element={<IntroForm />} />
                <Route path="/project" element={<ProjectPage />}>
                    <Route path="step/:stepIndex/substep/:substepIndex" element={<SubstepPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;

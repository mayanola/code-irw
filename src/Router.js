import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import IntroForm from './IntroForm';
import ProjectPage from './ProjectPage';

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<IntroForm />} />
                <Route path="/project" element={<ProjectPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;
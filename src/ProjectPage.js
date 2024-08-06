import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './ProjectPage.css'; // Import the CSS file

// A temporary JSON object to represent an example set of tasks
// In the future, this will be passed in to the component or 
// loaded from the database.
const temp_json_tasks = {
    "Project Summary": "Biology Data Analysis",
    "Steps": [
        {
            "Step 1": "Download VSCODE",
            "Substeps": [
                "Go to VSCODE.com",
                "Download it"
            ]
        },
        {
            "Step 2": "Learn R",
            "Substeps": [
                "Download R",
                "Learn R very well"
            ]
        },
        {
            "Step 3": "Learn Python",
            "Substeps": [
                "Download Python",
                "Learn Python very well"
            ]
        }
    ],
    "Name": "Carolyn"
}

const ProjectPage = () => {
    // State to keep track of the checked status of each substep
    const [checked, setChecked] = useState(
        temp_json_tasks.Steps.map(step =>
            step.Substeps.map(() => false)
        )
    );

    // Handler function to update the checked status
    const handleCheckboxChange = (stepIndex, substepIndex) => {
        // Create a new checked state with the updated value
        const newChecked = checked.map((step, i) =>
            step.map((substep, j) => (i === stepIndex && j === substepIndex ? !substep : substep))
        );
        setChecked(newChecked); // Update the state
    };

    return (
        <div className="container">
            <div className="side-pane">
                {/* Display the project name */}
                <h1>{temp_json_tasks["Project Summary"]}</h1>

                {/* Display each of the steps */}
                <div>
                    {temp_json_tasks.Steps.map((step, stepIndex) => (
                        <div key={stepIndex}>
                            <h2>{Object.keys(step)[0]}: {Object.values(step)[0]}</h2>
                            <ul>
                                {/* Display each substep with a checkbox */}
                                {step.Substeps.map((substep, substepIndex) => (
                                    <li key={substepIndex}>
                                        <label>
                                            {/* Checkbox for each substep */}
                                            <input
                                                type="checkbox"
                                                checked={checked[stepIndex][substepIndex]} // Checked status
                                                onChange={() => handleCheckboxChange(stepIndex, substepIndex)} // Update on change
                                            />
                                            <Link to={`/project/step/${stepIndex}/substep/${substepIndex}`}>
                                                {substep}
                                            </Link>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Display the user's name */}
                <footer>
                    <p>Name: {temp_json_tasks.Name}</p>
                </footer>
            </div>
            <Outlet /> {/* Render sub-routes here */}
        </div>
    );
}

export default ProjectPage;

import React from 'react';

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
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>

            {/* Display the project name */}
            <h1>{temp_json_tasks["Project Summary"]}</h1>

            {/* Display each of the steps */}
            <div>
                {temp_json_tasks.Steps.map((step, index) => (
                    <div key={index}>
                        <h2>{Object.keys(step)[0]}: {Object.values(step)[0]}</h2>
                        <ul>
                            {step.Substeps.map((substep, subIndex) => (
                                <li key={subIndex}>{substep}</li>
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
    );
}

export default ProjectPage;

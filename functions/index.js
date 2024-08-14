const functions = require('firebase-functions/v1');
const cors = require('cors')({ origin: true });
require('dotenv').config();

// Setup the OpenAI API
const API_KEY = "sk-proj-0MAh3JhaG59omGtWDpzJT3BlbkFJKj1tH72rspC2sFyhymHT";
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: API_KEY });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const systemMessage = {
  role: "system",
  content: `You are an educational tool guiding students through each step of the way through a project plan. Your job is to generate detailed instructions for each substep in the context of the provided plan.`
};

// Take the text parameter passed to this HTTP endpoint and insert it into Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { who, what, how_learn, timeline, skills, goals, design, dataset, additional } = req.body.data.newFormData;

    // Call GPT API
    const userMessage = {
      role: 'user',
      content: `Who: ${who}, What: ${what}, How to Learn: ${how_learn}, Timeline: ${timeline}, Skills: ${skills}, Goals: ${goals}, Design: ${design}, Dataset: ${dataset}, Additional: ${additional}`
    };

    try {
      const completions = await openai.chat.completions.create({
        messages: [
          systemMessage,
          userMessage
        ],
        model: "gpt-4",
      });

      const apiResponse = completions.choices[0].message.content;

      const writeResult = await admin
        .firestore()
        .collection("messages")
        .add({
          who: who,
          what: what,
          how_learn: how_learn,
          timeline: timeline,
          skills: skills,
          goals: goals,
          design: design,
          dataset: dataset,
          additional: additional,
          plan: apiResponse, // Store the GPT response
          timestamp: Date.now()
        });

      res.status(200).json({ result: `Message with ID: ${writeResult.id} added.` });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ error: "Failed to call OpenAI API" });
    }
  });
});

// // Take the text parameter passed to this HTTP endpoint and insert it into Firestore under the path /messages/:documentId/original
// exports.generateInstructions = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async () => {
//     const { plan, substep } = req.body;
//     console.log("Request body:", { plan, step, substep });

//     const generateInstructions = async (plan, substep) => {
//       try {
//         const completions = await openai.chat.completions.create({
//           messages: [
//             systemMessage,
//             {
//               role: 'user',
//               content: `Generate instructions for substep: ${substep}`,
//             },
//           ],
//           model: "gpt-4",
//         });

//         const apiResponse = completions.choices[0].message.content;

//         // Update the plan with the generated instructions for the specific substep
//         const updatedPlan = JSON.parse(plan);
//         const steps = updatedPlan.Steps;
//         for (let i = 0; i < steps.length; i++) {
//           const step = steps[i];
//           if (step.Substeps.includes(substep)) {
//             step.Instructions = apiResponse;
//             break;
//           }
//         }
//         res.status(200).json({ result: steps });
//       } catch (error) {
//         res.status(500).json({ error: "Failed to call OpenAI API" });
//       }
//     };

//   })});
exports.generateInstructions = functions.https.onRequest(async (req, res) => {
  console.log("Function started");
  console.log("Complete Request Body:", req.body);  // Log the full request body

  cors(req, res, async () => {
      // Access the plan, step, and substep from req.body.data
      const { plan, step, substep } = req.body.data;
      console.log("Request body:", { plan, step, substep });

      const planString = typeof plan === 'string' ? plan : JSON.stringify(plan);
      console.log("Plan string:", planString);

      try {
          console.log("Calling OpenAI API...");
          const completions = await openai.chat.completions.create({
              messages: [
                  //systemMessage,
                  {
                      role: 'user',
                      content: `You are an educational tool guiding students through each step of the way through a project plan. Your job is to generate instructions for a given step. Here is the project plan: ${planString}. Generate detailed instructions for the following substep in the context of the provided plan: Step: ${step}, Substep: ${substep}. Can you also include a video link/ tutorial? `,
                  },
              ],
              model: "gpt-4",
          });

          const apiResponse = completions.choices[0].message.content;
          console.log("API Response:", apiResponse);

          // Wrapping the response in a data field
          const responseData = { data: { instructions: apiResponse } };
          console.log("Response data:", responseData);

          res.status(200).json(responseData);
      } catch (error) {
          console.error("Error calling OpenAI API:", error);
          res.status(500).json({ data: { error: error.message } });
      }

      console.log("Function finished");
  });
});

exports.addProjectTaskToPortfolio = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    // JSON object to insert
    const temp_json_tasks = {
      "Project Summary": "Design Portfolio Website",
      "Steps": [
        {
          "Step 1": "Set Up Development Environment",
          "Substeps": [
            "Download and install Visual Studio Code (VSCODE)",
            "Install Node.js and npm (Node Package Manager)",
            "Verify installation by running `node -v` and `npm -v` in the terminal"
          ]
        },
        {
          "Step 2": "Learn the Basics of HTML, CSS, and JavaScript",
          "Substeps": [
            "Complete an online course or tutorial on HTML, CSS, and JavaScript",
            "Practice by building simple static web pages",
            "Familiarize yourself with browser developer tools (F12 in most browsers)"
          ]
        },
        // Additional steps omitted for brevity...
      ],
      "Name": "Ishita"
    };

    try {
      // Reference to the specific document
      const userId = 'ishita'; // Document ID for Ishita
      const projectId = 'PersonalDesignPortfolio'; // Document ID for the Personal Design Portfolio

      // Reference to the 'PersonalDesignPortfolio' document in the 'Projects' collection
      const projectRef = admin.firestore().collection('users').doc(userId).collection('Projects').doc(projectId);

      // Insert the JSON object into Firestore
      await projectRef.set(temp_json_tasks);

      res.status(200).json({ result: `Project tasks added to 'PersonalDesignPortfolio' for user '${userId}'.` });
    } catch (error) {
      console.error("Error adding document to Firestore:", error);
      res.status(500).json({ error: "Failed to add project tasks to Firestore" });
    }
  });
});
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

// const systemMessage = {
//   role: "system",
//   content: `Can you make a plan for how to execute this project? Output only a JSON. 
//   The JSON should have the following feilds: Project Summary, Steps (and each step can have substeps), and Name 
//   This should be th format: 
// {
//   "Project Summary": "Biology Data Analysis",
//   "Steps": [
//     {
//       "Step 1": "Download VSCODE",
//       "Substeps": [
//         "Go to VSCODE.com",
//         "Download it"
//       ]
//     },
//     {
//       "Step 2": "Learn R",
//       "Substeps": [
//         "Download R",
//         "Learn R very well"
//       ]
//     },
//     {
//       "Step 3": "Learn Python",
//       "Substeps": [
//         "Download Python",
//         "Learn Python very well"
//       ]
//     }
//   ],
//   "Name": "Carolyn"
// }`
// };

// Take the text parameter passed to this HTTP endpoint and insert it into Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { who, what, how_learn, timeline, skills, goals, design, dataset, additional } = req.body.data.newFormData;

    // // Call GPT API
    // const userMessage = {
    //   role: 'user',
    //   content: `Who: ${who}, What: ${what}, How to Learn: ${how_learn}, Timeline: ${timeline}, Skills: ${skills}, Goals: ${goals}, Design: ${design}, Dataset: ${dataset}, Additional: ${additional}`
    // };

    // try {
    //   const completions = await openai.chat.completions.create({
    //     messages: [
    //       systemMessage,
    //       userMessage
    //     ],
    //     model: "gpt-4",
    //   });

    //   const apiResponse = completions.choices[0].message.content;

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
         // plan: apiResponse,
          timestamp: Date.now()
        });

      // TO DO: CRAFT SYSTEM + USER MESSAGE to get follow up qs
      // followuSystemMessage = {
      //     role: "system",
      //     content: "You are tasked with generating a plan specific to the user's individual needs to help them learn how to build a project with a limited programming background. Return this plan as a json and be as specific as possible."
      //   };

      followuSystemMessage = {
        role: "system",
        content: `You are tasked with generating a plan specific to the user's individual needs to help them 
        learn how to build a project with a limited programming background. What further information do you need
        from the user to accurately generate this plan? Return a json of the fewest number of questions you need to ask
        to achieve this in the following format:
        {
          "questions": [
            {
              "question": "What is the specific project you want to build?"
            },
            {
              "question": "What is your current level of programming knowledge?"
            },
            {
              "question": "What programming languages are you comfortable with?"
            },
            {
              "question": "Have you ever worked on a similar project before?" 
            },
            {
              "question": "What tools and software are you familiar with and comfortable using?"
            },
            {
              "question": "What resources are you currently using to learn programming?"
            }
          ]
        }`
      };

      const followupUserMesssage = {
          role: 'user',
          content: "This is the information you already have about the user. Only return a json in your response and no other words at all:"+
          `Who: ${who}, What: ${what}, How to Learn: ${how_learn}, Timeline: ${timeline}, Skills: ${skills}, Goals: ${goals}, Design: ${design}, Dataset: ${dataset}, Additional: ${additional}`
        };
    
      // const completions = await openai.chat.completions.create({
      //   messages: [
      //     followuSystemMessage,
      //     followupUserMesssage
      //   ],
      //   model: "gpt-4",
      // });
  
      //const apiResponse = completions.choices[0].message.content;

      // res.status(200).json({ result: apiResponse});
      res.status(200).json({ result: `{
          "questions": [
            {
              "question": "What is the specific project you want to build?"
            },
            {
              "question": "What is your current level of programming knowledge?"
            },
            {
              "question": "What programming languages are you comfortable with?"
            },
            {
              "question": "Have you ever worked on a similar project before?" 
            },
            {
              "question": "What tools and software are you familiar with and comfortable using?"
            },
            {
              "question": "What resources are you currently using to learn programming?"
            }
          ]
        }`});
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ error: "Failed to call OpenAI API" });
    }
  });
});
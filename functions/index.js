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
  content: `Can you make a plan for how to execute this project? Output only a JSON. 
  The JSON should have the following feilds: Project Summary, Steps (and each step can have substeps), and Name 
  This should be th format: 
{
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
}`
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

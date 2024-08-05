// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions/v1');
const cors = require('cors')({ origin: true });
require('dotenv').config();

// Setup the OpenAI API
// const API_KEY = "sk-proj-0MAh3JhaG59omGtWDpzJT3BlbkFJKj1tH72rspC2sFyhymHT";
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY });

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const systemMessage = {
  "role": "system",
  "content": "Explain all concepts like you are a pirate."
}


// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    cors(req, res, async() => {
      const {who,what,how_learn,timeline,skills,goals,design,dataset,additional} = req.body.data.newFormData;

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
        timestamp: Date.now()
      });

      res.status(200).json({ result: `Message with ID: ${writeResult.id} added.` });
    });
  });

// // Take the text parameter passed to this HTTP endpoint and insert it into
// // Firestore under the path /messages/:documentId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async() => {
//     const original = req.body.data.text;

//     const userMessage = {
//         role: 'user',
//         content: original
//       };
    
//     // Call GPT API
//     const completions = await openai.chat.completions.create({
//         messages: [
//           systemMessage,
//           userMessage
//         ],
//         model: "gpt-4o",
//       });
//       const apiResponse = (completions.choices[0].message.content);
    
//     const writeResult = await admin
//      .firestore()
//      .collection("messages")
//      .add({
//       message: apiResponse || null,
//       sender: "assistant",
//       timestamp: Date.now()
//     });

//     const writeResult2 = await admin
//      .firestore()
//      .collection("messages")
//      .add({ original: original || null,
//         sender: "user",
//         timestamp: Date.now()
//      });

//     // Send back a message that we've successfully written the message
//     // need to get bck the uppercase field from the document in db
//     res.status(200).json({ result: `Message with ID: ${writeResult.id} added.` });
//   });
// });
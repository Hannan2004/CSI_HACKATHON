const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require('dotenv').config();

const apiKey = 'Your-api-key-here';
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
You are an AI legal assistant specializing in contract analysis. Your task is to analyze the given legal document, extract key clauses, identify potential risks, and summarize the contract.  
You must provide the response in a structured JSON format for easy rendering.  
If the contract text lacks relevant information, indicate that in the response instead of making assumptions.  

### **Response Format (JSON)**  
{  
"key_clauses": [  
    {"title": "Clause Name", "description": "Detailed explanation of the clause"},  
    {"title": "Clause Name", "description": "Detailed explanation of the clause"}  
],  
"risks_detected": [  
    {"risk": "Risk Type", "explanation": "Why this is a risk"},  
    {"risk": "Risk Type", "explanation": "Why this is a risk"}  
],  
"summary": "Brief summary of the contract in simple terms."  
}  
  `
});

// Optimize configuration for faster responses
const generationConfig = {
  temperature: 0.4,   // Reduced temperature for more deterministic responses
  topP: 0.85,        // Reduced topP for a narrower response distribution
  topK: 50,          // Reduced topK to consider fewer options
  maxOutputTokens: 1024, // Reduced tokens to speed up the response
  responseMimeType: "application/json",
};

async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file: ${file.displayName} as: ${file.name}`);
  return file;
}

async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
      let file = await fileManager.getFile(name);
      while (file.state === "PROCESSING") {
          process.stdout.write(".");
          await new Promise((resolve) => setTimeout(resolve, 10_000));
          file = await fileManager.getFile(name);
      }
      if (file.state !== "ACTIVE") {
          throw Error(`File ${file.name} failed to process`);
      }
  }
  console.log("...all files ready\n");
}

async function handleContractUpload(filePath, mimeType) {
  const files = [
      await uploadToGemini(filePath, mimeType),
  ];

  await waitForFilesActive(files);

  const chatSession = model.startChat({
      generationConfig,
      history: [
          {
              role: "user",
              parts: [
                  {
                      fileData: {
                          mimeType: files[0].mimeType,
                          fileUri: files[0].uri,
                      },
                  },
              ],
          },
      ],
  });

  const result = await chatSession.sendMessage("Analyse this contract.");
  console.log('Chat session result:', result);

  // Assuming result is already a JSON object
  return result.response.text;
}

module.exports = { handleContractUpload };
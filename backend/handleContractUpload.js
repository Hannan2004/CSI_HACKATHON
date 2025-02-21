const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
require('dotenv').config();

const apiKey = 'AIzaSyCGKZL92vJmqXUcR0W0TkOPOoPRbj0TW-o';
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

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

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
You are an AI legal assistant specializing in contract analysis. Your task is to analyze the given legal document, extract key clauses, identify potential risks, and summarize the contract.  
You will follow the ReAct (Reasoning + Action) framework to ensure a structured response:  

1. **Reasoning:** Think step by step about the contract's content and structure. Identify its key elements, important clauses, and potential risks.  
2. **Action:** Based on the reasoning, provide an analysis in a structured text format.  

---
### **Reasoning Process:**  
1. Read and understand the contract content.  
2. Identify key clauses and their implications.  
3. Detect any potential risks that might affect the involved parties.  
4. Summarize the contract in clear, simple terms.  

---
### **Contract Analysis Report**  

**Step 1: Summary**  
Summarize the contract in simple terms. Explain its purpose, key obligations, and important details.  

**Step 2: Key Clauses**  
- Clause Name: Explain its purpose and relevance.  
- Clause Name: Explain its purpose and relevance.  

**Step 3: Potential Risks**  
- Risk Type: Explain why this is a risk and its possible impact.  
- Risk Type: Explain why this is a risk and its possible impact.  

---
### **Contract Text:**  
<context>  
{context}  
</context>  

### **Question:**  
{input}    
  `
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

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

  const result = await chatSession.sendMessage("Analyse this given contract and clearly follow the given system instructions.");
  console.log('Chat session result:', result.response.text());

  return result.response.text();
}

module.exports = { handleContractUpload };
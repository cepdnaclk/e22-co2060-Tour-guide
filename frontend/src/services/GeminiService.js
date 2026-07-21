import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with Vite environment variable
// Fallback key handling if not set
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "DUMMY_KEY_REPLACE_ME";
const genAI = new GoogleGenerativeAI(API_KEY);

export const GeminiService = {
  
  /**
   * Evaluates the chat history and extracts travel intent into JSON,
   * while also providing the next conversational response.
   * 
   * @param {Array} chatHistory - Array of objects {text: string, isAI: boolean}
   * @param {Object} currentContext - The current trip context extracted so far
   * @returns {Promise<{ nextMessage: string, extractedContext: Object, isComplete: boolean }>}
   */
  processChat: async (chatHistory, currentContext) => {
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const systemPrompt = `
      You are an AI Travel Decision Engine assistant for a Sri Lanka travel app.
      Your goal is to extract the following trip parameters from the user's conversation naturally:
      - origin (string, or null if unknown)
      - destination (string, or null if unknown)
      - budget (number, e.g. 5000, or null if unknown)
      - vehicleType (string, e.g., bike, car, bus, or null if unknown)
      - interests (array of strings, e.g., ["Historical", "Nature"], or empty array)
      
      Current Extracted Context: ${JSON.stringify(currentContext)}
      
      Conversation so far:
      ${chatHistory.map(msg => `${msg.isAI ? 'Assistant' : 'User'}: ${msg.text}`).join("\n")}
      
      Instructions:
      1. Carefully analyze the conversation and the Current Extracted Context.
      2. If the user mentions a budget, extract the number. Ignore currency symbols.
      3. Merge any newly extracted details with the Current Extracted Context. Do not lose any previously extracted data.
      4. Check if we have ALL mandatory fields: origin, destination, budget, and vehicleType.
      5. If any mandatory field is missing (null or undefined), ask a short conversational question to get ONE of the missing fields. Do not ask for everything at once.
      6. If all mandatory fields are present, set "isComplete": true, and set "nextMessage" to "I have all the details! Generating your optimized trip now..."

      Return a JSON object in this exact format:
      {
        "nextMessage": "Your conversational reply here",
        "extractedContext": { 
          "origin": "string or null", 
          "destination": "string or null", 
          "budget": 2000, 
          "vehicleType": "string or null", 
          "interests": [] 
        },
        "isComplete": false
      }
      `;

      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(text);

    } catch (error) {
      console.error("Gemini API Error:", error);
      // Fallback behavior if API fails or key is missing
      return GeminiService._mockProcessChat(chatHistory, currentContext);
    }
  },

  // Mock fallback to prevent the app from breaking without an API key
  _mockProcessChat: (chatHistory, currentContext) => {
    let nextMessage = "";
    let isComplete = false;
    let newContext = { ...currentContext };

    const lastMsg = chatHistory[chatHistory.length - 1].text.toLowerCase();

    if (!newContext.origin || !newContext.destination) {
      // Mock extract Kandy to Kurunegala
      if (lastMsg.includes("kandy") || lastMsg.includes("kurunegala")) {
        newContext.origin = "Kandy";
        newContext.destination = "Kurunegala";
        nextMessage = "Great! You are traveling from Kandy to Kurunegala. What is your total budget in LKR?";
      } else {
        nextMessage = "I didn't quite catch that. Where are you traveling from, and where are you going?";
      }
    } else if (!newContext.budget) {
      if (lastMsg.match(/\d+/)) {
        newContext.budget = parseInt(lastMsg.match(/\d+/)[0], 10) || 3000;
        nextMessage = "Got the budget. How are you traveling? (Bike, Car, etc.)";
      } else {
        nextMessage = "Please specify a budget amount (e.g. 3000).";
      }
    } else if (!newContext.vehicleType) {
      newContext.vehicleType = "Bike";
      newContext.interests = ["Nature", "Historical"]; // hardcode mock interests
      nextMessage = "Got it, traveling by Bike. I have all the details! I am generating your trip now...";
      isComplete = true;
    }

    return { nextMessage, extractedContext: newContext, isComplete };
  }
};

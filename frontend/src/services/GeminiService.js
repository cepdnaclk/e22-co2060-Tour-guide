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
      3. Merge any newly extracted details with the Current Extracted Context. If the user explicitly provides a new route (e.g., "A to B" or "from A to B"), update both origin and destination accordingly.
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

  // Smart NLP fallback to extract context if Gemini API key is missing or network fails
  _mockProcessChat: (chatHistory, currentContext) => {
    let nextMessage = "";
    let isComplete = false;
    let newContext = { ...currentContext };

    const toTitleCase = (str) => {
      if (!str) return null;
      return str.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    };

    // Combine all user messages to extract context dynamically
    const userMessages = chatHistory
      .filter(m => !m.isAI)
      .map(m => m.text)
      .join(" ")
      .toLowerCase();

    const lastMsg = chatHistory[chatHistory.length - 1]?.text?.toLowerCase()?.trim() || "";

    // Expanded list of known Sri Lankan locations for fallback matching
    const knownLocations = [
      "colombo", "kandy", "jaffna", "galle", "kurunegala", "matale", "dambulla",
      "sigiriya", "nuwara eliya", "ella", "anuradhapura", "polonnaruwa",
      "trincomalee", "badulla", "batticaloa", "ratnapura", "hambantota", "negombo", "bentota", "mirissa",
      "chilaw", "matara", "kalutara", "tangalle", "hikkaduwa", "arugam bay", "pasikudah", "mannar",
      "vavuniya", "mullaitivu", "kilinochchi", "monaragala", "kegalle", "puttalam", "ampara"
    ];

    // 1. Extract Origin and Destination dynamically
    let matchedOrigin = null;
    let matchedDest = null;

    // Direct pattern check: "X to Y" or "from X to Y"
    const routeMatch = lastMsg.match(/(?:from\s+)?([a-z\s]+?)\s+to\s+([a-z\s]+?)(?:\s+(?:by|for|with|budget|on|in|rs|lkr|\d)|$)/i);

    if (routeMatch) {
      let rawOrigin = routeMatch[1].replace(/^(?:i\s+want\s+to\s+(?:go|travel)\s+)?(?:from\s+)?/i, '').trim();
      let rawDest = routeMatch[2].replace(/^(?:to\s+)?/i, '').trim();

      if (rawOrigin && rawDest && rawOrigin !== rawDest) {
        matchedOrigin = rawOrigin;
        matchedDest = rawDest;
      }
    }

    if (!matchedOrigin || !matchedDest) {
      // Sort location matches by position of appearance in lastMsg
      const mentionedLocations = knownLocations
        .filter(loc => lastMsg.includes(loc))
        .sort((a, b) => lastMsg.indexOf(a) - lastMsg.indexOf(b));

      if (mentionedLocations.length >= 2) {
        matchedOrigin = mentionedLocations[0];
        matchedDest = mentionedLocations[1];
      } else if (mentionedLocations.length === 1) {
        const loc = mentionedLocations[0];
        if (lastMsg.includes("from") || (!lastMsg.includes("to") && newContext.destination && !newContext.origin)) {
          matchedOrigin = loc;
        } else {
          matchedDest = loc;
        }
      }
    }

    if (matchedOrigin && matchedDest) {
      newContext.origin = toTitleCase(matchedOrigin);
      newContext.destination = toTitleCase(matchedDest);
    } else {
      if (matchedOrigin) newContext.origin = toTitleCase(matchedOrigin);
      if (matchedDest) newContext.destination = toTitleCase(matchedDest);
    }

    // 2. Extract Budget dynamically
    if (!newContext.budget) {
      // Match numbers like 10000, 10k, Rs 5000, Rs.2500, budget 10000
      const budgetMatch = lastMsg.match(/(?:rs\.?|lkr|budget)?\s*[:\-]?\s*(\d+[\d,]*)(?:k)?/i);
      if (budgetMatch) {
        let numStr = budgetMatch[1].replace(/,/g, '');
        let val = parseInt(numStr, 10);
        if (lastMsg.includes(`${budgetMatch[1]}k`)) val *= 1000;
        if (val >= 100) {
          newContext.budget = val;
        }
      }
    }

    // 3. Extract Vehicle Type dynamically
    if (!newContext.vehicleType) {
      if (userMessages.includes("bike") || userMessages.includes("riding") || userMessages.includes("motorcycle")) {
        newContext.vehicleType = "Bike";
      } else if (userMessages.includes("car") || userMessages.includes("driving") || userMessages.includes("auto")) {
        newContext.vehicleType = "Car";
      } else if (userMessages.includes("bus")) {
        newContext.vehicleType = "Bus";
      } else if (userMessages.includes("van")) {
        newContext.vehicleType = "Van";
      } else if (userMessages.includes("tuktuk") || userMessages.includes("tuk tuk") || userMessages.includes("three wheel")) {
        newContext.vehicleType = "TukTuk";
      } else if (userMessages.includes("train")) {
        newContext.vehicleType = "Train";
      }
    }

    // 4. Extract Person Count dynamically
    if (!newContext.personCount) {
      if (newContext.vehicleType === "Bike") {
        newContext.personCount = 2; // Default 2 people for Bike
      } else {
        const countMatch = lastMsg.match(/(\d+)\s*(?:persons?|people|travelers?|passengers?|pax)/i) || lastMsg.match(/\b([1-9])\b/);
        if (countMatch) {
          newContext.personCount = parseInt(countMatch[1], 10);
        } else if (userMessages.match(/(\d+)\s*(?:persons?|people|travelers?)/i)) {
          newContext.personCount = parseInt(userMessages.match(/(\d+)\s*(?:persons?|people|travelers?)/i)[1], 10);
        }
      }
    }

    // 5. Extract Interests dynamically
    if (!newContext.interests || newContext.interests.length === 0) {
      const interests = [];
      if (userMessages.includes("nature") || userMessages.includes("park")) interests.push("Nature");
      if (userMessages.includes("history") || userMessages.includes("historical") || userMessages.includes("temple") || userMessages.includes("fort")) interests.push("Historical");
      if (userMessages.includes("beach") || userMessages.includes("sea")) interests.push("Beach");
      if (userMessages.includes("waterfall")) interests.push("Waterfall");
      newContext.interests = interests.length > 0 ? interests : ["Nature", "Historical"];
    }

    // 6. Formulate next conversational response based on extracted state
    if (!newContext.origin || !newContext.destination) {
      if (newContext.origin && !newContext.destination) {
        nextMessage = `Got it! Starting from ${newContext.origin}. Where are you traveling to?`;
      } else if (!newContext.origin && newContext.destination) {
        nextMessage = `Awesome, traveling to ${newContext.destination}! Where are you starting from?`;
      } else {
        nextMessage = "I didn't quite catch your start and end locations. Where are you traveling from, and where are you going?";
      }
    } else if (!newContext.budget) {
      nextMessage = `Great! Traveling from ${newContext.origin} to ${newContext.destination}. What is your total budget in LKR?`;
    } else if (!newContext.vehicleType) {
      nextMessage = `Got the budget of Rs. ${newContext.budget}. How are you traveling? (Car, Bike, Bus, Van, TukTuk, etc.)`;
    } else if (!newContext.personCount && newContext.vehicleType !== "Bike") {
      nextMessage = `Got it, traveling by ${newContext.vehicleType}. How many people are traveling in total?`;
    } else {
      const pCount = newContext.personCount || (newContext.vehicleType === "Bike" ? 2 : 4);
      nextMessage = `I have all your details! Traveling from ${newContext.origin} to ${newContext.destination} by ${newContext.vehicleType} for ${pCount} persons with budget Rs. ${newContext.budget}. Generating your optimized trip now...`;
      isComplete = true;
    }

    return { nextMessage, extractedContext: newContext, isComplete };
  }
};

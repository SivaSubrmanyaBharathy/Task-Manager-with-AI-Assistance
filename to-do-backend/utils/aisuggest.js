const dotenv = require("dotenv");
dotenv.config();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getAISuggestion(taskDescription) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `As a productivity assistant, provide a helpful suggestion for this task: "${taskDescription}". 
                   Give practical advice on how to approach it, when to do it, or how to break it down. 
                   Keep it concise and actionable (max 2 sentences).`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "No suggestion available";
  } catch (error) {
    console.error("Error fetching AI suggestion:", error);
    return "Unable to generate suggestion at this time";
  }
}

module.exports = { getAISuggestion };
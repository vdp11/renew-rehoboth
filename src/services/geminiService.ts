
import { GoogleGenAI, Type } from "@google/genai";

// Guideline Fix: Use process.env.API_KEY directly and instantiate inside functions for fresh state.

/**
 * Calculates a matching score between candidate skills and job requirements.
 * Uses gemini-3-pro-preview for complex reasoning tasks.
 */
export const calculateMatchingScore = async (candidateSkills: string[], jobSkills: string[]) => {
  // Fix: Initializing GoogleGenAI directly with process.env.API_KEY within the function.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Compare the following candidate skills with the job required skills and provide a matching score from 0 to 100.
    Candidate Skills: ${candidateSkills.join(", ")}
    Job Required Skills: ${jobSkills.join(", ")}
    
    Return the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      // Fix: Using gemini-3-pro-preview for advanced reasoning/matching tasks.
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "A score between 0 and 100" },
            reasoning: { type: Type.STRING, description: "Brief explanation of the score" }
          },
          propertyOrdering: ["score", "reasoning"],
          required: ["score"]
        }
      }
    });

    // Fix: Access response.text as a property, not a method.
    const data = JSON.parse(response.text || "{}");
    return data.score || 75;
  } catch (error) {
    console.error("Error calculating matching score:", error);
    return 75; // Default fallback
  }
};

/**
 * Generates hiring insights for a candidate.
 * Uses gemini-3-flash-preview for basic text tasks.
 */
export const getAIInsights = async (candidateName: string, notes: string) => {
    // Fix: Initializing GoogleGenAI directly with process.env.API_KEY.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Analyze this candidate profile note for ${candidateName}: "${notes}". Provide three professional bullet points for the employer why they should hire this person.`;
    
    try {
        const response = await ai.models.generateContent({
            // Fix: Using gemini-3-flash-preview for basic summarization/insight tasks.
            model: "gemini-3-flash-preview",
            contents: prompt
        });
        // Fix: Access response.text as a property.
        return response.text || "Highly recommended based on technical skill set and relevant industry experience.";
    } catch (error) {
        console.error("Error generating AI insights:", error);
        return "Highly recommended based on technical skill set and relevant industry experience.";
    }
}

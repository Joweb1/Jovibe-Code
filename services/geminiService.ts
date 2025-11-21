
import { GoogleGenAI, Type } from "@google/genai";
import type { ChatMessage } from '../types';

// FIX: Initialize GoogleGenAI strictly with process.env.API_KEY as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    sourceDoc: {
      type: Type.STRING,
      description: "The complete, updated HTML source code, including <!DOCTYPE>, <html>, <head>, <body>, <style>, and <script> tags.",
    },
    summary: {
        type: Type.STRING,
        description: "A brief, friendly summary in markdown format of the changes you made to the code. Explain what you did to fulfill the user's request."
    }
  },
  required: ["sourceDoc", "summary"],
};

export async function generateCode(
  prompt: string,
  sourceDoc: string,
  chatHistory: ChatMessage[],
  image: { data: string; mimeType: string; } | null
): Promise<{ sourceDoc: string; summary: string; }> {
  
  const historyForPrompt = chatHistory.map(message => {
    return `${message.role}: ${message.content}`;
  }).join('\n');

  const fullPrompt = `
    You are an expert web developer AI. Your task is to modify an HTML document based on user requests.
    
    Analyze the user's request, the conversation history, and the current HTML document. Modify the document to fulfill the latest request.
    Return the complete, updated HTML document and a brief, friendly summary of the changes you made.
    Ensure the response is in the specified JSON format.
    Do not omit any code from the original document that should be kept.

    IMPORTANT: Preserve the original code's formatting, including indentation and line breaks. The updated code should be well-formatted and readable, not minified into a single line.

    Conversation History (for context):
    ---
    ${historyForPrompt}
    ---

    Most Recent User Request: "${prompt}"

    Current HTML Document:
    \`\`\`html
    ${sourceDoc}
    \`\`\`
  `;
  
  // FIX: Construct `contents.parts` conditionally to handle an optional image.
  // This avoids a TypeScript error that occurs when trying to add an image part
  // to an array that was inferred to contain only text parts.
  const textPart = { text: fullPrompt };
  const parts = image
    ? [
        {
          inlineData: {
            mimeType: image.mimeType,
            data: image.data,
          },
        },
        textPart,
      ]
    : [textPart];

  const contents = { parts };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Lower temperature for more predictable code generation
      },
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);

    if (parsedResponse.sourceDoc && parsedResponse.summary) {
        return parsedResponse;
    } else {
        throw new Error("AI response was missing required fields.");
    }

  } catch (error) {
    console.error("Error generating code with Gemini:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("The AI returned an invalid response. Please try again.");
    }
    throw new Error("Failed to get a valid response from the AI. Please check the console for details.");
  }
}

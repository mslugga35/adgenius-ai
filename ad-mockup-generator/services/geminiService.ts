
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates an ad mockup using the Gemini API.
 * @param base64ImageData The base64 encoded string of the product image (without data URL prefix).
 * @param mimeType The MIME type of the product image.
 * @param prompt The text prompt describing the desired ad format.
 * @returns A promise that resolves to the base64 encoded string of the generated image.
 */
export const generateAdMockup = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);
      if (imagePart && imagePart.inlineData) {
        return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
      }
    }

    throw new Error("No image was generated. The model may have refused the request.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate ad mockup. Please check the console for details.");
  }
};

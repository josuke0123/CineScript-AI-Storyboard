import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, GridSize, ImageResolution, UploadedAsset } from "../types";
import { fileToBase64 } from "../utils/imageSlicer";

const getAiClient = () => {
  // Use process.env.API_KEY directly as required
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Analyzes uploaded assets to create a cohesive style/character description.
 * Uses gemini-3-pro-preview for multimodal understanding.
 */
export const analyzeAssets = async (assets: UploadedAsset[]): Promise<string> => {
  if (assets.length === 0) return "";

  const ai = getAiClient();
  
  // Prepare contents: Text prompt + Images
  const parts: any[] = [
    { text: "Analyze these reference images. They are characters, scenes, or elements for a storyboard. Provide a concise but highly descriptive paragraph summarizing the visual style, character appearance (if any), and setting details. This description will be used to generate consistent new images." }
  ];

  for (const asset of assets) {
    const base64Data = await fileToBase64(asset.file);
    // Remove header usually present in dataURL "data:image/png;base64,..."
    const base64String = base64Data.split(',')[1];
    
    parts.push({
      inlineData: {
        mimeType: asset.file.type,
        data: base64String
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: "You are an expert cinematic visual consultant.",
        generationConfig: {
            temperature: 0.4
        }
      }
    });

    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Asset analysis error:", error);
    throw error;
  }
};

/**
 * Generates the storyboard grid image.
 * Uses gemini-3-pro-image-preview.
 */
export const generateStoryboardImage = async (
    userPrompt: string,
    analyzedContext: string,
    settings: { gridSize: GridSize; aspectRatio: AspectRatio; resolution: ImageResolution }
  ): Promise<string> => {
    const ai = getAiClient();
  
    // Construct a specialized prompt for grid generation
    const gridRows = settings.gridSize;
    const gridCols = settings.gridSize;
    
    // We want the model to generate a "contact sheet" or "comic layout"
    const enhancedPrompt = `
      Create a high-quality, cinematic storyboard sheet consisting of a ${gridRows}x${gridCols} grid of panels.
      
      Theme/Style Context (from uploaded assets):
      ${analyzedContext}
      
      Storyboard Script/Directive:
      ${userPrompt}
      
      REQUIREMENTS:
      - The output must be a single image subdivided into ${gridRows * gridCols} distinct panels arranged in a grid.
      - Maintain consistent character appearance and visual style across all panels.
      - Cinematic lighting, professional composition.
      - Do not include text bubbles or UI elements, just the visual scenes.
      - High detail, 8k resolution style.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: settings.aspectRatio,
            imageSize: settings.resolution,
          },
        },
      });
  
      // Iterate through candidates to find the image part
      for (const candidate of response.candidates || []) {
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
      }
      
      throw new Error("No image data returned from API");
    } catch (error) {
      console.error("Image generation error:", error);
      throw error;
    }
  };
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { profiles, VARIANT_GENERATOR_PROMPT } from "../constants/promts.js";



export const generatePost = async (sourceContent: string) => {
  const prompt = `
  SOURCE CONTENT:${sourceContent}

  TARGET PLATFORMS:${JSON.stringify(profiles)}

  Generate one variant for every target platform.
  `;

  const {text} = await generateText({
  model: google("gemini-2.5-flash"),
  instructions: VARIANT_GENERATOR_PROMPT,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: prompt,

        }
      ],
    },
  ],
});
  return JSON.parse(text)
};

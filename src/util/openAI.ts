import OpenAI from "openai";
import { envs } from "../config/environment.js";


const openai = new OpenAI({
  apiKey: envs.openAI.key,
});

export const openAI = async (imageUrl:string, text:string) => {
  const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: text },
            {type: "image_url", image_url: {url: imageUrl}},
          ], 
        },
      ],
    });
    return response.choices[0].message.content
}




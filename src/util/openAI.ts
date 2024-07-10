import OpenAI from "openai";

const openai = new OpenAI();

export const openAI = async () => {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What's in this image?" },
              {
                type: "image_url",
                image_url: {
                    url:'sdf'
                }
              },
            ],
          },
        ],
      });
      console.log(response.choices[0]);
}




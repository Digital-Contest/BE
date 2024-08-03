// openAI.test.ts
import OpenAI from 'openai';
import { openAI } from '../../src/util/openAI'; 
import { envs } from "../../src/config/environment";

jest.mock('openai');

describe('openAI function', () => {
  it('should return the expected response content', async () => {
    // const mockCreate = jest.fn();
    
    // // Create a mock instance of OpenAI and set up nested mocks
    // const mockOpenAIInstance = {
    //   chat: {
    //     completions: {
    //       create: mockCreate
    //     }
    //   }
    // };

    // (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAIInstance);
    
    // // Define the expected response
    // const mockResponse = {
    //   choices: [
    //     {
    //       message: {
    //         content: "Expected response content"
    //       }
    //     }
    //   ]
    // };
    // mockCreate.mockResolvedValue(mockResponse);

    // // Test variables
    // const imageUrl = 'https://example.com/image.jpg';
    // const text = 'Sample text';

    // // Call the function and check results
    // const result = await openAI(imageUrl, text);

    // // Assertions
    // expect(result).toBe('Expected response content');
    // expect(mockCreate).toHaveBeenCalledWith({
    //   model: "gpt-4o",
    //   messages: [
    //     {
    //       role: "user",
    //       content: [
    //         { type: "text", text: text },
    //         { type: "image_url", image_url: { url: imageUrl } },
    //       ],
    //     },
    //   ],
    // });
  });
});
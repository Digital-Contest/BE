import OpenAI from 'openai';
import { openAI } from '../../src/util/openAI'; 

const mockResponse = {
  choices:[
      {
        message: {
            content: 'This is the response content'
        }
      }
  ]
};

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockImplementation(async () => {
            return mockResponse;
          })
        }
      }
    };
  });
});



describe('openAI 테스트', () => {

  describe('openAI 함수 테스트', () => {

    it('openAI 함수', async () => {
      const imageUrl = 'https://example.com/image.jpg';
      const text = 'This is a test';
      const result = await openAI(imageUrl, text);
      expect(result).toBe('This is the response content');
    });
  });
});
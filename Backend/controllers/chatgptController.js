const { OpenAI } = require('openai');
const Question = require('../models/question');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatgpt = {
  messages: {
    post: async (config) => {
      const response = await openai.chat.completions.create({
        model: config.model ,
        messages: config.messages,
        max_tokens: config.max_tokens ,
        temperature: 0.7,
      });
      return { content: [{ text: response.choices[0].message.content }] };
    }
  }
};

exports.processChatGPTRequest = async (questionData) => {
  const question = new Question(questionData.question);
  
  try {
    console.log('Sending request to ChatGPT with question:', question.question);
    const response = await chatgpt.messages.post({
      model: 'gpt-3.5-turbo',
      max_tokens: 2000,
      messages: [{ role: 'user', content: question.question }],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('OpenAI API error details:', {
      message: error.message,
      status: error.status,
      data: error,
    });
    throw new Error('Error processing your request with ChatGPT: ' + error.message);
  }
};

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Question = require('../models/question');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper wrapper
const gemini = {
  messages: {
    post: async (config) => {
      try {
        const modelName = config.model ;
        const maxTokens = config.max_tokens ;
        const messageContent = config.messages[0].content;
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: messageContent }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
          }
        });

        const response = await result.response;
        return { content: [{ text: response.text() }] };

      } catch (err) {
        throw new Error("Error in Gemini model post(): " + err.message);
      }
    }
  }
};

// Main controller function
exports.processGeminiRequest = async (questionData) => {
  const question = new Question(questionData.question);

  if (!question.validate()) {
    throw new Error('Question is required');
  }

  try {
    console.log('Sending request to Gemini with question:', question.question);

    const response = await gemini.messages.post({
      model: 'gemini-pro',
      max_tokens: 1024,
      messages: [{ role: 'user', content: question.question }],
    });

    return response.content[0].text;

  } catch (error) {
    console.error('Gemini API error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    throw new Error('Error processing your request with Gemini: ' + (error.response?.data?.error?.message || error.message));
  }
};

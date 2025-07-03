const { Anthropic } = require('@anthropic-ai/sdk');
const Question = require('../models/question');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const claude = {
  messages: {
    post: async (config) => {
      try {
        const model = config.model ;
        const maxTokens = config.max_tokens ;
        const messageContent = config.messages[0].content;
        const response = await anthropic.messages.create({
          model,
          max_tokens: maxTokens,
          messages: [
            {
              role: 'user',
              content: messageContent,
            },
          ],
        });

        return { content: [{ text: response.content[0].text }] };
      } catch (err) {
        throw new Error('Error in Claude model post(): ' + err.message);
      }
    },
  },
};

exports.processClaudeRequest = async (questionData) => {
  const question = new Question(questionData.question);

  if (!question.validate()) {
    throw new Error('Question is required');
  }

  try {
    console.log('Sending request to Claude with question:', question.question);

    const response = await claude.messages.post({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: question.question }],
    });

    return response.content[0].text;

  } catch (error) {
    console.error('Claude API error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    throw new Error('Error processing your request with Claude: ' + (error.response?.data?.error?.message || error.message));
  }
};

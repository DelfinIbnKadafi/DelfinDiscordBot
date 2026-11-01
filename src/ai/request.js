// module
require('dotenv').config();

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const model = process.env.GROQ_MODEL;

async function request(prompt) {
    const response = await groq.chat.completions.create({
        model: model,
        messages: [
            {
                role: "system",
                content: "You are a helpful AI assistant."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        max_completion_tokens: 1024
    });

    return response;
}

module.exports = request;
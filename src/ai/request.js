// module
require('dotenv').config();

const fs = require("fs");
const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// config
const config = JSON.parse(fs.readFileSync("./data.json", "utf8"));

// request
async function request(prompt) {
    const response = await groq.chat.completions.create({
        model: config.ai.model,
        messages: [
            {
                role: "system",
                content: config.ai.systemPrompt
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
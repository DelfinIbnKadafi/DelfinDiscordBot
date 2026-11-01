const { SlashCommandBuilder } = require("discord.js");
const request = require("../ai/request");

// split message if lengt is more than 2000 char
function splitMessage(content, maxLength = 2000) {
  const chunks = [];

  for (let start = 0; start < content.length;) {
    let end = Math.min(start + maxLength, content.length);

    if (end < content.length) {
      for (let i = end; i >= start + 1910; i--) {
        if (content[i] === " ") {
          end = i;
          break;
        }
      }
    }

    if (
      end < content.length &&
      content.charCodeAt(end - 1) >= 0xD800 &&
      content.charCodeAt(end - 1) <= 0xDBFF &&
      content.charCodeAt(end) >= 0xDC00 &&
      content.charCodeAt(end) <= 0xDFFF
    ) {
      end--;
    }

    chunks.push(content.slice(start, end).trimEnd());
    start = end;

    while (content[start] === " ") start++;
  }

  return chunks;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask a question to the AI bot")
    .addStringOption(option =>
      option
        .setName("prompt")
        .setDescription("The question you want to ask")
        .setRequired(true)
    ),

  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");
    const response = await request(prompt);
    const answer = response.choices[0].message.content;
    if (typeof answer !== "string" || answer.length === 0) {
      throw new Error("The AI response did not contain any text.");
    }

    const chunks = splitMessage(answer);

    await interaction.reply(chunks[0]);
    for (const chunk of chunks.slice(1)) {
      await interaction.followUp(chunk);
    }
  }
};

module.exports.splitMessage = splitMessage;
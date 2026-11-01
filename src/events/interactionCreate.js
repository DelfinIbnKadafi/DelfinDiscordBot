const { MessageFlags } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    // Handle slash commands only; other interaction types are ignored.
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      // Reply differently if the interaction already has a response.
      console.error(error);

      const reply = {
        content: "An error occurred while executing this command.",
        flags: MessageFlags.Ephemeral
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  }
};
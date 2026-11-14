const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const req = require("../music/request");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play audio from a YouTube link")
    .addStringOption(option =>
      option
        .setName("youtube-link")
        .setDescription("The YouTube link to play")
        .setRequired(true)
    ),

  async execute(interaction) {
    if(!interaction.inGuild()) {
      return interaction.reply({
        content: "This command can only be used in a server that this bot joined.",
        flags: MessageFlags.Ephemeral,
      });
    }

    await interaction.deferReply();

    // check if player is not in a voice channel
    const guild = interaction.guild ?? await interaction.client.guilds.fetch(interaction.guildId);
    const member = await guild.members.fetch(interaction.user.id);

    if(!member.voice.channel) {
      return interaction.editReply("You must be in a voice channel!");
    }

    // request
    const channel = member.voice.channel;
    const channelid = channel.id;

    const result = await req.request(channelid, link);

    // vidio is not exist
    if(result === 0) return interaction.editReply("Cannot find YouTube video.");

    return interaction.editReply("Request successful!");
  }
};

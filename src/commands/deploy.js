require("dotenv").config();

const { REST, Routes } = require("discord.js");

// Keep deployed slash commands in sync with the command files.
const commands = [require("./ask").data];

// Check required environment values before making Discord API requests.
function createRest() {
  if (!process.env.DISCORD_TOKEN) {
    throw new Error("DISCORD_TOKEN is required. Add it to your .env file.");
  }
  if (!process.env.CLIENT_ID) {
    throw new Error("CLIENT_ID is required. Add it to your .env file.");
  }

  return new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
}

// Register slash commands globally for the bot's application.
async function deployCommands() {
  console.log("Deploying global slash commands...");

  await createRest().put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands.map(command => command.toJSON()) }
  );

  console.log("Successfully deployed global slash commands!");
}

// Print the slash commands currently registered with Discord.
async function checkCommands() {
  const deployedCommands = await createRest().get(
    Routes.applicationCommands(process.env.CLIENT_ID)
  );

  console.log(deployedCommands.map(command => command.name));
}

if (require.main === module) {
  deployCommands()
    .then(checkCommands)
    .catch(error => {
      console.error("Failed to deploy slash commands:", error);
      process.exitCode = 1;
    });
}

module.exports = { deployCommands, checkCommands };
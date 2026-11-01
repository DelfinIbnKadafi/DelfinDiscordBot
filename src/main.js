require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Collection, Events, ActivityType } = require("discord.js");

// Load every command file into the client's command collection.
function loadCommands(client) {
  const commandsPath = path.join(__dirname, "commands");

  for (const file of fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))) {
    const command = require(path.join(commandsPath, file));

    if (!command.data || typeof command.execute !== "function") continue;
    if (client.commands.has(command.data.name)) {
      throw new Error(`Duplicate command name: ${command.data.name}`);
    }

    client.commands.set(command.data.name, command);
  }
}

// Connect event files to the Discord client.
function loadEvents(client) {
  const eventsPath = path.join(__dirname, "events");

  for (const file of fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"))) {
    const event = require(path.join(eventsPath, file));

    if (!event.name || typeof event.execute !== "function") {
      throw new Error(`Invalid event module: ${file}`);
    }

    const listener = (...args) => event.execute(...args, client);
    if (event.once) {
      client.once(event.name, listener);
    } else {
      client.on(event.name, listener);
    }
  }
}

// Create the client, load its commands and events, then log in.
async function startBot(token = process.env.DISCORD_TOKEN) {
  if (!token) {
    throw new Error("DISCORD_TOKEN is required. Add it to your .env file.");
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.commands = new Collection();
  loadCommands(client);
  loadEvents(client);

  client.once(Events.ClientReady, async readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}`);

    try {
      await readyClient.user.setPresence({
        status: "online",
        activities: [
          {
            name: "Seeing the world.",
            type: ActivityType.Playing,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to set bot presence:", error);
    }
  });

  await client.login(token);
  return client;
}

if (require.main === module) {
  startBot().catch(error => {
    console.error("Failed to start the bot:", error);
    process.exitCode = 1;
  });
}

module.exports = { startBot, loadCommands, loadEvents };

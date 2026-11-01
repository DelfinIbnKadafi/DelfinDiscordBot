const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { Collection } = require('discord.js');
const { startBot, loadCommands, loadEvents } = require('../src/main');

async function run() {
  await assert.rejects(startBot(''), {
    message: 'DISCORD_TOKEN is required. Add it to your .env file.',
  });

  const client = new EventEmitter();
  client.commands = new Collection();

  loadCommands(client);
  loadEvents(client);

  assert.equal(client.commands.has('ask'), true);
  assert.equal(typeof require('../src/ai/request'), 'function');
  const [promptOption] = client.commands.get('ask').data.toJSON().options;
  assert.equal(promptOption.name, 'prompt');
  assert.equal(promptOption.description, 'The question you want to ask');
  assert.equal(promptOption.required, true);

  const { splitMessage } = client.commands.get('ask');
  const longAnswer = 'a'.repeat(2001);
  const chunks = splitMessage(longAnswer);
  assert.deepEqual(chunks.map(chunk => chunk.length), [2000, 1]);
  assert.equal(chunks.join(''), longAnswer);
  assert.ok(chunks.every(chunk => chunk.length <= 2000));

  const emojiAnswer = 'a'.repeat(1999) + '😀';
  const emojiChunks = splitMessage(emojiAnswer);
  assert.equal(emojiChunks[0].length, 1999);
  assert.equal(emojiChunks.join(''), emojiAnswer);
  assert.equal(client.listenerCount('interactionCreate'), 1);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
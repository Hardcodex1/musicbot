const {Client, Intents} = require("discord.js")
const music = require("./music2")
const music1 = require("./music1")
const music2 = require("./music")
const slashcommands = require("./slashcommands")
const slashcommands2 = require("./sc2")
const slashcommands1 = require("./sc1")

const client = new Client({
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
		'GUILD_VOICE_STATES',
	],
})

const client2 = new Client({
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
		'GUILD_VOICE_STATES',
	],
})

const client1 = new Client({
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
		'GUILD_VOICE_STATES',
	],
})


process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
  });

client.on("ready", async message =>
{
    console.log("Music Bots Ready")
	client.user.setActivity(`Streaming Youtube To Servers`, {
		type: "STREAMING",
		url: "https://www.twitch.tv/hardcodex1"
	  });
    music(client)
    slashcommands(client)
})

client2.on("ready", async message =>
{
    console.log("Music Bots Ready")
	client2.user.setActivity(`Streaming Youtube To Servers`, {
		type: "STREAMING",
		url: "https://www.twitch.tv/hardcodex1"
	  });
    music2(client2)
    slashcommands2(client2)
})

client1.on("ready", async message =>
{
    console.log("Music Bots Ready")
	client2.user.setActivity(`Streaming Youtube To Servers`, {
		type: "STREAMING",
		url: "https://www.twitch.tv/hardcodex1"
	  });
    music1(client1)
    slashcommands1(client1)
})

client.login(process.env.BOT_TOKEN)
client2.login(process.env.BOT_TOKEN1)
client1.login(process.env.BOT_TOKEN2)
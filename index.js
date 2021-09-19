const {Client, Intents} = require("discord.js")
const music = require("./music2")
const slashcommands = require("./slashcommands")
const client = new Client({
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

client.login(process.env.BOT_TOKEN)
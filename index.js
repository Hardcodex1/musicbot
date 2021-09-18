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

client.on("ready", async message =>
{
    console.log("ready")
    music(client)
    slashcommands(client)
})

client.login(process.env.BOT_TOKEN)
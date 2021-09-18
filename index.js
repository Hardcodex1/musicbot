const {Client, Intents} = require("discord.js")
const mongo = require("./mongo")
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
    await mongo()
    music(client)
    slashcommands(client)
})

client.login("ODc1NzgxMDgwODg2Njk3OTg0.YRagsA.csVIG4ZX01K3iDAFITJAcBNQ6eU")
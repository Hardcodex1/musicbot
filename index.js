const {Client, Intents} = require("discord.js")
const music = require("./music")
const slashcommands = require("./slashcommands")
const mongo = require("./mongo")
const afk = require("./afk")
const chatBot = require("./chatbot")
const funper = require("./funPercentage")
const help = require("./help")
const levels = require("./levels")
const mod = require("./moderation")
const fake = require("./fake")
const image = require("./image")
const keepAlive = require("./server")
const tickets = require("./tickets")
const guesswho = require("./guesswho")
const prefix = require("./prefix")
const reddit = require("./reddit")
const bump = require("./bumpreminder")

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
	client.user.setActivity(`Running your Servers | !helpC`, {
     type: "STREAMING",
     url: "https://www.twitch.tv/hardcodex1"
   });
    await mongo()
    music(client)
    slashcommands(client)
    afk(client)
    chatBot(client)
    funper(client)
    help(client)
    levels(client)
    mod(client)
    fake(client)
    image(client)
    guesswho(client)
    tickets(client)
    bump(client)
})

keepAlive()
client.login(process.env.BOT_TOKEN)

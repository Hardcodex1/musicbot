const command = require("./command")
const { QueueRepeatMode } = require("discord-player");

module.exports = bot =>
{
  command(bot, "deploy", async message => {

       if (message.author.id != "849905403021361162") return

        await message.guild.commands.set([
          {
                name: "play",
                description: "Plays a song from youtube",
                options: [
                    {
                        name: "query",
                        type: "STRING",
                        description: "The song you want to play",
                        required: true
                    }
                ]
            },
                        {
                name: "search",
                description: "Search Songs from youtube",
                options: [
                    {
                        name: "query",
                        type: "STRING",
                        description: "The Song Name You Want To Search",
                        required: true
                    }
                ]
            },
            {
                name: "volume",
                description: "Sets music volume",
                options: [
                    {
                        name: "amount",
                        type: "INTEGER",
                        description: "The volume amount to set (0-100)",
                        required: false
                    }
                ]
            },
            {
                name: "seek",
                description: "Seek Music To Position",
                options: [
                    {
                        name: "amount",
                        type: "STRING",
                        description: "The Seek Position (Eg: 2:30)",
                        required: true
                    }
                ]
            },
            {
                name: "remove",
                description: "Remove A Song From Queue",
                options: [
                    {
                        name: "postion",
                        type: "INTEGER",
                        description: "The Song Postion (Queue Postion)",
                        required: true
                    }
                ]
            },
            {
                name: "jump",
                description: "Jump To A Song In Queue",
                options: [
                    {
                        name: "postion",
                        type: "INTEGER",
                        description: "The Song Postion (Queue Postion)",
                        required: true
                    }
                ]
            },
            {
                name: "loop",
                description: "Sets loop mode",
                options: [
                    {
                        name: "mode",
                        type: "INTEGER",
                        description: "Loop type",
                        required: true, 
                        choices: [
                          {
                                name: "Off",
                                value: QueueRepeatMode.OFF
                            },
                            {
                                name: "Track",
                                value: QueueRepeatMode.TRACK
                            },
                            {
                                name: "Queue",
                                value: QueueRepeatMode.QUEUE
                            },
                            {
                                name: "Autoplay",
                                value: QueueRepeatMode.AUTOPLAY
                            }
                        ]
                    }
                ]
            },
            {
                name: "skip",
                description: "Skip to the current song"
            },
            {
                name: "clear",
                description: "Clear The Queue"
            },
            {
                name: "queue",
                description: "See the queue"
            },
            {
                name: "shuffle",
                description: "Shuffle The Queue"
            },
            {
                name: "pause",
                description: "Pause the current song"
            },
            {
                name: "resume",
                description: "Resume the current song"
            },
            {
                name: "stop",
                description: "Stop the player"
            },
            {
                name: "back",
                description: "Play The Previous Track"
            },
            {
                name: "np",
                description: "Now Playing"
            },
            {
                name: "ping",
                description: "Shows bot latency"
            },
        ])

        await message.reply("Deployed!");
 })
}
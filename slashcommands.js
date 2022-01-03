const command = require("./command")
const { Player, QueryType, QueueRepeatMode } = require("discord-player");

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
                name: "soundcloud",
                description: "Plays a song from soundcloud",
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
                name: "247",
                description: "Enable/Disable 24/7 Mode",
                options: [
                    {
                        name: "option",
                        type: "STRING",
                        description: "24/7 on or off",
                        required: true, 
                        choices: [
                          {
                                name: "Off",
                                value: "off"
                            },
                            {
                                name: "On",
                                value: "On"
                            },
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
            {
                name: "bassboost",
                description: "Add BassBoost Filter"
            },
            {
                name: "help",
                description: "Help Menu",
                options: [
                  {
                    name: "option",
                    description: "menu name",
                    type: "STRING",
                    choices: [
                      {
                        name: "mod",
                        value: "mod",
                      },
                      {
                        name: "fun",
                        value: "fun",
                      },
                      {
                        name: "main",
                        value: "main",
                      },
                      {
                        name: "music",
                        value: "music",
                      },
                      {
                        name: "image",
                        value: "image",
                      },
                      {
                        name: "giveaway",
                        value: "giveaway",
                      },
                      {
                        name: "util",
                        value: "util",
                      },
                    ]
                  }
                ]
            },
            {
                name: "user info",
                type: 3
            },
            {
                name: "trigger",
                type: 3
            },
            {
                name: "avatar",
                type: 3
            },
            {
                name: "hug",
                type: 3
            },
            {
                name: "purge user 20",
                type: 3
            },
            {
                name: "fake",
                description: "Fake Messages",
                options: [
                  {
                  name: "user",
                  description: "User Who You Want To Fake",
                  type: "USER",
                  required: true
                  },
                  {
                  name: "message",
                  description: "Message That You Will Fake",
                  type: "STRING",
                  required: true
                  }
                ]
            },
        ])

        await message.reply("Deployed!");
 })
}
const command = require("./command")
const {QueueRepeatMode } = require("discord-player");


module.exports = client => {
    command(client, "deploy", message =>
    {
        message.guild.commands.set([
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
                name: "queue",
                description: "See The Songs In Queue"
            },
            {
                name: "lyrics",
                description: "lyrics for current song"
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
             name: "filter",
             description: "Sets loop mode",
             options: [
                 {
                     name: "type",
                     type: "STRING",
                     description: "Filter type",
                     required: true,
                     choices: [
                         {
                             name: "bassboost",
                             value: "bassboost_high"
                         },
                         {
                             name: "8D",
                             value: "8D"
                         },
                         {
                             name: "reverse",
                             value: "reverse"
                         },
                         {
                             name: "vaporwave",
                             value: "vaporwave"
                         }
                     ]
                 }
             ]
          },
        ])
    })
}
const DisTube = require("distube")
const command = require(`./command`)
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const {Client, MessageActionRow, MessageSelectMenu} = require("discord.js")
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({
	intents: [
		'GUILDS',
		'GUILD_MESSAGES',
		'GUILD_VOICE_STATES',
	],
})

const distube = new DisTube.default(client, {
    searchSongs: 10,
    searchCooldown: 30,
    leaveOnEmpty: true,
    emptyCooldown: 0,
    leaveOnFinish: true,
    leaveOnStop: true,
    plugins: [new SoundCloudPlugin(), new SpotifyPlugin({
        parallel: true,
        emitEventsAfterFetching: false,
    })],
})


module.exports = client => {

    let resultMap = new Map()

    const sendEmbedError = message =>
   {
     const permissionEmbed = new MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Missing permission`)
      .addFields (
      {
        name: "This Command Could Not Be Exectued Cause 1 or more perms are missing",
        value: `${message}`
      }
      )
      return permissionEmbed;
   }

    client.on("interactionCreate", async interaction => {
        if (interaction.commandName == "play")
        {
            interaction.deferReply()
            var query = interaction.options.get("query").value
            
        const voice_channel = interaction.member.voice.channel;
        if (!voice_channel) return interaction.channel.send('You need to be in a voice channel to execute this command!');
        const permissions = voice_channel.permissionsFor(client.user);
        if (!permissions.has('CONNECT')) return interaction.followUp({embeds: [sendEmbedError('Bot does not have the correct permissions (Connect)')]});
        if (!permissions.has('SPEAK')) return interaction.followUp({embeds: [sendEmbedError('Bot does not have the correct permissions (Speak)')]});

        //if (voice_channel.id != interaction.guild.me.voice.channel.id) return interaction.followUp("You Need To Be In My Voice Channel")

        var result;
        if (query.includes("open.spotify"))
        {
            var options = {
                skip: false,
                unshift: false,
                member: interaction.member,
                textChannel: interaction.channel
            }

            distube.playVoiceChannel(interaction.member.voice.channel, query,options )
        }
        if (query.includes("playlist"))
        {
            interaction.followUp({content: "Adding Playlist Might Take Sometime..", ephermeral: true})
            var options = {
                limit: 10,
                type: "playlist",
            }
            result = await distube.search(query,options)
        }
        else if (query.includes("video"))
        {
            interaction.followUp({content: "Adding Song..", ephermeral: true})
            var options = {
                limit: 10,
                type: "video",
            }
            result = await distube.search(query,options)
        }
        else
        {
            interaction.followUp({content: "Adding Song..", ephermeral: true})
            var options = {
                limit: 10,
                type: "video",
            }
            result = await distube.search(query,options)
        }
            var options = {
            skip: false,
            unshift: false,
            member: interaction.member,
            textChannel: interaction.channel
        }
        let video = await distube.playVoiceChannel(interaction.member.voice.channel, result[0],options)
        }
        else if (interaction.commandName == "queue")
        {
        const voice_channel = interaction.member.voice.channel;
        if (!voice_channel) return interaction.channel.send('You need to be in a voice channel to execute this command!');
        const permissions = voice_channel.permissionsFor(client.user);
        if (!permissions.has('CONNECT')) return interaction.followUp({embeds: [sendEmbedError('Bot does not have the correct permissions (Connect)')]});
        if (!permissions.has('SPEAK')) return interaction.followUp({embeds: [sendEmbedError('Bot does not have the correct permissions (Speak)')]});


            const queue = distube.getQueue(interaction);
            let i = 0;
            queue.forEach(song => {
                if (i < 1)
                console.log(song)
                i++
            })
        interaction.channel.send('Current queue:\n' + queue.songs.map((song, id) =>
            `**${id+1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
        ).join("\n")).catch(err => {
            interaction.channel.send("Too Many Songs In Queue")
        })
        }
        else if (interaction.commandName == "search")
        {
            interaction.deferReply()
            var query = interaction.options.get("query").value
            
        const voice_channel = interaction.member.voice.channel;
        if (!voice_channel) return interaction.channel.send('You need to be in a voice channel to execute this command!');
        const permissions = voice_channel.permissionsFor(client.user);
        if (!permissions.has('CONNECT')) return interaction.followUp({embeds: [sendEmbedError('Bot does not have the correct permissions (Connect)')]});
        if (!permissions.has('SPEAK')) return interaction.followUp({embeds: [sendEmbedError('Bot does not have the correct permissions (Speak)')]});

        //if (voice_channel.id != interaction.guild.me.voice.channel.id) return interaction.followUp("You Need To Be In My Voice Channel")

        if (query.includes("playlist"))
        {
            interaction.followUp({content: "Adding Playlist Might Take Sometime..", ephermeral: true})
            var options = {
                skip: false,
                unshift: false,
            }
            distube.play(interaction,query,options)
        }
        else if (query.includes("video"))
        {
            interaction.followUp({content: "Adding Song..", ephermeral: true})
            var options = {
                limit: 10,
                type: "video",
            }
            distube.search(query,options)
        }
        else
        {
            interaction.followUp({content: "Adding Song..", ephermeral: true})
            var options = {
                limit: 10,
                type: "video",
            }

            var result = await distube.search(query,options)
            resultMap.set(interaction.channel.id, result)
            console.log(resultMap.get(interaction.channel.id))
        }
            var options = {
            skip: false,
            unshift: false,
            member: interaction.member,
            textChannel: interaction.channel
        }

        const menuRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('musicSelectMenu')
                .setPlaceholder('Nothing selected')
                .addOptions([
                    {
                        label: '1',
                        description: `1`,
                        value: '1',
                    },
        {
                        label: '2',
                        description: "2",
                        value: '2',
                    },
        {
                        label: '3',
                        description: `3`,
                        value: '3',
                    },
        {
                        label: '4',
                        description: "4",
                        value: '4',
                    },
        {
                        label: '5',
                        description: "5",
                        value: '5',
                    },
        {
                        label: '6',
                        description: "6",
                        value: '6',
                    },
        {
                        label: '7',
                        description: '7',
                        value: '7',
                    },
        {
                        label: '8',
                        description: '8',
                        value: '8',
                    },
        {
                        label: '9',
                        description: '9',
                        value: '9',
                    },
        {
                        label: '10',
                        description: '10',
                        value: '10',
                    },
                ]),
        );

        interaction.followUp({content: `**Choose an option from below**\n${result.map((song, i) => `**${i + 1}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`, components: [menuRow]})
     }
    })

    distube.on("playSong", (queue, song) => queue.textChannel.send(
        `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
    ))

    distube.on("connect", (queue) =>
    {
        queue.textChannel.send("`Bot Connected..`")
    })

    distube.on("error", (channel, error) => channel.send(
        "An error encountered: " + error
    ))

    distube.on("initQueue", queue => {
        queue.autoplay = false;
        queue.volume = 100;
    })
    
    distube.on("addSong", (queue, song) => queue.textChannel.send(
        `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}.`
    ))
    
    distube.on("searchResult", (message, results) => {
        message.channel.send(`**Choose an option from below**\n${results.map((song, i) => `**${i + 1}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
    });
    

    distube.on("searchNoResult", (message, query) => message.channel.send(`No result found for ${query}!`));

    distube.on("searchCancel", (message) => message.channel.send(`Searching canceled`));

    client.on("interactionCreate", async interaction =>
    {
        if (!interaction.isSelectMenu() || interaction.customId != "musicSelectMenu") return;

        if (interaction.values[0] == "1")
       {
           var results = resultMap.get(interaction.channel.id)
           for (const [key, value] of Object.entries(results[2])) {
            console.log(`${value[0]}`);
          }
          
       }
    })

}

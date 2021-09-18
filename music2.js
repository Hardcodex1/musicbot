const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const { Player, QueryType, QueueRepeatMode } = require("discord-player");
const { Lyrics, Reverbnation } = require("@discord-player/extractor");
const lyricsClient = Lyrics.init();

module.exports = client =>
{
    const Musicrow = new MessageActionRow()
			.addComponents(
				new MessageButton()
			   .setCustomId('volume+')
				.setLabel('🔊')
				.setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId("loopQueue")
                .setLabel("🔁")
                .setStyle("PRIMARY"),
                new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("🔁")
                .setCustomId("loopSong"),
                new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("⏭️")
                .setCustomId("skip"),
                new MessageButton()
                .setStyle("DANGER")
                .setCustomId("stop")
                .setLabel("🛑")
			);

    const player = new Player(client);
    player.use("reverbnation", Reverbnation);
    const resultTracks = new Map()

    const embedSender = message =>
    {
        const embed = new MessageEmbed()
        .setTitle("🎵- Music")
        .setDescription(message)
        .setColor("#00FFFF")

        return embed
    }

    client.on("interactionCreate", async interaction =>
    {
        if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });

        if (interaction.commandName == "play")
        {
            var query = interaction.options.get("query").value

            const queue = player.createQueue(interaction.guild, {
                metadata: {
                    channel: interaction.channel,
                    requester: interaction.user,
                    vc: interaction.member.voice.channel,
                    leaveOnEmpty: false,
                    leaveOnEnd: false,
                    leaveOnStop: true,
                    autoSelfDeaf: true,
                    ytdlOptions: {
                        highWaterMark: 1024 * 1024 * 30,
                        requestOptions: {
                            headers: {
                                cookie: "CONSENT=YES+IN.en-GB+202003; VISITOR_INFO1_LIVE=aPSpIoREn04; LOGIN_INFO=AFmmF2swRQIhAO22-qcf5n5so82tQ2LhIVFH1ODciOHTMAfafQd3OUVhAiAmEexSwJyU_NZCYkOVeWQ2IUy96aK5NJA0MgczVbsLAg:QUQ3MjNmd1lkbnB0MGpmT0dhRkFEM1N2LWR6NW5raW0wM2MzSTloNmRXcjg3UVNncm9RLUNjNmR5bGJFV0RvUTJ0Z2hMTlhmX09XZFNNMk9hb3g4bWRQSVhHV1lGakdBWUZ5M2RKV3BjNllHbFBzRWl4VFNzN2cxbElLZkR2X0dUR0xJQkxhWHRLRzZBeDNaZkFiSUVLZHhKLTBZcW5ieHJxU0RLQVpZR0xaYmUyMW9ULVowb3p2UzNoSlVHRWVRT0JGNDFncENCaEQ2; PREF=tz=Asia.Calcutta&f6=40000000&f5=30000; APISID=e8EXWevsDQX3pqWF/AMeIxNthbXSRVHada; HSID=AqcLh6XAycGsY_Fbm; SAPISID=DbduP4-bxzJ8q_kh/Aw2nOsx0r-qvJAs6s; SSID=AZW1aawK8wOrQf5Tn; __Secure-1PAPISID=DbduP4-bxzJ8q_kh/Aw2nOsx0r-qvJAs6s; __Secure-3PAPISID=DbduP4-bxzJ8q_kh/Aw2nOsx0r-qvJAs6s; SID=AQhLEGt4hOeHSnS86BfpYU9jtoudKBOe62ZMHFG9UpRSBsMGZlDqJxgAI4nva9CjVSkuaQ.; __Secure-3PSID=AQhLEGt4hOeHSnS86BfpYU9jtoudKBOe62ZMHFG9UpRSBsMGTH-tKs5iCdXzLQSB8sURvA.; __Secure-1PSID=AQhLEGt4hOeHSnS86BfpYU9jtoudKBOe62ZMHFG9UpRSBsMG1nMZK1X5C96T90wr3_Pu0Q.; YSC=4Xqrlg8JJ5Y; SIDCC=AJi4QfEwmu0gPc8tbiyM37DdhZioVii7PghtvaigqD7uMBsZtrjjj2a5_vci6nMiYvi7hhu6XQ; __Secure-3PSIDCC=AJi4QfGiDv1C-XVaaqUvC_DJS009jaDDv63kU1ivVWDGK0xzHYqrp8aH6WCkhMCpJzCEUVR6evo",
                            }
                        }
                    }
                }
            })

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                queue.destroy();
                return await interaction.reply({ embeds: [embedSender("Could Not Join Your Voice Channel!")], ephemeral: true });
            }
            
            await interaction.deferReply();
        const track = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({embeds: [embedSender( `❌ | Track **${query}** not found!`)] });

        queue.play(track);

        return await interaction.followUp({embeds: [embedSender( `⏱️ | Loading track **${track.title}**!`)] , ephemeral: true});
        }
        else if(interaction.commandName == "queue")
        {
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply({embedSender: [embedSender("No Song Playing!")]})

            const currentTrack = queue.current;
            const tracks = queue.tracks.slice(0, 10).map((m, i) => {
            return `${i + 1}. **${m.title}** ([link](${m.url}))`;
           });

           return void interaction.reply({
            embeds: [
                {
                    title: "Server Queue",
                    description: `🔊: \`${queue.volume}\` \n🔁: \`${queue.repeatMode}\` \n\n${tracks.join("\n")}${
                        queue.tracks.length > tracks.length
                            ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`} \n`
                            : ""
                    }`,
                    thumbnail: queue.current.thumbnail,
                    fields: [{ name: "Now Playing", value: `**${currentTrack.title}** ([link](${currentTrack.url}))`}],
                    color: "#00FFFF"
                }
            ],
            components: [Musicrow]
        });
        }
        else if (interaction.commandName == "skip")
        {
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply({embeds: [embedSender("No Song Playing!")]})

            queue.skip()
            interaction.reply({embeds: [embedSender("Skipped The Song!")]})
        }
        else if (interaction.commandName == "volume")
        {
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply({embeds: [embedSender("No Song Playing!")]})

            const volume = interaction.options.get("amount").value

            queue.setVolume(volume)
            interaction.reply({embeds: [embedSender(`Volume Set To ${volume}`)]})
        }
        else if (interaction.commandName == "stop")
        {
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply({embeds: [embedSender("No Song Playing!")]})

            queue.stop()
            interaction.reply({embeds: [embedSender("Stopped The Music")]})
        }
        else if (interaction.commandName == "shuffle")
        {
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply({embeds: [embedSender("No Song Playing!")]})

            queue.shuffle()
            interaction.reply({embeds: [embedSender("Shuffled The Queue!")]})
        }
        else if (interaction.commandName == "seek")
        {
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply({embeds: [embedSender("No Song Playing!")]})

            const time = interaction.options.get("amount").value

            var timeParts = time.split(":");
            seekValue = (+timeParts[0] * 60000) + (+timeParts[1] * 1000)

            queue.seek(seekValue)
            interaction.reply({embeds: [embedSender(`Seeked To: ${time}`)]})
        }
        else if (interaction.commandName == "np")
        {
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply("No Song Playing")

            const progress = queue.createProgressBar();
            const perc = queue.getPlayerTimestamp();

            const embed = new MessageEmbed()
            .setTitle("**Now Playing**")
            .setDescription(`**Currently Playing:** \n${`[${queue.current.title}](${queue.current.url}) `}! (\`${perc.progress}%\`) \n\n Requested By: \n ${queue.current.requestedBy} \n\n 👀: ${queue.current.views} \n\n Duration: \`${queue.current.duration}\` `)
            .addFields(
            {
              name: "\u200b",
              value: progress
           })
            .setColor("#00FFFF")
            .setThumbnail(queue.current.thumbnail)

            interaction.reply({embeds: [embed], components: Musicrow})
        }
        else if (interaction.commandName == "back")
        {
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply({embeds: [embedSender("No Song Playing!")]})

            queue.back()
            interaction.reply({embeds: [embedSender("Playing The Previous Song!")]})
        }
        else if (interaction.commandName == "clear")
        {
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply({embeds: [embedSender("No Song Playing!")]})

            queue.clear()
            interaction.reply({embeds: [embedSender("Cleared The Queue")]})
        }
        else if(interaction.commandName == "lyrics")
        {
            interaction.deferReply()

            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return interaction.reply({embeds: [embedSender("No Song Playing!")]})

            const song = queue.current.title
            let lyricsData = " "

            lyricsData = await lyricsClient.search(song)
           .then(x => lyricsData = x)
           .catch(lyricsData = "Not Found")

           if (typeof lyricsData == "null" || lyricsData == null || !lyricsData) return interaction.followUp({embeds: [embedSender("Lyrics Not Found!")]})

           const embed = new MessageEmbed()
           .setTitle(`Lyrics For ${lyricsData.title}`)
           .setDescription(lyricsData.lyrics)
           .setThumbnail(lyricsData.image)
           .setColor("#00FFFF")

           interaction.followUp({embeds: [embed]})
        }
        else if (interaction.commandName == "search")
        {
            var query = interaction.options.get("query").value

            const result = await player.search(query, {
                metadata: interaction.user,
                searchEngine: QueryType.AUTO
            })

            let index = 0;
            let msg = ""
            let trackArr = []

            result.tracks.forEach(track =>
                {
                  if (index <= 10)
                  {
                    msg = msg + `${index + 1} \`${track.title} - ${track.duration}\` \nBy: \`${track.author}\` \n\n`
                    trackArr.push(track.url)
                  }
                  index++
                })

                const embed = new MessageEmbed()
                .setTitle("Search Results")
                .setDescription(msg)
                .setColor("RANDOM")

                const menuRow = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                    .setCustomId("musicSelectMenu")
                    .setPlaceholder("Select Option")
                    .addOptions([
                        {
                            label: "1",
                            description: `Song 1`,
                            value: `1`
                        },
                        {
                            label: "2",
                            description: `Song 2`,
                            value: `2`
                        },
                        {
                            label: "3",
                            description: `Song 3`,
                            value: `3`
                        },
                        {
                            label: "4",
                            description: `Song 4`,
                            value: `4`
                        },
                        {
                            label: "5",
                            description: `Song 5`,
                            value: `5`
                        },
                        {
                            label: "6",
                            description: `Song 6`,
                            value: `6`
                        },
                        {
                            label: "7",
                            description: `Song 7`,
                            value: `7`
                        },
                        {
                            label: "8",
                            description: `Song 8`,
                            value: `8`
                        },
                        {
                            label: "9",
                            description: `Song 9`,
                            value: `9`
                        },
                        {
                            label: "10",
                            description: `Song 10`,
                            value: `10`
                        }
                    ])
                    )

                interaction.reply({embeds: [embed], components: [menuRow]})

                resultTracks.set(interaction.channel.id, trackArr)
                setTimeout(()=> resultTracks.delete(interaction.channel.id), 1000 * 70)
        }
        else if (interaction.commandName == "loop")
        {
            await interaction.deferReply();
            const queue = player.getQueue(interaction.guild);
            if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });
            const loopMode = interaction.options.get("mode").value;
            const success = queue.setRepeatMode(loopMode);
            const mode = loopMode === QueueRepeatMode.TRACK ? "🔂" : loopMode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
            return void interaction.followUp({ content: success ? `${mode} | Updated loop mode!` : "❌ | Could not update loop mode!" });
        }
        else if (interaction.commandName == "filter")
        {
            await interaction.reply("Not Available Now")
            return
            const queue = player.getQueue(interaction.guild)
            if (!queue || !queue.playing) return void interaction.followUp({content: "No Music In Queue"})
            const filter = interaction.options.get("type").value
            if (filter == "bassboost")
            {
                await queue.setFilters({
                    bassboost: !queue.getFiltersEnabled().includes("bassboost"),
                    normalizer2: !queue.getFiltersEnabled().includes("bassboost") // because we need to toggle it with bass
                });
            }
            await queue.setFilters({
                filter: !queue.getFiltersEnabled().includes(filter),
            })

            return void interaction.followUp({ content: `🎵 | ${filter} ${queue.getFiltersEnabled().includes(filter) ? "Enabled" : "Disabled"}!` });
        }
    })

    player.on("trackStart", (queue, track) => 
{    
    var msg = `Playing \`${track.title}\` - \`${track.duration}\` \nRequested by: ${track.requestedBy} \n\n 🔊: \`${queue.volume}\` |        🔁: \`${queue.repeatMode}\``

    const values = {
      title: "Now Playing...",
      value: `${msg}`,
      thumbnail: `${track.thumbnail}`
    }

    const embed = new MessageEmbed()
    .setTitle(values.title)
    .setDescription(`${msg}`)
    .setThumbnail(values.thumbnail)
    .setColor("#00FFFF")

    queue.metadata.channel.send({embeds: [embed], components: [Musicrow]})
})

player.on("error", (queue, error) => {
    queue.metadata.channel.send({embeds: [embedSender(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`)]});
});
player.on("connectionError", (queue, error) => {
    queue.metadata.channel.send({embeds: [embedSender(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`)]});
});

player.on("trackAdd", async (queue, track) => {
    var msg = `Added ${track.title} - \`${track.duration}\` to the queue by ${track.requestedBy} \n\n 🔊: \`${queue.volume}\` |        🔁: \`${queue.repeatMode}\``
  
        const values = {
        title: "Song Added To Queue",
        value: `${msg}`,
        thumbnail: `${track.thumbnail}`
      }

      const embed = new MessageEmbed()
      .setTitle(values.title)
      .setDescription(`${msg}`)
      .setThumbnail(values.thumbnail)
      .setColor("#00FFFF")

      queue.metadata.channel.send({embeds: [embed]}).then(msg =>
      {
        setTimeout(() => msg.delete(), 30 * 1000)
      })
  })

player.on("queueEnd", queue =>
{
    queue.metadata.channel.send({embeds: [embedSender("Queue Empty")]})
})

client.on(`interactionCreate`, async interaction =>
{
    if (!interaction.isSelectMenu() || interaction.customId != "musicSelectMenu") return;

    if (interaction.customId == "musicSelectMenu")
    {
        songNo = interaction.values[0]
        await interaction.deferReply()

        let songs = resultTracks.get(interaction.channel.id)
        if (!songs) return interaction.followUp("This Search Has Expired")
        let songUrl = songs[songNo-1]

            let queue = player.getQueue(interaction.guild)
            if (!queue)
            {
                queue = player.createQueue(interaction.guild, {
                    metadata: {
                        channel: interaction.channel,
                        requestedBy: interaction.user,
                        leaveOnEmpty: false,
                        leaveOnEnd: false,
                        leaveOnStop: true,
                        autoSelfDeaf: true,
                        ytdlOptions: {
                            highWaterMark: 1024 * 1024 * 30,
                            requestOptions: {
                                headers: {
                                    cookie: "CONSENT=YES+IN.en-GB+202003; VISITOR_INFO1_LIVE=aPSpIoREn04; LOGIN_INFO=AFmmF2swRQIhAO22-qcf5n5so82tQ2LhIVFH1ODciOHTMAfafQd3OUVhAiAmEexSwJyU_NZCYkOVeWQ2IUy96aK5NJA0MgczVbsLAg:QUQ3MjNmd1lkbnB0MGpmT0dhRkFEM1N2LWR6NW5raW0wM2MzSTloNmRXcjg3UVNncm9RLUNjNmR5bGJFV0RvUTJ0Z2hMTlhmX09XZFNNMk9hb3g4bWRQSVhHV1lGakdBWUZ5M2RKV3BjNllHbFBzRWl4VFNzN2cxbElLZkR2X0dUR0xJQkxhWHRLRzZBeDNaZkFiSUVLZHhKLTBZcW5ieHJxU0RLQVpZR0xaYmUyMW9ULVowb3p2UzNoSlVHRWVRT0JGNDFncENCaEQ2; PREF=tz=Asia.Calcutta&f6=40000000&f5=30000; APISID=e8EXWevsDQX3pqWF/AMeIxNthbXSRVHada; HSID=AqcLh6XAycGsY_Fbm; SAPISID=DbduP4-bxzJ8q_kh/Aw2nOsx0r-qvJAs6s; SSID=AZW1aawK8wOrQf5Tn; __Secure-1PAPISID=DbduP4-bxzJ8q_kh/Aw2nOsx0r-qvJAs6s; __Secure-3PAPISID=DbduP4-bxzJ8q_kh/Aw2nOsx0r-qvJAs6s; SID=AQhLEGt4hOeHSnS86BfpYU9jtoudKBOe62ZMHFG9UpRSBsMGZlDqJxgAI4nva9CjVSkuaQ.; __Secure-3PSID=AQhLEGt4hOeHSnS86BfpYU9jtoudKBOe62ZMHFG9UpRSBsMGTH-tKs5iCdXzLQSB8sURvA.; __Secure-1PSID=AQhLEGt4hOeHSnS86BfpYU9jtoudKBOe62ZMHFG9UpRSBsMG1nMZK1X5C96T90wr3_Pu0Q.; YSC=4Xqrlg8JJ5Y; SIDCC=AJi4QfEwmu0gPc8tbiyM37DdhZioVii7PghtvaigqD7uMBsZtrjjj2a5_vci6nMiYvi7hhu6XQ; __Secure-3PSIDCC=AJi4QfGiDv1C-XVaaqUvC_DJS009jaDDv63kU1ivVWDGK0xzHYqrp8aH6WCkhMCpJzCEUVR6evo",
                                }
                            }
                        }
                    }
                });        
            }

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                queue.destroy();
                return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
            }

            const track = await player.search(songUrl, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            }).then(x => x.tracks[0]);
            if (!track) return await interaction.followUp({embeds: [embedSender( `❌ | Track **${query}** not found!`)] });
            interaction.followUp({embeds: [embedSender( `⏱️ | Loading track **${track.title}**!`)] , ephemeral: true});
            resultTracks.delete(interaction.channel.id)

            queue.play(track);
            }

})

client.on("interactionCreate", async interaction =>
{
    if (interaction.customId == "volume+")
    {
        let queue = player.getQueue(interaction.guild)
        if (!queue) return interaction.message.delete()
        queue.setVolume(queue.volume + 20)
        interaction.reply(`Volume Increased By 20 - ${interaction.user.username}`)
    }
    else if (interaction.customId == "loopQueue")
    {
        let queue = player.getQueue(interaction.guild)
        if (!queue) return interaction.message.delete()
        queue.setRepeatMode(QueueRepeatMode.QUEUE)
        interaction.reply(`Looping Queue - ${interaction.user.username}`)
    }
    else if (interaction.customId == "loopSong")
    {
        let queue = player.getQueue(interaction.guild)
        if (!queue) return interaction.message.delete()
        queue.setRepeatMode(QueueRepeatMode.TRACK)
        interaction.reply(`Looping Track - ${interaction.user.username}`)
    }
    else if (interaction.customId == "skip")
    {
        let queue = player.getQueue(interaction.guild)
        if (!queue) return interaction.message.delete()
        queue.skip()
        interaction.reply(`Skipped Song - ${interaction.user.username}`)
    }
    else if (interaction.customId == "stop")
    {
        let queue = player.getQueue(interaction.guild)
        if (!queue) return interaction.message.delete()
        queue.stop()
        interaction.reply(`Music Stopped - ${interaction.user.username}`)
    }
})
}

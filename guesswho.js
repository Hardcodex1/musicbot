const command = require("./command")
const db = require("quick.db")
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js")
const rpsSchema = require("./schemas/rps-Schema")

module.exports = bot =>
{
  const randomNum = message =>
  {
  var max = message;
  var num = Math.random() * max
  return index = Math.round(num)
  }

  const findMessage = async data =>
  {
    var sendMessage = {
      content: "a"
    }
    var msgAuthor
    var win = "false"
    var messages = await data.channel.messages.fetch()
    let msgs = Array.from(messages.values())
    var i = 0
    var index = await randomNum(msgs.length)
      msgs.forEach(message =>
    {
      i++
      if (i == index)
      {
        sendMessage = message
        console.log(sendMessage.content.length)
      }
    })

    const embed = new MessageEmbed()
    .setTitle(`Who Said This <a:Question:879997780196753449>`)
    .setDescription(`${sendMessage.content}`)
    .setColor(`#FFD700`)
    .setFooter(`You Have 30 Seconds To Guess ${data.author.username}, cancel to stop`)

    data.textChannel.send({embeds: [embed]})

    await db.set(`guesswho-${data.author.id}`, sendMessage.author.username.toLowerCase())

    const filter = m => (m.author.id == data.author.id)

    const max = 3
    var attempts = 2

    const collector = data.textChannel.createMessageCollector({max,filter, time: 1000 * 30 });

    collector.on("collect", async message =>
    {
      msgAuthor = await db.get(`guesswho-${message.author.id}`)
      if (!msgAuthor) return

      if (message.content == "cancel")
      {
        message.channel.send("Abort")
        collector.stop()
        return;
      }

      var guess = message.content.toLowerCase()

      var tagged = message.mentions.users.first()

      if (tagged)
      {
        guess = tagged.username.toLowerCase()
      }

      if (guess == msgAuthor)
      {
        win = "true"
        collector.stop()
        return
      }
      else
      {
        attempts--
        const embed = new MessageEmbed()
      .setTitle(`❌ Incorrect Guess, You Have ${+attempts + 1} chances remaining`)
        message.channel.send({embeds: [embed]})
        win = "false"
        return
      }
    })

    collector.on("end", async collected =>
    {
      if (win == "true")
      {
        const embed = new MessageEmbed()
      .setTitle(`You Guessed It Right! ✅`)

        data.textChannel.send({embeds: [embed]})
        db.delete(`guesswho-${data.author.id}`)
        return
      }

      await db.delete(`guesswho-${data.author.id}`)
      const embed = new MessageEmbed()
      .setTitle(`❌ Ohh No The Correct Answer Was ${msgAuthor}`)
      data.textChannel.send({embeds: [embed]})
    })
  }

  command(bot, "guesswho", message =>
  {
    var id
    var channel

    message.channel.send("Please Provide The Channel To Fetch Message From, use cancel to stop")

    const filter = m => (!m.content.startsWith('<#') || m.content == "cancel" || m.author.id == `${message.author.id}`);

    const max = 2

    const collector = message.channel.createMessageCollector({max,filter, time: 1000 * 60 });

    collector.on("collect", message =>
    {
      if (message.author.id == "863054469759631381") return

      if (message.content == "cancel")
      {
        message.channel.send("Process Abort")
        collector.stop()
        return;
      }

      var split1 = message.content.split("<#")
      var split2 = split1[1].split(">")
      id = split2[0]
      channel = message.guild.channels.cache.get(id)
    })

    collector.on("end", collected =>
    {
      message.channel.send(`Channel Set As <#${id}>`).then(msg =>
      {
        setTimeout(() => msg.edit("Thinking...."), 1000)
        setTimeout(() => msg.delete(), 2600)
        var data = {
          sentMsg: msg,
          channel: channel,
          author: message.author,
          textChannel: message.channel
        }
        setTimeout(() => findMessage(data), 2500)
      })
    })
  })

  //RPS

  command(bot, "rps", message =>
  {
    const row1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('accept')
					.setLabel("✅")
					.setStyle('PRIMARY'),
			)
      .addComponents(
				new MessageButton()
					.setCustomId('reject')
					.setLabel("❌")
					.setStyle('PRIMARY'),
			)

        var tagged = message.mentions.users.first()

        if (!tagged) return message.channel.send("Please Tag A User To Play With")

        message.channel.send({content: `${tagged.toString()}, ${message.author.toString()} Has Challenged You To A Game Of Rock Paper Scissors.\nTo Accept Challenge Click Button Below`, components: [row1]}).then(msg =>
        {
          setTimeout(function() {
             msg.delete().catch(err => null)
          },1000 * 75)
        })

        db.set(`rps-${tagged.id}`, message.author.id)
  })

  const startGame = async message =>
{
    var tagged = message.tagged

    const embed = new MessageEmbed()
      .setTitle("Rock Paper Scissors")
      .setDescription("**Paper:** 📄 \n\n**Rock:** 💎 \n\n**Scissors:** ✂️ \n\nPlease Select Any Of The Following Options \n**Player 1:** <a:loading:884501575681318953> \n**Player 2:** <a:loading:884501575681318953>")
      .setColor("#FFFF00")

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('rock')
					.setLabel("💎")
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('paper')
					.setLabel('📄')
					.setStyle('PRIMARY'),
			)
			.addComponents(
				new MessageButton()
					.setCustomId('Scissors')
					.setLabel('✂️')
					.setStyle('PRIMARY'),
			)

        var guild = bot.guilds.cache.get(message.guild.id)
        var user1 = guild.members.cache.get(message.author)

        user1.send({embeds: [embed], components: [row]})
        tagged.send({embeds: [embed], components: [row]})

        var data = {
            guildID: message.guild.id,
            creatorID: message.author,
            player1: message.author,
            player2: tagged.id,
            p1Choice: "none",
            p2Choice: "none"
        }

        await rpsSchema(data).save()
}

bot.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	if (interaction.customId == "rock" || interaction.customId == "paper" || interaction.customId == "Scissors")
    {
        var player;

        var check = await rpsSchema.find({
            player1: interaction.user.id
        })

        if (typeof check[0] == "undefined")

        check = await rpsSchema.find({
            player2: interaction.user.id
        })

        if (typeof check[0] == "undefined") return interaction.reply("No Game Running Currently")

        var player1 = check[0].player1
        var p1Choice = check[0].p1Choice
        var player2 = check[0].player2
        var p2Choice = check[0].p2Choice

        if (player1 == interaction.user.id)
        player = "player1"
        else
        player = "player2"

        if (player == "player1")
        {
            p1Choice = interaction.customId
        }
        else if (player == "player2")
        {
            p2Choice = interaction.customId
        }

        if (p1Choice != "none" && p2Choice != "none")
        {
            var final = 0;
            if (p1Choice == "rock")
            {
                if (p2Choice == "paper")
                {
                    final = 1;
                    console.log("paper")
                }
            }
            else if (p1Choice == "paper")
            {
                if (p2Choice == "Scissors")
                {
                    final = 1;
                }
            }
            else if (p1Choice == "Scissors")
            {
                if (p2Choice == "rock")
                {
                    final = 1;
                }
            }

            var guild = bot.guilds.cache.get(check[0].guildID)
            var user1 = guild.members.cache.get(player1)
            var user2 = guild.members.cache.get(player2)

            const embed = new MessageEmbed()
           .setTitle("Rock Paper Scissors")
           .setDescription(`**Paper:** 📄 \n\n**Rock:** 💎\n\n**Scissors:** ✂️ \n\nPlease Select Any Of The Following Options \n**Player 1:** ${p1Choice} \n**Player 2:** ${p2Choice}`)
           .setColor("#FFFF00")


            if (final == "0")
            {
                user1.send({content: "`You Have Won!!!!`", embeds: [embed]})
                user2.send({content: "`Sorry You Lost! Better Luck Next Time`", embeds: [embed]})
            }
            else 
            {
                user2.send({content: "`You Have Won!!!!`", embeds: [embed]})
                user1.send({content: "`Sorry You Lost! Better Luck Next Time`", embeds: [embed]})
            }

            await rpsSchema.deleteMany({
                creatorID: player1
            })
        }

        if (p1Choice == "none")
        p1Choice = "<a:loading:884501575681318953>"
        else if (p2Choice == "none")
        p2Choice = "<a:loading:884501575681318953>"

        const embed = new MessageEmbed()
        .setTitle("Rock Paper Scissors")
        .setDescription(`**Paper:** 📄 \n\n**Rock:** 💎\n\n**Scissors:** ✂️ \n\nPlease Select Any Of The Following Options \n**Player 1:** ${p1Choice} \n**Player 2:** ${p2Choice}`)
        .setColor("#FFFF00")

        interaction.message.edit({embeds: [embed], components: []})
        interaction.reply({content: "Choice Updated", ephemeral: true})

        await rpsSchema.findOneAndUpdate({
            player1: player1,
        },
        {
            p1Choice: p1Choice,
            p2Choice: p2Choice,
        })
    }
    else if (interaction.customId == "accept")
    {
        var result = await db.get(`rps-${interaction.user.id}`)

        if (typeof result == "null" || result == null) return interaction.reply({content: "This Button Is Not Ment For You!!", ephemeral: true})

        db.delete(`rps-${interaction.user.id}`)

        var data = {
            tagged: interaction.user,
            author: result,
            guild: interaction.guild
        }

        interaction.message.edit({content: "The Match Is Now Starting In DMS, Best Of Luck!", components: []})

        startGame(data)
    }
    else if (interaction.customId == "reject")
    {
        var result = await db.get(`rps-${interaction.user.id}`)

        if (typeof result == "null" || result == null) return interaction.reply({content: "This Button Is Not Ment For You!!", ephemeral: true})

        db.delete(`rps-${interaction.user.id}`)

        var data = {
            tagged: interaction.user,
            author: result,
            guild: interaction.guild
        }

        interaction.message.edit({content: "The Opponent Did Not Accept The Challenge", components: []})
    }
})
}
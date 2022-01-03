const Discord = require('discord.js')
const command = require("./command")
const mongo = require("./mongo")
const {MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js")
const db = require("quick.db")

module.exports = bot =>
{
  const getPrefix = message => {
  var prefix = db.get(`prefix-${message.guild.id}`)

  if (prefix == null || typeof prefix == "null")
  {
    prefix = "!"
  }
  return prefix
  }
  
  var msg

  const modEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Mod Help`)
      .setDescription("Here Are The Commands")
      .addFields (
      {
        name: "`!kick`  `!ban`  `!lock`  `!unlock`  `!clear`  `!backup`",
        value: "----------------------------------------"
      },

      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862897538309554186/caution.png")
      .setFooter("Use !setprefix to change prefix")

      const levelEmbed = new Discord.MessageEmbed()
      .setTitle(`Level Based Commands`)
      .setDescription("Here Are All The Commands For Levels \n`!level [on,off,help]` - To Turn On/Off Levels And Help \n`!lvlchannel` - Set A Channel For Level Up Messages \n`!lvlmsg <message>`Set A Custom Message For Level Ups\n`!leaderboard` - Display TOP 10 Server Members\n`!rank` - Display Your Current Rank Card \n`!lvlroles` - Add Custom level Up Roles For Your Server \n`!viewroles` - View The Roles Set For Level Up \n`!blacklistchannels` - Add No Xp Channels \n`!modifyrole[<level>-<role>]` - Use To Modify Roles \n`!deleterole [<level>-<role>]` - Use To Delete Roles Set \n`!resetlevel` - Use To Delete All The Level Data For Server")
    .setColor("#00FFFF")
    .setFooter("You Can Get A 5% Boost By Voting For The Bot, use `!vote`")
    .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/878913253466591252/10124651-removebg-preview.png")

      const giveawayEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`giveaway Help`)
      .setDescription("The Giveaway Commands Can Be A Little Unstable")
      .addFields (
      {
        name: "<:1143arrowturquoise:878921659820695622>`!g.setup`",
        value: "`This Command Will Launch An Interactive Setup And Hold A Normal Giveaway`"
      },
      //{
        //name: "`!g.warnChannel`",
        //value: "`This Command Will Setup A Particular Channel For Automatic Giveaway Warnings`"
      //},
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862897675082268682/1f389_1.png")
      .setFooter("Use !setprefix to change prefix")


       const musicEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Music Help`)
      .setDescription("Here Are The Commands")
      .addFields (
      {
        name: "<:1143arrowturquoise:878921659820695622>**[Music Commands]**",
        value: "`!play`  `!search`  `!np`  `!queue`  `!loopqueue` \n `!loopsong`  `!seek`  `!jump`  `!volume`  `!stop` \n `!pause`  `!resume` \n"
      },
      {
        name: "<:1143arrowturquoise:878921659820695622>**[Filter Commands]**",
        value: "`!bassboost`  `!nightcore`  `!reverse`  `!vaporwave`  `!flanger` \n `!karaoke`  `!earwax`  `!echo`\n"
      },
      {
        name: "<:1143arrowturquoise:878921659820695622>**[24/7 Music]** \n`!24/7 <on or off>` \n",
        value: "This Command Can Be Used By Premium Users And By Voting For The Bot. The Bot Will Stay 24/7 in VC unless turned OFF"
      },
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862910454120054834/unnamed.png")
      .setFooter("Use !setprefix to change prefix")

      const funEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Fun Help`)
      .setDescription("Here Are The Commands")
      .addFields (
      {
        name: "`!snipe`  `!emoji` `!youtube`  `!poker  `!chess`  `!checkers`  `!doodle`  `!afk`  `!fishing`  `!betrayal`  `!awkword`  `!spellcast` `!lettertile`  `!wordsnack`  !define`  `!dogfact`  `!catfact`  `!monkeyfact`  `!hug`  `!slap`  `!kiss`  `!lick`  `!pat`  `!gayrate`  `!simprate`  `!hornyrate`  `!ask`  `!nuke`",
        value: "----------------------------------------"
      },
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862898195578355722/Wink_Emoji_large.png")
      .setFooter("Use !setprefix to change prefix")

      const utilEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Utility Help`)
      .setDescription("Here Are The Commands")
      .addFields (
      {
        name: "`!ping`  `!prefix  `!dev`  `!server`,  `!support`  `!bugReport`  `!privacy`",
        value: "----------------------------------------"
      },
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862916074445471744/3-wrench-spanner-png-image-.png")
      .setFooter("Use !setprefix to change prefix")

      const imageEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Image Help`)
      .setDescription("Here Are The Commands")
      .addFields (
      {
        name: "`!meme`  `!avatar`  `!cat`  `!phub`  `!quote`  `!changeMind`  `!present`  `!delete`  `!ad`  `!rip`  `!affect`  `!confusedStonk`  `!circle`  `!color`  `!oh`  `!shit`  `!wasted`",
        value: "!text requires <text> and rest of the commands require <user ping>"
      },
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862973099816517652/camera-facebook.png")
      .setFooter("Use !setprefix to change prefix")

      const premiumEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Premium Help`)
      .setDescription("Here Are The Commands")
      .addFields (
      {
        name: "`Premium Is Totally Free The Only Requirement To Get Is To Vote The Bot`",
        value: "To Get Voting Link Use !vote and after voting use !claimVote to claim"
      },
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862916952190877706/gold.png")
      .setFooter("Use !setprefix to change prefix")

      const mainEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Main Help`)
      .setDescription("Here Are The Commands")
      .addFields (
      {
        name: "`!aichat <on,off>`",
        value: "Enable/Disable AI Chat Bot. Ping The Bot To Get Started" 
      },
      {
        name: "`!fake <user ping to fake> <text>`",
        value: "This Will Create A Fake Bot Instance Of User Pinged And Send With Text In Channel"
      },
      {
        name: "`!reddit`",
        value: "Setup For Reddit Posts"
      },
      {
        name: "`!reactionroles`",
        value: "Setup Reaction Roles For Your Server (menu based)"
      },
      {
        name: "`!tickets`",
        value: "Ticket Setup"
      },
      {
        name: "`!count`",
        value: "Counting Commands"
      },
      {
        name: "`!confess <confession> (channel version)`",
        value: "Will Create A confession embed and send in channel set with !confessChannel "
      },
      {
        name: "`!suggest <Suggestion>`",
        value: "Will Create An Embed With The Suggestion And Send With reactions in Channel set with !suggestChannel"
      },
      {
        name: "`!banner <ping>`",
        value: "Sends The Banner Of The Pinged User"
      },
      {
        name: "`!setup`",
        value: "Bump Reminder.... Yes u heard it right a bump reminder, run !setup to know more"
      },
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862917464173707264/1f525.png")
      .setFooter("Use !setprefix to change prefix")

      const helpEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Bot Commands Help`)
      .setDescription("Here Are The Commands")
      .addFields (
      {
        name: "`!helpC mod🔥`",
        value: "Shows All Moderation Commands"
      },
      {
        name: "`!helpC fun🤡`",
        value: "Shows All Fun Based Commands"
      },
      {
        name: "`!helpC util🔧`",
        value: "Shows All Utility Based Commands"
      },
      {
        name: "`!helpC main😊`",
        value: "Shows All Main Commands Of The Bot"
      },
      {
        name: "`!helpC levels ⬆️`",
        value: "Shows All level Based Commands"
      },
      {
        name: "`!helpC premium💛`",
        value: "Shows All Premium Details Of The Bot"
      },
      {
        name: "`!helpC Image📷`",
        value: "Shows All Image Generation Commands Of The Bot"
      },
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862917764419026964/Open_Book_Emoji_large.png")
      .setFooter("Use !setprefix to change prefix")

    let mod = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('🔥')
    .setCustomId("mod")

    let fun = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('🤡')
    .setCustomId("fun")

    let menu = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('🏠')
    .setCustomId("menu")

    let util = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('🔧')
    .setCustomId("util")

    let main = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('😊')
    .setCustomId("main")

    let premium = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('💛')
    .setCustomId("premium")

    let image = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('📷')
    .setCustomId("image")

    let giveaway = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('⬆️')
    .setCustomId("levels")

    let music = new MessageButton()
    .setStyle('SUCCESS')
    .setLabel('🎵')
    .setCustomId("music")

    let deleteButton = new MessageButton()
    .setStyle('DANGER')
    .setLabel('🗑️')
    .setCustomId("delete")


    const helpRow1 = new MessageActionRow()
    .addComponents(mod)
    .addComponents(fun)
    .addComponents(main)
    //.addComponent(premium)

    const helpRow2 = new MessageActionRow()
    .addComponents(util)
    .addComponents(image)
    .addComponents(giveaway)
    .addComponents(menu)
    .addComponents(deleteButton)

    const menuRow = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('selectMenu')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: '🔥 Moderation',
							description: 'All The Mod Commands For Your Server',
							value: 'modMenu',
						},
            {
							label: '🤡 Fun',
							description: 'All The Fun Commands For Your Server',
							value: 'funMenu',
						},
            {
							label: '😊 Main',
							description: 'All The Miain Commands Of Bot',
							value: 'mainMenu',
						},
            {
							label: '📷 Image',
							description: 'All The Image Commands For Your Server',
							value: 'imageMenu',
						},
            {
							label: '⬆️ Levels',
							description: 'All The Level Commands For Your Server',
							value: 'levelMenu',
						},
            {
							label: '🔧 Utility',
							description: 'All The Utility Commands For Your Server',
							value: 'utilMenu',
						},
					]),
			);

  command (bot, "helpC", async message =>
  {
    message.react("✅")
    var prefix = getPrefix(message)

    if (message.content == "helpC")
    {
      var cmd = message.content.replace(`${prefix}helpC`, " ")
      cmd = cmd.trim();
    }
    
     if (message.content == "help")
    {
      var cmd = message.content.replace(`${prefix}help`, " ")
      cmd = cmd.trim();
    }

    const helpEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Bot Commands Help`)
      .setDescription(`***The Prefix For This Server Is ${prefix}*** \n`)
      .addFields (
      {
        name: "`!helpC mod🔥`",
        value: "Shows All Moderation Commands"
      },
      {
        name: "`!helpC fun🤡`",
        value: "Shows All Fun Based Commands"
      },
      {
        name: "`!helpC util🔧`",
        value: "Shows All Utility Based Commands"
      },
      {
        name: "`!helpC main😊`",
        value: "Shows All Main Commands Of The Bot"
      },
      {
        name: "`!helpC premium💛`",
        value: "Shows All Premium Commands/features Of The Bot"
      },
      {
        name: "`!helpC Image📷`",
        value: "Shows All Image Generation Commands Of The Bot"
      },
      {
        name: "`!helpC level⬆️`",
        value: "Shows The Commands For The Levels"
      },
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/862917764419026964/Open_Book_Emoji_large.png")
      .setFooter("Use !setprefix to change prefix")

      if (cmd == "mod")
      try{message.channel.send(modEmbed)}
      catch{console.log("Error")}
      else if (cmd == "fun")
      try{message.channel.send(funEmbed)}
      catch{console.log("error")}
      else if (cmd == "util")
      try{message.channel.send(utilEmbed)}
      catch{console.log("error")}
      else if (cmd == "main")
      try{message.channel.send(mainEmbed)}
      catch{console.log("error")}
      else if (cmd == "premium")
      message.channel.send(premiumEmbed)
      else if (cmd == "level")
      message.channel.send(levelEmbed)
      else if (cmd == "image")
      message.channel.send(imageEmbed)
      else{
      message.channel.send({
      content: "Help Menu",
      embeds: [helpEmbed],
        components: [helpRow1,helpRow2, menuRow],
      }).then(msg =>
      {
        setTimeout(() => msg.delete(), 1000 * 60)
      })
      }
      
  })

  bot.on("interactionCreate", async(button) =>{
  if (button.customId == "mod")
  {
    await button.update({content: "Menu:", embeds: [modEmbed]})
  }
  else if (button.customId == "fun")
  {
    await button.update({content: "Menu:", embeds: [funEmbed]})
  }
  else if (button.customId == "premium")
  {
    await button.update({content: "Menu:", embeds: [premiumEmbed]})
  }
  else if (button.customId == "util")
  {
    await button.update({content: "Menu:", embeds: [utilEmbed]})
  }
  else if (button.customId == "main")
  {
    await button.update({content: "Menu:", embeds: [mainEmbed]})
  }
  else if (button.customId == "levels")
  {
    await button.update({content: "Menu:", embeds: [levelEmbed]})
  }
  else if (button.customId == "music")
  {
    await button.update({content: "Menu:", embeds: [musicEmbed]})
  }
  else if (button.customId == "image")
  {
    await button.update({content: "Menu:", embeds: [imageEmbed]})
  }
  else if (button.customId == "menu")
  {
    await button.update({content: "Menu:", embeds: [helpEmbed]})
  }
  else if (button.customId == "delete")
    {
      const user = await button.guild.members.fetch({user: button.user.id, force: true})

      if (user.permissions.has("MANAGE_MESSAGES"))
      {
        await button.send("Deleted")
        button.message.delete().catch(err => null)
        return;
        return;
      }
      else
      {
        await button.send("You Cannot Perform This Action")
        return;
      }
    }
})

bot.on("interactionCreate", async menu =>
{
  if (!menu.isSelectMenu()) return;

  if (menu.values[0] == "modMenu")
  {
    console.log(menu)
    await menu.update({content: "Menu", embeds: [modEmbed], ephemeral: true})
  }
  if (menu.values[0] == "funMenu")
  {
    await menu.update({content: "Menu", embeds: [funEmbed], ephemeral: true})
  }
  if (menu.values[0] == "mainMenu")
  {
    await menu.update({content: "Menu", embeds: [mainEmbed], ephemeral: true})
  }
  if (menu.values[0] == "imageMenu")
  {
    await menu.update({content: "Menu", embeds: [imageEmbed], ephemeral: true})
  }
  if (menu.values[0] == "levelMenu")
  {
    await menu.update({content: "Menu", embeds: [levelEmbed], ephemeral: true})
  }
  if (menu.values[0] == "utilMenu")
  {
    await menu.update({content: "Menu", embeds: [utilEmbed], ephemeral: true})
  }
  if (menu.values[0] == "musicMenu")
  {
    await menu.update({content: "Menu", embeds: [musicEmbed], ephemeral: true})
  }
})

bot.on("interactionCreate", interaction =>
{
  if (!interaction.isCommand() || !interaction.guildId) return;

  if (interaction.commandName == "help")
  {
    interaction.deferReply()
    var option = interaction.options.get("option")
    if (option)
    {
      option = option.value
    }
    if (!option)
    {
      interaction.followUp({content: "Help Menu", embeds: [helpEmbed], components: [helpRow1, helpRow2, menuRow]})
    }
    else if (option == "mod")
    {
      interaction.followUp({content: "Help Menu", embeds: [modEmbed], components: [helpRow1, helpRow2, menuRow]})
    }
    else if (option == "fun")
    {
      interaction.followUp({content: "Help Menu", embeds: [funEmbed], components: [helpRow1, helpRow2, menuRow]})
    }
    else if (option == "main")
    {
      interaction.followUp({content: "Help Menu", embeds: [mainEmbed], components: [helpRow1, helpRow2, menuRow]})
    }
    else if (option == "music")
    {
      interaction.followUp({content: "Help Menu", embeds: [musicEmbed], components: [helpRow1, helpRow2, menuRow]})
    }
    else if (option == "image")
    {
      interaction.followUp({content: "Help Menu", embeds: [imageEmbed], components: [helpRow1, helpRow2, menuRow]})
    }
    else if (option == "giveaway")
    {
      interaction.followUp({content: "Help Menu", embeds: [giveawayEmbed], components: [helpRow1, helpRow2, menuRow]})
    }
    else if (option == "util")
    {
      interaction.followUp({content: "Help Menu", embeds: [utilEmbed], components: [helpRow1, helpRow2, menuRow]})
    }
  }
})
}
const db = require("quick.db")
const command = require("./command")
const Discord = require('discord.js')

module.exports = bot =>
{
  const getPrefix = message => {
  var prefix = db.get(`prefix-${message.channel.guild.id}`)

  if (prefix == null || typeof prefix == "null")
  {
    prefix = "!"
  }
  return prefix
  }

  command(bot,"afkset", async message =>
  {
    var prefix = getPrefix(message)
    const check = await db.get(`afkPermission-${message.channel.guild.id}`)
    if (check != true)
    {
      message.channel.send("Sorry But AFK Is Disabled For This Server, Use !afkOn").then(msg => {
        setTimeout(() => msg.delete(), 2000)
      })
      return;
    }
    
    if (check == null)
    {
      message.channel.send("Sorry But AFK Is Disabled For This Server, Use !afkOn").then(msg => {
        setTimeout(() => msg.delete(), 2000)
      })
      return;
    }

    var userId = message.author.id
    var guildID = message.channel.guild.id
    var text = ""
    text = message.content.replace(`${prefix}afkset`, " ")
    text = text.trim() 
    await db.set(`afk-${userId}-${guildID}`, text)
    message.channel.send(`Your AFK Has Been Set As - ${text}`).then(msg => {
        setTimeout(() => msg.delete(), 2000)
    })

    if (message.channel.guild.me.permissions.has("MANAGE_NICKNAMES"))
    {
      if (message.member.permissions.has("MANAGE_NICKNAMES"))
      {
     let nickname = message.member.displayName
     nickname = "[AFK!] " + nickname 
     message.chnanel.guild.members.cache.get(message.author.id).setNickname(nickname).catch(err => {null})
      }
    }
    
  })

  bot.on("messageCreate", async message =>
  {
    if (message.author.bot) return;
    if (typeof message != "undefined" || message != null || typeof message != "null")
    {
      var guildID = message.channel.guild.id
    }
    if (db.has(`afk-${message.author.id}-${guildID}`))
    {
      if (message.content.toLowerCase().startsWith("!afkSet")) return;

      await db.delete(`afk-${message.author.id}-${guildID}`)
      message.channel.send("Nice You Are Back, I Have Removed Your Status").then(msg => {
        setTimeout(() => msg.delete(), 2000)
      })
      if (message.channel.guild.me.permssions.has("MANAGE_NICKNAMES"))
    {
      if (message.member.permissions.has("MANAGE_NICKNAMES"))
      {
     var nickname = message.member.displayName
     var replced = nickname.replace("[AFK!]", " ")
     nickname = replced.trim()
     message.member.setNickname(nickname).catch(err => {null})
      }
    }
    }

    if (message.mentions.users.first())
    {
      var pinged = message.mentions.users.first()
      var pingedID = pinged.id
      if (db.has(`afk-${pingedID}-${guildID}`))
    {
      message.channel.send(`${pinged.username} Is Afk And Left This Msg - ${db.get(`afk-${pingedID}-${guildID}`)}`,  {allowedMentions: {parse: []}}).then(msg => {
        setTimeout(() => msg.delete(), 2000)
      })
    }
    }

    
  })

  command(bot, "afkon", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD"))
    {
      message.channel.send("Only Mods With MANAGE SERVER perms or Admin Can Run This Command").then(msg => {
        setTimeout(() => msg.delete(), 2000)
      })
      return;
    }

    const check = await db.get(`afkPermission-${message.channel.guild.id}`)
    if (check == true)
    {
      message.channel.send("AFK Is Already Enabled").then(msg => {
        setTimeout(() => msg.delete(), 2000)
      })
      return;
    }

    var guildID = message.channel.guild.id;
    var value = true
    await db.set(`afkPermission-${guildID}`, value)
    message.channel.send("AFK Has Been Turned On For Your Server, use !afkOff to turn off").then(msg => {
        setTimeout(() => msg.delete(), 5000)
      })
  })

   command(bot, "afkoff", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD"))
    {
      message.channel.send("Only Mods With MANAGE GUILD perms or Admin Can Run This Command").then(msg => {
        setTimeout(() => msg.delete(), 2000)
      })
      return;
    }

    const check = await db.get(`afkPermission-${message.channel.guild.id}`)
    if (check == false)
    {
      message.channel.send("AFK Is Already Disabled").then(msg => {
        setTimeout(() => msg.delete(), 2000)
      })
      return;
    }

    var guildID = message.channel.guild.id;
    var value = false
    await db.set(`afkPermission-${guildID}`, value)
    message.channel.send("AFK Has Been Turned Off For Your Server, use !afkOn to turn on").then(msg => {
        setTimeout(() => msg.delete(), 2000)
      })
  })

  command(bot,"afk", message =>
  {
    const setupEmbed = new Discord.MessageEmbed()
            .setColor("#FFFFFF")
            .setTitle(`AFK Help`)
            .setDescription("Here Are The Commands")
            .addFields (
              {
                name: "`!afkSetup`  `!afkOn`  `!afkOff`",
                value: "--------------------------------"
              },
            )
            .setFooter(`Requested By: ${message.author.tag}`)
            message.channel.send({embeds: [setupEmbed]})
  })
}
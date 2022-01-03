const command = require("./command")
const db = require("quick.db")
const mongo = require("./mongo")
const levelSchema = require("./schemas/level-Schema")
const redis = require("./redis")
const {MessageEmbed, MessageAttachment} = require("discord.js")
const canvacord = require("canvacord");
const voterSchema = require("./schemas/voter-Schema")

module.exports = bot =>
{
  const talkedRecently = new Set();

  const embedSender = message =>
  {
    const embed = new MessageEmbed()
    .setTitle(`${message.title}`)
    .setDescription(`${message.value}`)
    .setFooter("Gain 5% 24 hour Boost By Voting For Nekie")
    .setColor("#00FFFF")

    return embed
  }

  const blacklistchannels = async message =>
  {
    var result = message.serverData
    var check = "false"

    if (result == undefined) return check

    if (!result) return check

    if (typeof result[0].blacklist == "undefined" || result[0].blacklist.length == 0) return check

    var blacklist = result[0].blacklist

    if (typeof blacklist == "undefined" || blacklist.length == 0) return check

    for(var i = 0; i < blacklist.length; i++)
    {
      if (blacklist[i] == message.channel)
      {
        check = "true"
        return check
      }
    }

    return check
  }

  const giverole = async message =>
  {
    var result = message.serverData

    if (result == undefined) return

    if (!result) return

    if (typeof result[0].roles == "undefined" || result[0].roles.length == 0) return

    var roles = result[0].roles

    if (!roles) return

   for (var i = 0; i<roles.length; i++)
   {
     if (!roles[i]) {continue}

     const split = roles[i].split("-")

     if (split[0] == message.level)
     {
     var roleID = roles[i].trim()
     var split1 = roleID.split("<@&")
     var split2 = split1[1].split(">")
     roleID = split2[0]
    var role = message.guild.roles.cache.get(roleID)
    message.member.roles.add(role)
     }
   }
  }

  const updateData = async message =>
  {
    await levelSchema.findOneAndUpdate(
    {
      guildUserID: `${message.author.id}-${message.guild.id}`,
    }, 
    {
      guildUserID: `${message.author.id}-${message.guild.id}`,
      userID: message.author.id,
      guildId: message.guild.id,
      level: message.level,
      xp: message.xp,
      reqXp: message.reqXp,
      guildID: message.guild.id,
      username: message.author.username,
      totalXp: message.totalXp
    }, 
    {
      upsert: true,
      new: true,
    })

    var channel = message.channel
    var msg = " "

    if (typeof message.serverData[0] == "undefined") return

    if (message.serverData[0].channelID)
    {
      channelID = message.serverData[0].channelID
      channel = message.guild.channels.cache.get(channelID)
    }

    if (message.serverData[0].message)
    {
      msg = message.serverData[0].message
    }

    if (message.nextLvl == "true")
    {
      setTimeout(function() {
        channel.send(`Congradulations ${message.author.toString()} On Reaching Level **${message.level}**, ${msg}`)
      }, 5000)
      giverole(message)
    }
  }

  bot.on("messageCreate", async message =>
  {
    if (message.author.bot) return

    if (message.guild)
    {
      if (message.content.startsWith("!")) return

      var check = "off"

      serverData = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof serverData[0] == "undefined") return

      if (serverData[0].status == undefined) return

        check = serverData[0].status

      if (check == "off" || check == undefined)
      {
        return;
      }

      if (talkedRecently.has(message.author.id)) {
      return;
      }

      var channelData = {
      channel: message.channel,
      serverData: serverData,
    }

      var channelCheck = await blacklistchannels(channelData)
      if (channelCheck == "true") return

      talkedRecently.add(message.author.id);
        setTimeout(() => {
          talkedRecently.delete(message.author.id);
        }, 30 * 1000);

      const userData = await levelSchema.find({
        guildUserID: `${message.author.id}-${message.guild.id}`
      })

      var voteResult = await voterSchema.find({
        voteID: message.author.id
      })

      var voted = "false"
      if (typeof voteResult[0] != "undefined")
      {
        vote = "true"
      }

     //Checking New User
      if (typeof userData[0] == "undefined")
      {
        var totalXp = (Math.floor(Math.random() * 39) + 1)
        var level = 0
        var reqXp = 150
        var nextLvl = "false"

        if (totalXp >= 40)
        {
          totalXp = 40
        }
        else if (totalXp < 10 && totalXp >= 6)
        {
          totalXp = 10
        }
        else if (totalXp > reqXp)
        {
          totalXp = reqXp
        }

        if (voted == "true")
        {
          totalXp = totalXp + (totalXp * 25)
        }

        if (totalXp >= 150)
        {
          reqXp = 8 * (2 ^ 2) + (85 * (2 + 1))
          level = 1
          nextLvl = "true"
        }

        const data = {
          reqXp: reqXp,
          level: level,
          nextLvl: nextLvl,
          xp: totalXp,
          author: message.author,
          guild: message.guild,
          channel: message.channel,
          serverData: serverData,
          member: message.member,
          totalXp: totalXp
        }

        updateData(data)
        return;
      }

      var xp = userData[0].xp
      var reqXp = 150
      if (typeof userData[0].reqXp != "undefined")
      {
        reqXp = userData[0].reqXp
      }

      var totalXp = (Math.floor(Math.random() * 39) + 1)

      if (totalXp >= 40)
        {
          totalXp = 40
        }
        else if (totalXp < 10)
        {
          totalXp = 10
        }
        else if (totalXp > reqXp)
        {
          totalXp = reqXp
        }

        totalXp = totalXp + xp

        if (voted == "true")
        {
          totalXp = totalXp + (totalXp * 25)
        }

        if (totalXp > reqXp)
        {
          totalXp = reqXp
        }

      if (totalXp >= reqXp)
      {
        var level = +userData[0].level
        var newLevel = +level + 1
        reqXp = 8 * ((+newLevel + 1) ^ 2) + (85 * (+newLevel + 1))
        var nextLvl = "true"

        const data = {
          reqXp: reqXp,
          level: newLevel,
          nextLvl: nextLvl,
          xp: 0,
          author: message.author,
          guild: message.guild,
          channel: message.channel,
          serverData: serverData,
          member: message.member,
          totalXp: totalXp
        }
        updateData(data)
        return;
      }
      else
      {
        var level = +userData[0].level
        reqXp = reqXp
        var nextLvl = "false"

        const data = {
          reqXp: reqXp,
          level: level,
          nextLvl: nextLvl,
          xp: totalXp,
          author: message.author,
          guild: message.guild,
          channel: message.channel,
          serverData: serverData,
          member: message.member,
          totalXp: totalXp
        }
        updateData(data)
        return;
      }
    }
  })

  command(bot, "level", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADIMINISTRATOR"))
    {
      return;
    }

    var split = message.content.split(" ")
    var cmd = split[1]

    if (cmd == "on")
    {
      await levelSchema.findOneAndUpdate({
        name: `server-${message.guild.id}`
      }, 
      {
        name: `server-${message.guild.id}`,
        serverID: message.guild.id,
        status: "on"
      },
      {
        upsert: true,
        new: true,
      })
      var data = {
        title: "Levels On!!",
        value: "Levels Up Starts, Go Earn Some XP!!!"
      }

      message.channel.send({embeds: [embedSender(data)]})
    }
    else if (cmd == "off")
    {
      
      await levelSchema.findOneAndUpdate({
        name: `server-${message.guild.id}`
      }, 
      {
        name: `server-${message.guild.id}`,
        serverID: message.guild.id,
        status: "off"
      },
      {
        upsert: true,
        new: true,
      })

      var data = {
        title: "Levels Off",
        value: "Level Up Stopped, To Delete All Data Use !lvlreset"
      }

      message.channel.send({embeds: [embedSender(data)]})
    }
    else
    {
      const embed = new MessageEmbed()
      .setTitle(`Level Based Commands`)
      .setDescription("Here Are All The Commands For Levels \n`!level [on,off,help]` - To Turn On/Off Levels And Help \n`!lvlchannel` - Set A Channel For Level Up Messages \n`!lvlmsg <message>`Set A Custom Message For Level Ups\n`!leaderboard` - Display TOP 10 Server Members\n`!rank` - Display Your Current Rank Card \n>`!lvlroles` - Add Custom level Up Roles For Your Server \n`!viewroles` - View The Roles Set For Level Up \n`!blacklistchannels` - Add No Xp Channels \n`!modifyrole[<level>-<role>]` - Use To Modify Roles \n`!deleterole [<level>-<role>]` - Use To Delete Roles Set \n`!resetlevel` - Use To Delete All The Level Data For Server")
    .setColor("#00FFFF")
    .setFooter("You Can Get A 5% Boost By Voting For The Bot, use `!vote`")
    .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/878913253466591252/10124651-removebg-preview.png")

    message.channel.send({embeds: [embed]})
    }
  })

  command(bot, "blacklistchannel", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADIMINISTRATOR"))
    {
      return;
    }

    var check = "off"

      resultCheck = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof resultCheck[0] == "undefined") return message.channel.send("Levels Are Disabled For This Server")

        check = resultCheck[0].status

      if (check == "off" || typeof check == "undefined")
      {
        return message.channel.send("Levels Are Disabled For This Server")
      }

    var channels = []

    var data = {
        title: "Blacklist Channels",
        value: "Please Mention The Channels After This Message \nUse stop when done"
      }

    message.channel.send({embeds: [embedSender(data)]})

    const filter = m => (m.content.startsWith('<#') || m.content == "stop" || m.author.id == `${message.author.id}`);

    const collector = message.channel.createMessageCollector({filter ,time: 1000 * 500 });

    collector.on("collect", m =>
    {
      if (m.author.id == "862304613185093642") return

      if (m.content == "stop")
      {
        collector.stop()
        message.channel.send("Stopped")
        return
      }

      const split = m.content.split("<#")
      const split2 = split[1].split(">")
      var channelID = split2[0]
      channels.push(channelID)
      m.react("✅")
    })

    collector.on("end", async collected =>
    {
      if (channels.length == 0) return message.channel.send("No Input, Process Abort")

      await levelSchema.findOneAndUpdate(
      {
        name: `server-${message.guild.id}`
      }, 
      {
        name: `server-${message.guild.id}`,
        serverID: message.guild.id,
        $addToSet: {
          blacklist: channels
        }
      },
      {
        upsert: true,
        new: true,
      })

      var data = {
        title: "Blacklisted Channels",
        value: "Added Blacklist Channels"
      }

      message.channel.send({embeds: [embedSender(data)]})
    })
  })

  command(bot, "lvlchannel", async message =>
  {
    if (message.member.permissions.has("MANAGE_GUILD") || message.member.permissions.has("ADIMINISTRATOR"))
    {
      var check = "off"

      resultCheck = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof resultCheck[0] == "undefined") return message.channel.send("Levels Are Disabled For This Server")

        check = resultCheck[0].status

      if (check == "off" || typeof check == "undefined")
      {
        return message.channel.send("Levels Are Disabled For This Server")
      }

      const channel = message.channel.id

      await levelSchema.findOneAndUpdate(
     {
       name: `server-${message.guild.id}`
     }, 
     {
       channelID: channel
     },
     {
       upsert: true,
       new: true
     }
     )

     var data = {
        title: "Channel Set",
        value: "Channel Set For Level Up Messages"
      }

     message.channel.send({embeds: [embedSender(data)]})
    }
  })

  command(bot, "lvlmsg", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADIMINISTRATOR"))
    {
      return;
    }

    var check = "off"

      resultCheck = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof resultCheck[0] == "undefined") return message.channel.send("Levels Are Disabled For This Server")

        check = resultCheck[0].status

      if (check == "off" || typeof check == "undefined")
      {
        return message.channel.send("Levels Are Disabled For This Server")
      }

    var msg = message.content.replace("!lvlmsg", " ")
    msg = msg.trim()

    var data = {
        title: "Message Set",
        value: `Custom Message Has Been Set As: ${msg}`
      }

     message.channel.send({embeds: [embedSender(data)]})

     await levelSchema.findOneAndUpdate(
     {
       name: `server-${message.guild.id}`
     }, 
     {
       message: msg
     },{
       upsert: true,
       new: true
     })
  })

  command(bot, "lvlroles", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADIMINISTRATOR"))
    {
      return;
    }

     var check = "off"

      resultCheck = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof resultCheck[0] == "undefined") return message.channel.send("Levels Are Disabled For This Server")

        check = resultCheck[0].status

      if (check == "off" || typeof check == "undefined")
      {
        return message.channel.send("Levels Are Disabled For This Server")
      }

    var roles = []

    var data = {
        title: "Level Up Roles",
        value: "Please Mention The Roles After This Message In The Following Syntax \n <level> - <role>, use stop when done"
      }

    message.channel.send({embeds: [embedSender(data)]})

    const filter = m => (!m.content.startsWith('<@&') || m.content == "stop" || m.author.id == `${message.author.id}`);

    const collector = message.channel.createMessageCollector({filter, time: 1000 * 500 });

    collector.on("collect", async m =>
    {
      if (m.author.id == "862304613185093642")
      {
        return
      }

      if (m.content == "stop")
      {
        collector.stop()
        message.channel.send("Stopped")
        return
      }

      var split = m.content.split("-")

      if (split.length < 2) 
      {
        message.channel.send("Invalid Input")
        collector.stop()
        return;
      }

      m.react("✅")

      const level = split[0].trim()
      const role = split[1].trim()

      roles[level] = `${level}-${role}`
    })

    collector.on("end", async collected =>
    {
      if (roles.length == 0) return message.channel.send("No Input, Process Abort")

      await levelSchema.findOneAndUpdate(
          {
            name: `server-${message.guild.id}`,
          }, 
          {
            name: `server-${message.guild.id}`,
            serverID: message.guild.id,
            $addToSet: {
              roles: roles
            }
          }, 
          {
            upsert: true,
            new: true,
          })

          var data = {
        title: "Roles Set",
        value: `Level Up Roles Have Been Set`
      }

      message.channel.send({embeds: [embedSender(data)]})
    })
    
  })

  command(bot, "modifyrole", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADIMINISTRATOR"))
    {
      return;
    }

    var check = "off"

      resultCheck = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof resultCheck[0] == "undefined") return message.channel.send("Levels Are Disabled For This Server")

        check = resultCheck[0].status

      if (check == "off" || typeof check == "undefined")
      {
        return message.channel.send("Levels Are Disabled For This Server")
      }

    var roleLevel = message.content.replace("!modifyrole", " ")
    roleLevel = roleLevel.trim()
    var result
    var split = roleLevel.split("-")
    var level = split[0].trim()
    var newRole = split[1].trim()

    result = await levelSchema.find({
        name: `server-${message.guild.id}`
     })
    
    if (typeof result[0].roles == "undefined") return message.channel.send("No Roles Set")

     var roles = result[0].roles
     for (var i = 0; i < roles.length; i++)
     {
       if (!roles[i]) {continue}

       var split = roles[i].split("-")

       if (split[0] == level)
       {
          roles[i] = `${level}-${newRole}`
       }
     }
     await levelSchema.findOneAndUpdate(
     {
       name: `server-${message.guild.id}`
     },
     {
       name: `server-${message.guild.id}`,
       guildID: message.guild.id,
       roles: roles
     },
     {
       upsert: true,
       new: true,
     },
     )
     message.channel.send("Roles Updated")
  })

  command(bot, "deleterole", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADIMINISTRATOR"))
    {
      return;
    }

    var check = "off"

      resultCheck = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof resultCheck[0] == "undefined") return message.channel.send("Levels Are Disabled For This Server")

        check = resultCheck[0].status

      if (check == "off" || typeof check == "undefined")
      {
        return message.channel.send("Levels Are Disabled For This Server")
      }

    level = message.content.replace("!deleterole", " ")
    level = level.trim()
    var result

    result = resultCheck

     if (typeof result[0].roles == "undefined") return message.channel.send("No Roles Set")
     var roles = result[0].roles
     for (var i = 0; i < roles.length; i++)
     {
       if (!roles[i]) {continue}

       var split = roles[i].split("-")

       if (split[0].startsWith(level))
       {
          delete roles[i]
       }
     }

     await levelSchema.findOneAndUpdate(
     {
       name: `server-${message.guild.id}`
     },
     {
       name: `server-${message.guild.id}`,
       guildID: message.guild.id,
       roles: roles
     },
     {
       upsert: true,
       new: true,
     },
     )
     message.channel.send("Roles Updated")
  })

  command(bot, "viewroles", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADIMINISTRATOR"))
    {
      return;
    }

    var check = "off"

      resultCheck = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof resultCheck[0] == "undefined") return message.channel.send("Levels Are Disabled For This Server")

        check = resultCheck[0].status

      if (check == "off" || typeof check == "undefined")
      {
        return message.channel.send("Levels Are Disabled For This Server")
      }

    result = resultCheck

     if (typeof result[0].roles == "undefined") return message.channel.send("No Roles Set")

     var roles = result[0].roles
     var role = "not set"
     var level = " "
     if (roles[0])
     {
       var split = roles[0].split("-")
       role = split[1]
       level = split[0]
     }
     var msg = ""

     for(var i = 0; i < roles.length; i++)
     {
       if (!roles[i]) {continue}

       var split = roles[i].split("-")
       var level = split[0]
       var role = split[1]

       if (roles[i])
       {
         msg = msg + `**Level:** \`${level}\` \n **Role:** ${role} \n \n`
       }
     }

     var guildIcon = message.guild.iconURL({dynamic: true, type: "png"})

     const embed = new MessageEmbed()
     .setTitle(`Level Roles For ${message.guild.name}`)
     .setDescription(`Here Are The List Of Roles \n\n ${msg}`)
     .setColor("#0033FF")
     .setThumbnail(guildIcon)

     message.channel.send({embeds: [embed]})
  })

  command(bot, "resetlevel", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADIMINISTRATOR"))
    {
      return;
    }

    await levelSchema.deleteMany({
      guildID: message.guild.id
    })

    await levelSchema.deleteMany({
      name: `server-${message.guild.id}`
    })

    var data = {
      title: `Clear User Levels`,
      value: "All User Data For Levels Have Been Deleted And Levels Have Been Turned Off"
    }

    message.channel.send({embeds: [embedSender(data)]})
  })

  command(bot, "rank", async message =>
  {
    var check = "off"

      resultCheck = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof resultCheck[0] == "undefined") return message.channel.send("Levels Are Disabled For This Server")

        check = resultCheck[0].status

      if (check == "off" || typeof check == "undefined")
      {
        return message.channel.send("Levels Are Disabled For This Server")
      }

      var tagged = message.mentions.users.first()
      var user

      if (tagged)
      {
        user = tagged
      }
      else
      {
        user = message.author
      }

    var resultUser = await levelSchema.find({
      guildUserID: `${user.id}-${message.guild.id}`
    })

    if (typeof resultUser[0] == "undefined") return message.channel.send("You Doint Have A Level Yet")

    var level = +resultUser[0].level
    var xp = +resultUser[0].xp
    levelXp1 =  8 * (level ^ 2) + (85 * (level + 1)) + xp
    xp = Math.round(+xp)
    var name = user.username
    var discriminator = user.discriminator
    var avatar = user.displayAvatarURL({dynamic: false, format: `png`})
    var nxtLvlXp = +resultUser[0].reqXp;
    var userRank = 1
    var voteResult = await voterSchema.find({
      voterID: user.id
    })

    var voted = "false"
    console.log(voteResult[0])
    if (typeof voteResult[0] != "undefined")
    {
      voted = "true"
    }
    var msg = "Keep Grinding!"

    if (voted == "true")
    {
      msg = "**5% Boot Is Active**"
    }

    var result = await levelSchema.find({
      guildID: message.guild.id
    })

    var length = result.length

   for (var i = 0; i< length; i++)
    {
      if (result[i])
      {
        for (var j = i+1; j < length; j++)
        {
          if (result[j].level >= result[i].level)
          {
            temp = result[j]
            result[j] = result[i]
            result[i] = temp 
          }
        }
      }
    }

    for (var i = 0; i< length; i++)
    {
      if (result[i])
      {
        for (var j = i+1; j < length; j++)
        {
          if (result[j].level == result[i].level)
          {
            if (result[j].xp > result[i].xp)
            {
              temp = result[j]
              result[j] = result[i]
              result[i] = temp 
            }
          }
        }
      }
    }

    var rankUser = 1

    for (var i = 0; i < result.length; i++)
    {
      if (result[i].userID == message.author.id)
      {
        rankUser = i
      }
    }

    var percentage = (xp/nxtLvlXp) * 100
    if (percentage < 45)
    {
      color = "#FF0000"
    }
    else if (percentage >= 45 && percentage <= 75)
    {
      color = "#FFFF00"
    }
    else
    {
      color = "#00FF00"
    }

    const rank = new canvacord.Rank()
    .setAvatar(avatar)
    .renderEmojis(true)
    .setCurrentXP(xp)
    .setRequiredXP(nxtLvlXp)
    .setStatus("online")
    .setProgressBar(color, "COLOR")
    .setUsername(`${name}`)
    .setDiscriminator(discriminator)
    .setLevel(level, "LEVEL:", true)
    .setRank((rankUser + 1), "RANK:", true)
    .setCustomStatusColor("#000000")
    .setBackground("IMAGE", "https://cdn.discordapp.com/attachments/862307473162502174/877829290178248774/1119107.jpg")
    .setOverlay(`#FFFFFF`, 1, false)

    rank.build()
    .then(data => {
        const attachment = new MessageAttachment(data, "rank.png")
        message.channel.send({content: msg ,files: [attachment]})
    });
  })

  command(bot, "leaderboard", async message =>
  {
    var check = "off"

      resultCheck = await levelSchema.find({
        name: `server-${message.guild.id}`
      })

      if (typeof resultCheck[0] == "undefined") return message.channel.send("Levels Are Disabled For This Server")

        check = resultCheck[0].status

      if (check == "off" || typeof check == "undefined")
      {
        return message.channel.send("Levels Are Disabled For This Server")
      }

      var result = await levelSchema.find({
      guildID: message.guild.id
    })

    if (typeof result[0] == "undefined") return message.channel.send("No Leaderboard yet")

    var temp;
    var leaderboard = []
    var length = result.length
    if (length > 10)
    {
      console.log(" > 10")
      length = 10
    }
    console.log(length)

    /*for (var i = 0; i< length; i++)
    {
      if (result[i])
      {
        for (var j = i+1; j < length; j++)
        {
          userXp1 = result[i].xp
          userXp2 = result[j].xp
          userLevel1 = result[i].level
          userLevel2 = result[j].level
          levelXp1 = 8 * (userLevel1 ^ 2) + (85 * (userLevel1 + 1)) + userXp1
          levelXp2 = 8 * (userLevel2 ^ 2) + (85 * (userLevel2 + 1)) + userXp2
          if (levelXp2 >= levelXp1)
          {
            temp = result[j]
            result[j] = result[i]
            result[i] = temp 
          }
        }
      }
    }*/

    for (var i = 0; i< result.length; i++)
    {
      if (result[i])
      {
        for (var j = i+1; j < result.length; j++)
        {
          if (result[j].level >= result[i].level)
          {
            temp = result[j]
            result[j] = result[i]
            result[i] = temp 
          }
        }
      }
    }

    for (var i = 0; i< result.length; i++)
    {
      if (result[i])
      {
        for (var j = i+1; j < result.length; j++)
        {
          if (result[j].level == result[i].level)
          {
            if (result[j].xp > result[i].xp)
            {
              temp = result[j]
              result[j] = result[i]
              result[i] = temp 
            }
          }
        }
      }
    }

    var msg = ""

    for (var i = 0; i <= length - 1; i++)
    {
      if (result[i])
      {
        var userXp1 = result[i].xp
        var userLevel1 = result[i].level
        var levelXp1 = 8 * (userLevel1 ^ 2) + (85 * (userLevel1 + 1)) + userXp1

        msg = msg +`**${i + 1}**. **${result[i].username}**\nLevel: \`${result[i].level}\`\n\n`
      }
    }

    avatarGuild = message.guild.iconURL({dynamic: false, type: "png"})

    const embed = new MessageEmbed()
     .setTitle(`Leaderboard For ${message.guild.name}`)
     .setDescription(`Here Is The Leaderboard \n\n ${msg}`)
     .setColor("#0033FF")
     .setThumbnail(avatarGuild)

    message.channel.send({embeds: [embed]})
  })
}
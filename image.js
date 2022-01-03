const Discord = require('discord.js')
const DIG = require("discord-image-generation");
const command = require("./command")
const fetch = require("node-fetch")
const {Canvas} = require("canvacord");
const db = require("quick.db")
const moment = require('moment');

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

  command(bot, "delete", async message =>
  {
    var avatar
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
    }
        // Make the image
        let img = await Canvas.delete(avatar, true)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "delete.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "circle", async message =>
  {
    var avatar
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
    }
        // Make the image
        let img = await Canvas.circle(avatar)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "circle.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "color", async message =>
  {
    var prefix = getPrefix(message)
        var text = message.content.replace(`${prefix}color`, " ")
        text = text.trim();

        if (!text.startsWith("#")) return message.channel.send("Enter A Valid Hex Code")

        // Make the image
        let img = await Canvas.color(text, false, 1024, 1024)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "delete.png");;
       message.channel.send({files: [attach]})
  })

  command(bot, "present", async message =>
  {
    var prefix = getPrefix(message)
    var avatar
    text = message.content.replace(`${prefix}present`, " ")
    text = text.trim();
    if (text == "")
    {
      message.channel.send("Enter Something <text>")
    }
        // Make the image
        let img = await new DIG.LisaPresentation().getImage(text)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "lisapresentation.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "changeMind", async message =>
  {
    var prefix = getPrefix(message)
    var avatar
    text = message.content.replace(`${prefix}changeMind`, " ")
    text = text.trim();
    if (text == "")
    {
      message.channel.send("Enter Something <text>")
    }
        // Make the image
        let img = await Canvas.changemymind(text)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "changeMind.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "oh", async message =>
  {
    var prefix = getPrefix(message)
    var avatar
    text = message.content.replace(`${prefix}oh`, " ")
    text = text.trim();
    if (text == "")
    {
      message.channel.send("Enter Something <text>")
    }
        // Make the image
        let img = await Canvas.ohno(text)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "ohNo.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "trigger", async message =>
  {
    var avatar1
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
    }
        // Make the image
        let img = await Canvas.trigger(avatar)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "triggered.gif");;
        message.channel.send({files: [attach]})
  })

  
  command(bot, "ad", async message =>
  {
    var avatar1
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
    }
        // Make the image
        let img = await new DIG.Ad().getImage(avatar)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "ad.png");;
        message.channel.send({files: [attach]})
  })
  command(bot, "affect", async message =>
  {
    var avatar1
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
    }
        // Make the image
        let img = await Canvas.affect(avatar)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "affect.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "confusedStonk", async message =>
  {
    var avatar1
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
    }
        // Make the image
        let img = await new DIG.ConfusedStonk().getImage(avatar)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "confused.png");;
       message.channel.send({files: [attach]})
  })

  command(bot, "rip", async message =>
  {
    var avatar1
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
    }
        // Make the image
        let img = await new DIG.Rip().getImage(avatar)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "rip.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "shit", async message =>
  {
    var avatar1
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
    }
        // Make the image
        let img = await Canvas.shit(avatar)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "shit.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "wasted", async message =>
  {
    var avatar1
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
    }
        // Make the image
        let img = await Canvas.wasted(avatar)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "wasted.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "avatar", async message =>
  {
    pinged = message.mentions.users.first();
    if (pinged == null)
    {
      let embed = new Discord.MessageEmbed()
        .setColor("#985ce7")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`[Avatar URL Link](${message.author.displayAvatarURL({size: 256})})`)
        .setImage(message.author.displayAvatarURL({format : "png", dynamic: true}))
         message.channel.send({embeds: [embed]})
    }
    else
    {
      let embed = new Discord.MessageEmbed()
        .setColor("#985ce7")
        .setAuthor(pinged.tag, pinged.displayAvatarURL())
        .setDescription(`[Avatar URL Link](${pinged.displayAvatarURL()})`)
        .setImage(pinged.displayAvatarURL({format : "png", dynamic: true, size: 256}))
         message.channel.send({embeds: [embed]})
    }
  })
   
   command(bot, "phub", async message =>
  {
    pinged = message.mentions.users.first();
    var split = message.content.split(" ")
    var user
    text = ""

    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
       user = message.author
      if (split.length < 2) return message.channel.send("You Need To Provide text")
      for (var i = 1; i< split.length; i++)
      {
        text = text + split[i] + " "
      }
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
      user = pinged
      if (split.length < 3) return message.channel.send("You Need To Provide text After Ping")
      for (var i = 2; i < split.length; i++)
      {
        text = text + split[i] + " "
      }
    }
    var options = {
      username: user.username,
      message: text,
      image: avatar
    }
        let img = await Canvas.phub(options, options.username, options.message, options.image)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "ad.png");;
        message.channel.send({files: [attach]})
  })

  command(bot, "quote", async message =>
  {
    pinged = message.mentions.users.first();
    var split = message.content.split(" ")
    var user
    text = ""

    if (pinged == null)
    {
      avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
       user = message.author
      if (split.length < 2) return message.channel.send("You Need To Provide text")
      for (var i = 1; i< split.length; i++)
      {
        text = text + split[i] + " "
      }
    }
    else
    {
      avatar = pinged.displayAvatarURL({ dynamic: false, format: 'png' });
      user = pinged
      if (split.length < 3) return message.channel.send("You Need To Provide text After Ping")
      for (var i = 2; i < split.length; i++)
      {
        text = text + split[i] + " "
      }
    }
    var options = {
      username: user.username,
      message: text,
      image: avatar,
      color: "#FFFFF"
    }
        let img = await Canvas.quote(options, options.image, options.message, options.username)
        // Add the image as an attachement
        let attach = new Discord.MessageAttachment(img, "ad.png");;
        message.channel.send({files: [attach]})
  })


  const miniGameSender = message =>
  {
    let embed = new Discord.MessageEmbed()
        .setColor("#985ce7")
        .setTitle("Activity")
        .setDescription(`[Click Here To Join Youtube/Game](${message})`)
        return embed;
  }

  command(bot, "youtube", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "880218394199220334",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "poker", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "755827207812677713",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "chess", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "832012774040141894",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "checkers", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "832013003968348200",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "doodle", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "878067389634314250",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "wordsnack", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "879863976006127627",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "lettertile", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "879863686565621790",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "spellcast", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "852509694341283871",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "awkword", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "879863881349087252",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "fishing", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "814288819477020702",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

command(bot, "betrayal", message =>
{
  const voiceChannel = message.member.voice.channel
  if (!voiceChannel)
  {
    message.reply("You Need To Be In A Voice Channel")
    return;
  }

  fetch(`https://discord.com/api/v8/channels/${voiceChannel.id}/invites`, {
    method: "POST",
    body: JSON.stringify({
       max_age: 86400,
       max_uses: 0,
       target_application_id: "773336526917861400",
       target_type: 2,
       temporary: false,
       validate: null,
    }),
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`,
      "Content-Type": "application/json"
    }
  })
  .then(res => res.json())
  .then(invite =>
  {
    if (!invite.code) return message.channel.send("Unable To Start")
    message.channel.send({ embeds: [miniGameSender(`https://discord.com/invite/${invite.code}`)]})
  })
})

bot.on("interactionCreate", async interaction =>
{
  if (!interaction.isContextMenu()) return

   if (interaction.commandName == "purge user 20")
   {
     if (interaction.member.permissions.has("MANAGE_MESSAGES"))
     {
       var del = 1
       var msgs = []
       channel = interaction.channel
      targetMsg = await channel.messages.fetch(interaction.targetId)
      var user = await targetMsg.author
      interaction.reply(`Deleting 20 Messages From ${user.username}, This WIll Take Sometime`)
      messages = await channel.messages.fetch({limit: 100}).then(messages =>
    {
    messages.forEach(msg =>
    { 
      if (del == 20)
      {
        channel.bulkDelete(msgs)
      }

      if (msg.author.id == user.id && del <= 20)
      {
        del++
        msgs.push(msg)
      }
    })
  })
     }
     else
     {
       interaction.reply({ content:"You Do Not Have Permission To Use This", ephemeral: true})
     }
   }
   else if (interaction.commandName == "user info")
   {
     interaction.deferReply()
     channel = interaction.channel
     targetMsg = await channel.messages.fetch(interaction.targetId)
     var member = await targetMsg.member
     var createTime = "Cannot Determine"
     var admin = "none"
    if (member)
    {
      createTime = moment.utc(member.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')
      if (member.permissions.has("ADMINISTRATOR"))
    {
      admin = "Server Admin"
    }
      let embed = new Discord.MessageEmbed()
        .setColor("#985ce7")
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setDescription(`${member.user.toString()} \n \n Created At: ${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')} \n Joined At: ${createTime} \n\n Roles: ${member.roles ? member.roles.cache.map(r => `${r}`).join(` | `) : " "} \n Key Permission: ${admin}`)
        .setThumbnail(member.user.displayAvatarURL())
        interaction.followUp({embeds: [embed]})
    }
    else
    {
      interaction.followUp("Sorry Could Not Determine, please use !userinfo command")
    }
   }
   else if (interaction.commandName == "trigger")
   {
     interaction.deferReply()
     channel = interaction.channel
     targetMsg = await channel.messages.fetch(interaction.targetId)
     var user = await targetMsg.author
     avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
    let img = await Canvas.trigger(avatar)
    let attach = new Discord.MessageAttachment(img, "triggered.gif");;
    interaction.followUp({files: [attach]})
   }
   else if (interaction.commandName == "avatar")
   {
     interaction.deferReply()
     channel = interaction.channel
     targetMsg = await channel.messages.fetch(interaction.targetId)
     var user = await targetMsg.author
     let embed = new Discord.MessageEmbed()
        .setColor("#985ce7")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setDescription(`[Avatar URL Link](${user.displayAvatarURL()})`)
        .setImage(user.displayAvatarURL({format : "png", dynamic: true, size: 256}))
        interaction.followUp({embeds: [embed]})
   }
   
})

}
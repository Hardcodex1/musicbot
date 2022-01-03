const Discord = require('discord.js')
const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

const command = require("./command")
const redis = require('./redis')
const db = require("quick.db")

module.exports = async bot =>
{
  const getPrefix = message => {
  var prefix = db.get(`prefix-${message.guild.id}`)

  if (prefix == null || typeof prefix == "null")
  {
    prefix = "!"
  }
  return prefix
  }

  syntax = "nexkieReminder-"
  var keyValue;
  var channelId;
  var pingRole;
  var id;
  var guild;
  var user;

  bot.on("messageCreate", async message =>
  {
    if (message.author.username == "DISBOARD")
    {
      if (message.embeds[0].image != null)
      {
        const redisClient = await redis()
        try{
          redisClient.set(`BotBumpReminder-${message.guild.id}`, 'true', "EX", 2 * 60 * 60)
          message.channel.send(`**Thank You**`)
        }finally{
          redisClient.quit()
        }
      }
    }
  })

  command(bot, "bumpreminder", async message =>
  {

   var prefix = getPrefix(message)

    const text = message.content.replace(`${prefix}bumpreminder`, " ").trim()
    const args = text.split(" ")
    const cmd = args[0].toLowerCase();

    const setup = message =>
    {
      message.channel.send("Lets Setup The Bump Reminder For You...")

       const backupEmbed = new Discord.MessageEmbed()
            .setColor("#FFFFFF")
            .setTitle(`Bump Reminder`)
            .setDescription("Follow The Instructions Below")
            .addFields (
              {
                name: "`!bumpreminder channel`  `!bumpreminder role <@role>`  `!bumptest`",
                value: "All These Commands Will Help You Bumping Ur Server"
              },
            )
            .setFooter(`Requested By ${message.author.username}`)

            setTimeout(() => message.channel.send({embeds:[backupEmbed]}), 1000)
    }

    if (cmd == '')
    {
      setup(message)
    }

    if (cmd == "role")
    {
      console.log("1")
      if (message.member.permissions.has("MANAGE_GUILD") || message.member.permissions.has("ADMINISTRATOR"))
      {
        console.log("2")
      if (message.mentions.everyone)
      {
        message.channel.send("Sorry Cannot Use This Role")
        return;
      }
      var role = args[1]

      if (role == "" || role == null || typeof role == "undefined" || role == " ") return message.lineReply("Please Provide A Role")
      
      const redisClient = await redis()
      try{
        redisClient.set(`${syntax}Role-${message.guild.id}`, `${role}`)
        message.channel.send(`${role} Has Been Set And Will Be Pinged`)
      }finally{
        redisClient.quit()
      }
      }
      else
      {
        message.channel.send("You Need Manage Guild Perms")
      }
    }

    if (cmd == "channel")
    {
      console.log("3")
      if (message.member.permissions.has("MANAGE_GUILD") || message.member.permissions.has("ADMINISTRATOR"))
      {
        console.log("1")
      const redisClient = await redis()
      try{
        redisClient.set(`${syntax}Channel-${message.guild.id}`, `${message.channel.id}`)
        message.channel.send("Channel Set For Reminder")
      }finally{
        redisClient.quit();
        }
      }
      else
      {
        message.channel.send("You Need Manage Guild Perms To Run This command")
      }
    }
  })

  const sendMsg = message =>
  {
    guild = bot.guilds.cache.get(`${id}`)

     let channel = guild.channels.cache.get(channelId)
     channel.send(`${pingRole}`)
      const bumpEmbed = new Discord.MessageEmbed()
      .setColor("#FFFFFF")
      .setTitle(`Bump Reminder`)
      .setDescription("[**Its Time To Bump**](https://discord.gg/H5RpUBhGbr)")
      .addFields (
      {
        name: "Bump Our Server By Typing !d bump",
        value: "Thank You In Advance"
      }
      )
     channel.send({embeds: [bumpEmbed]})
  }

  const roleFind = async message =>
  {
    const redisClient = await redis()
       try{
         redisClient.get(`${syntax}Role-${id}`, (err,reply) =>
         {
           if (err)
           {
             console.log(err)
           }
           else if (reply)
           {
             pingRole = reply
             sendMsg(message)
           }
           else
           {
             null
           }
         })
       }finally{
         redisClient.quit()
       }
  }

  const falueFind = async message =>
  {
     id = " "

    for(var i = 16; i <= 33; i++)
      {
        id = id + keyValue.charAt(i);
      }
      id = id.trim();

       const redisClient = await redis()
       try{
         redisClient.get(`${syntax}Channel-${id}`, (err,reply) =>
         {
           if (err)
           {
             console.log(err)
           }
           else if (reply)
           {
             channelId = reply
             roleFind(message)
           }
           else
           {
             null
           }
         })
       }finally{
         redisClient.quit()
       }
  }

  redis.expire((message) => {
    if (message.startsWith("BotBumpReminder-")) {
      keyValue = message;
      falueFind(message);
    }
  })

  command (bot, "bumpTest", async message =>
  {
    if (message.member.permissions.has("MANAGE_GUILD") || message.member.permissions.has("ADMINISTRATOR"))
    {

    user = message.author;
      guild = bot.guilds.cache.get(`${message.guild.id}`)
        const redisClient = await redis()
        try{
          redisClient.set(`BotBumpReminder-${message.guild.id}`, 'true', "EX", 10)
          message.channel.send(`Thanks For Bumping Our Server We Will Remind You In 2 Hours \n ${user.toString()}`)
        }finally{
          redisClient.quit()
        }
    }
    else
    {
      message.channel.send("Sorry But You Need Manage Server Permission For This")
    }
  })
}
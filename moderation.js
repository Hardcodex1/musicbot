 const Discord = require('discord.js')
 const { Client, Intents } = require('discord.js');
const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES);

 const command = require('./command');
 
 module.exports = bot =>
 {
   error = 0
   const sendEmbedError = message =>
   {
     const permissionEmbed = new Discord.MessageEmbed()
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

   command(bot, 'ban', (message) => {
    
    if (!message.channel.guild.me.permissions.has("BAN_MEMBERS"))
    {
      message.channel.send({ embeds: [sendEmbedError("Sorry But In Order To Ban Members The Bot Need Ban Member Permission")]})
      return;
    }

    check = 0

    const { member, mentions } = message

    const tag = `<@${member.id}>`

    if (
      member.permissions.has('ADMINISTRATOR') ||
      member.permissions.has('BAN_MEMBERS')
    ) {
      const target = mentions.users.first()

      if (typeof target == "undefined" || target == null)
      {
        message.channel.send("Please Tag A User")
        return;
      }
      if (target.id == member.id)
      {
        message.channel.send("Sorry But You Cannot Ban Yourself Lol")
        return;
      }
      if (target) {
        const targetMember = message.channel.guild.members.cache.get(target.id)
        targetMember.ban().catch(err => 
        {
          message.channel.send("User Could Not Be Banned")
          check = 1;
          return;
        })
        setTimeout(function() {
          if (check == 0)
          message.channel.send(`${target.username} has been banned`)
        }, 1000)
      } else {
        message.channel.send(`Please specify someone to ban.`)
      }
    } else {
      message.channel.send(
        `${tag} You do not have permission to use this command.`
      )
    }
  })

  command(bot, 'kick', (message) => {

    if (!message.channel.guild.me.permissions.has("KICK_MEMBERS"))
    {
      message.channel.send({embeds: [sendEmbedError("Sorry But In Order To Kick Members The Bot Needs Kick Member Permission")]})
      return;
    }

    check = 0
    const { member, mentions } = message

    const tag = `<@${member.id}>`

    if (
      member.permissions.has('ADMINISTRATOR') ||
      member.permissions.has('KICK_MEMBERS')
    ) {
      const target = mentions.users.first()
      if (typeof target == "undefined" || target == null)
      {
        message.channel.send("Please Tag The Person")
        return;
      }
      
      if (target.id == member.id)
      {
        message.channel.send("Sorry But You Cannot Kick Yourself Lol")
        return;
      }
      if (target) {
        const targetMember = message.channel.guild.members.cache.get(target.id)
        targetMember.kick().catch(err => {
          message.channel.send("User Could Not Be Kicked")
          check = 1
          return;
          })
          setTimeout(function() {
            if (check == 0)
            message.channel.send(`${target.username} Has Been Kicked`)
          }, 1000 )
      } else {
        message.channel.send(`Please specify someone to kick.`)
      }
    } else {
      message.channel.send(
        `${tag} You do not have permission to use this command.`
      )
    }
  })

      command(bot, "clear", message =>
      {
        if (!message.channel.guild.me.permissions.has("MANAGE_MESSAGES"))
   {
     message.channel.send({embeds: [sendEmbedError("Cannot Delete Cause Bot Does Not Have Manage Messages Perms")]})
     return;
   }
        const {member} = message;
        if (member.permissions.has('ADMINISTRATOR') ||
          member.permissions.has('MANAGE_MESSAGES')
        )
        {
          var args = message.content.split(" ")
          var value = args[1]
          if ((+value + 1) > 100 || value <= 0 ) return message.channel.send("enter value between 1 - 99")
          if(value != null){
          try{
          message.channel.bulkDelete((+value + 1));
          setTimeout(() =>  message.channel.send(`Deleted ${(value)} Messages - ${message.author.tag}`))
          }catch (error){
            message.channel.send("Missing perms")
          }
          }
          else{
            message.channel.send("Gib Value Sir")
          }
        }
        else{
          message.channel.send("You Need MANAGE_MESSAGES Perms")
        }
      })

      command(bot, "slow", message =>
      {
  if (!message.channel.guild.me.permissions.has("MANAGE_CHANNELS"))
   {
     message.channel.send({embeds: [sendEmbedError("Cannot add Slowmode Cause Bot Does Not Have Manage Channels Perms")]})
     return;
   }
        
      const {member} = message;
      if (
      member.permissions.has('ADMINISTRATOR') ||
      member.permissions.has('MANAGE_CHANNELS')
        )
        {
          var args = message.content.split(" ")
          var value = args[1]
          if (isNaN(value) || value < 0) return message.channel.send("Enter Value Greater Than 0") 
          if (value != null)
          {
            try{
            message.channel.setRateLimitPerUser(value)
            message.channel.send(`Set Slowmode to ${value} secconds`)
            }catch (error){
              message.channel.send("Missing permission")
            }
          }
          else{
            message.channel.send("Gib Value Sir")
          }
        }
        else{
          message.channel.send("Go Get Manage Channel perms and come")
        }
      })

      command(bot, "lock", message =>
      {
         if (!message.channel.guild.me.permissions.has("MANAGE_ROLES"))
   {
     message.channel.send({embeds: [sendEmbedError("Cannot Lockdown channel Cause Bot Does Not Have Manage Roles Perm")]})
     return;
   }
        
        if (
      message.member.permissions.has('ADMINISTRATOR') ||
      message.member.permissions.has('MANAGE_ROLES')
        )
        {
          try{
          message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          message.channel.send(`${message.channel.name} locked`).catch(err => null)
          }catch (error){
            message.channel.send("Gib Perms Manage Role Sir")
          }
        }
        else{
          message.channel.send("Go Get Manage Role Perms first")
        }
      })


      command(bot, "unlock", message =>
      {
         if (!message.channel.guild.me.permissions.has("MANAGE_ROLES"))
   {
     message.channel.send({embeds: [sendEmbedError("Cannot Unlock channel Cause Bot Does Not Have Manage Roles Perm")]})
     return;
   }
        if (
      message.member.permissions.has('ADMINISTRATOR') ||
      message.member.permissions.has('MANAGE_ROLES')
        )
        {
          try{
          message.channel.permissionOverwrites.edit(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          message.channel.send(`${message.channel.name} unlocked`).catch(err => null)
          }catch (error){
            message.channel.send("Gib Perms Manage Role Sir")
          }
        }
        else{
          message.channel.send("Go Get Manage Role Perms first")
        }
      })

  command(bot, "backupCreate", message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD"))
    {
      message.channel.send({embeds: [sendEmbedError("Sorry But You Cannot Run This Without Having Manage Server Perms")]})
      return;
    }

    if (!message.channel.guild.me.permissions.has("MANAGE_GUILD"))
    {
      message.channel.send({embeds: [sendEmbedError("Sorry But You Cannot Run This Without Giving Bot Manage Server Perms")]})
      return;
    }

    message.channel.guild.createTemplate(`${message.guild.name}`, "This Backup Was Created By Nekie")
    .catch(err =>
    {
      message.channel.send("Backup Is Already Present, Use !backupSync to Sync")
      error = 1
    })
    setTimeout(function() {
    if (error == 0)
    {
      message.channel.send("Backup Created")
      error = 0;
    }
    error = 0;
    }, 2000)
  })

  command(bot, "backupUrl", message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD"))
    {
      message.channel.send({embeds: [sendEmbedError("Sorry But You Cannot Run This Without Having Manage Server Perms")]})
      return;
    }

    if (!message.channel.guild.me.permissions.has("MANAGE_GUILD"))
    {
      message.channel.send({embeds: [sendEmbedError("Sorry But You Cannot Run This Without Giving Bot Manage Server Perms")]})
      return;
    }

    var template = message.channel.guild.fetchTemplates().then(ts => ts.first().url)
    const promise = new Promise((resolve,reject) => {
      resolve(template)
    }).then(value => {
      message.channel.send("Link Sent In DM")
      message.author.send(`Here Is Your Recovery URL, Use This To Make New Server Or Fix Current One \n ${value}`)
    }).catch(err => {
      message.channel.send("Backup Not Made Please Use !backupCreate")
    })
  })


  command(bot,"backupSync", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD"))
    {
      message.channel.send({embeds: [sendEmbedError("Sorry But You Cannot Run This Without Manage Server Perms")]})
      return;
    }

    if (!message.channel.guild.me.permission.has("MANAGE_GUILD"))
    {
      message.channel.send({embeds: [sendEmbedError("Sorry But You Cannot Run This Without Giving Bot Manage Server Perms")]})
      return;
    }

    var error = 0
    await message.channel.guild.fetchTemplates().then(ts => ts.first().sync())
    .catch(err => {
      message.channel.send("There Is No Template To Sync, Use !backupCreate")
      error = 1
    })

    setTimeout(function() {
      if (error == 0)
      {
        message.channel.send("Synced")
        error = 0
      }
      error = 0
    })
  })

  command(bot,"backupDelete", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD"))
    {
      message.channel.send({embeds: [sendEmbedError("Sorry But You Cannot Run This Without Manage Server Perms")]})
      return;
    }

    if (!message.channel.guild.me.permissions.has("MANAGE_GUILD"))
    {
      message.channel.send({embeds: [sendEmbedError("Sorry But You Cannot Run This Without Giving Bot Manage Server Perms")]})
      return;
    }

    var error = 0
    await message.channel.guild.fetchTemplates().then(ts => ts.first().delete())
    .catch(err => {
      message.channel.send("There Is No Template To delete, Use !backupCreate")
      error = 1
    })

    setTimeout(function() {
      if (error == 0)
      {
        message.channel.send("Deleted, Use !backupCreate To Create New One")
        error = 0
      }
      error = 0
    })
  })

  command(bot, "backup", message =>
  {
    message.channel.send("Let's Backup Your Server")
    const backupEmbed = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setTitle(`Backup Setup`)
            .setDescription("Follow The Instructions Below")
            .addFields (
              {
                name: "`!backupCreate`  `!backupUrl`  `!backupSync`  `!backupDelete`",
                value: "All These Commands Will Help You Backup Your Server"
              },
            )
            .setFooter("Owner: Tostiffent#6969", "https://cdn.discordapp.com/avatars/849905403021361162/a_45c1f2f5ed03522bb867bfa443bd6915.gif?size=256&f=.gif" )

            setTimeout(() => message.channel.send({embeds:[backupEmbed]}), 1000)
  })
 }
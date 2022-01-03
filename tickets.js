const command = require("./command")
const redis = require("./redis")
const db = require("quick.db")
const {MessageEmbed, MessageButton, MessageActionRow} = require("discord.js")

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

    let closeButton = new MessageButton()
    .setStyle("SUCCESS")
    .setLabel("🔒")
    .setCustomId("Close Ticket");

      let deleteButton = new MessageButton()
      .setStyle("DANGER")
      .setLabel("🚫")
      .setCustomId("Delete Ticket");

      let reopenButton = new MessageButton()
      .setStyle("SUCCESS")
      .setLabel("🔓")
      .setCustomId("Reopen Ticket")

      let ticketButton = new MessageButton()
      .setStyle("SUCCESS")
      .setLabel("Open A Ticket")
      .setCustomId("New Ticket")

    const ticketRow = new MessageActionRow()
    .addComponents(closeButton)
    .addComponents(deleteButton)
    .addComponents(reopenButton)

  const ticketCreate = async message =>
  {
    var catagory;
    const redisClient = await redis()
    try{
      redisClient.get(`ticketcatagory-${message.guild.id}`, (err,reply) =>
      {
        if (err)
        {
          console.log(err)
        }
        else if (reply)
        {
          catagory = reply
        }
        else
        {
          null
        }
      })
    }finally{
      redisClient.quit()
    }

    const channel = await message.guild.channels.create(`ticket-${message.author.tag}-${message.author.id}`)

    if (catagory)
    {
      channel.setParent(`${catagory}`)
    }

    const role = message.guild.roles.cache.get("843812947909935104");

    channel.permissionOverwrites.edit(message.channel.guild.me, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })

    channel.permissionOverwrites.edit(message.author, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })

    channel.permissionOverwrites.edit(message.channel.guild.me, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })

    setTimeout(function() {
      channel.permissionOverwrites.edit(message.channel.guild.id, {
      SEND_MESSAGES: false,
      VIEW_CHANNEL: false,
    })
    }, 5000)

    channel.permissionOverwrites.edit(message.channel.guild.me, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })

    channel.permissionOverwrites.edit(role, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })

    channel.send({
      content: `Your Ticket Has Been Created ${message.author.toString()}, Support Will Be Here Soon ${role.toString()}`,
      components: [ticketRow]
    })
  }

  command(bot, "ticketsetup", message =>
  {
    if (!message.channel.guild.me.permissions.has("MANAGE_ROLES") || !message.channel.guild.me.permissions.has("MANAGE_CHANNELS")) return message.channel.send("Bot Needs Manage Channel Permission And Manage Channel Permission")

     const setupRow = new MessageActionRow()
    .addComponents(ticketButton)

    if (message.member.permissions.has("MANAGE_GUILD") || message.member.permissions.has("ADMINISTRATOR"))
    {
      message.channel.send({
        content: "Click On The Button To Open A Ticket",
        components: [setupRow]
      })
    }
  })

  command(bot, "onticket", async message =>
  {
    if (message.member.permissions.has("MANAGE_GUILD") || message.member.permissions.has("ADMINISTRATOR"))
    {

    await db.set(`customTickets-${message.channel.guild.id}`, true)
    message.channel.send("Turned On. Now Every Member Can Create Their Own Ticket Using Command")
    }else
    {
      message.channel.send("You Need Manage Server Permssion")
    }
  })

  command(bot, "offticket", async message =>
  {
    if (message.member.permssions.has("MANAGE_GUILD") || message.member.permissions.has("ADMINISTRATOR"))
    {

    await db.set(`customTickets-${message.channel.guild.id}`, false)
    message.channel.send("Turned Off. !createticket can no longer be used in this server")
    } else
    {
      message.channel.send("You Need Manage Server Permission")
    }
  })

  command(bot, "ticketcatagory", async message =>
  {
    var prefix = await getPrefix(message)

    var catagory = message.content.replace(`${prefix}ticketcatagory`, " ")
    catagory = catagory.trim();

    if (catagory == "" || catagory == null || catagory == " " || isNaN(catagory)) return message.channel.send("Enter A Valid Catagory ID")

    const redisClient = await redis()
    try{
      redisClient.set(`ticketcatagory-${message.channel.guild.id}`, catagory)
      message.channel.send("Catagory Set")
    }finally{
      redisClient.quit();
    }
  })

  command(bot, "ticketcreate", async message =>
  {
    if (!message.channel.guild.me.permissions.has("MANAGE_ROLES") || !message.channel.guild.me.permissions.has("MANAGE_CHANNELS")) return message.channel.send("Bot Needs Manage Channel Permission And Manage Channel Permission")

    const check = await db.get(`customTickets-${message.channel.guild.id}`)

    if (check == false || typeof check == "undefined" || check == null) return message.channel.send("This Command Is Turned Off For This Server")

    ticketCreate(message)
    message.channel.send("Ticket Created")
  })

  bot.on("interactionCreate", async(button) =>
  {
    if (button.customId == "Close Ticket")
    {
      const user = await button.message.guild.members.fetch({user: button.user.id, force: true})

      if (user.permissions.has("MANAGE_ROLES") || user.permissions.has("ADMINISTRATOR"))
      {
      var channel = button.channel
      var channeName = channel.name
      var split = channeName.split("-")
      console.log(split)
      var userID = split[2]
      var guild = button.guild
      var ticketOwner = guild.members.cache.get(`${userID}`)
      channel.permissionOverwrites.edit(ticketOwner, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: true,
      })
      await button.reply("Ticket Locked")
      }
      else
      {
        await button.reply("You Need Manage Role Permission")
      }
    }
    else if (button.customId == "Delete Ticket")
    {
      const user = await button.message.guild.members.fetch({user: button.user.id, force: true})

      if (user.permissions.has("MANAGE_CHANNELS")|| user.permissions.has("ADMINISTRATOR"))
      {
      var channel = button.channel
      channel.send("Deleting Ticket In 10 Secconds")
      setTimeout(() => channel.delete(), 10000)
      button.reply("Deleting")
      }
      else
      {
        await button.reply("You Need Manage channel Permission")
      }
    }
    else if (button.customId == "Reopen Ticket")
    {
      const user = await button.message.guild.members.fetch({user: button.user.id, force: true})

      if (user.permissions.has("MANAGE_ROLES") || user.permissions.has("ADMINISTRATOR"))
      {
      var channel = button.channel
      var channelname = channel.name
      var split = channelname.split("-")
      var userID = split[2]
      var guild = button.guild
      var ticketOwner = guild.members.cache.get(`${userID}`)
      channel.permissionOverwrites.edit(ticketOwner, {
        SEND_MESSAGES: true,
        VIEW_CHANNEL: true,
      })
      await button.reply("Ticket Reopned")
      }
      else
      {
        await button.reply("You Need Manage Role Permission")
      }
    }
    else if (button.customId == "New Ticket")
    {
      ticketContent = {
        guild: button.guild,
        author: button.user,
        channel: button.channel
      }
      button.reply({content: "Your Ticket Was Created", ephemeral: true});
      ticketCreate(ticketContent)
    }
  })

  command(bot, "ticketdelete", message =>
  {
    if (message.member.permissions.has("MANAGE_CHANNELS")|| message.member.permissions.has("ADMINISTRATOR"))
    {

    if (message.channel.name.startsWith("ticket-"))
    {
      message.channel.send({
        content: "Are You Sure You Want To Delete This Ticket Channel?",
        button: deleteButton
      })
    }
    else {message.channel.send("This Command Can be executed only within a ticket")}
    }else{
      message.channel.send("You Need Manage Channel Perms")
    }
  })

  command(bot, "ticketreopen", message =>
  {
    if (message.member.permissions.has("MANAGE_ROLES")|| message.member.permissions.has("ADMINISTRATOR"))
    {
      if (message.channel.name.startsWith("ticket-"))
      {
        message.channel.send({
          content: "Are You Sure You Want To Reopen This Ticket?",
          button: reopenButton
        })
      }
      else
      {
        message.channel.send("This Command Can Be Used Only In Ticket Channel")
      }
    }
    else
    {
      message.channel.send("You Need Manage Channel Perms")
    }

  })

  command(bot, "ticketclose", message =>
  {
    if (message.member.permissions.has("MANAGE_ROLES") || message.member.permissions.has("ADMINISTRATOR"))
    {
      if (message.channel.name.startsWith("ticket-"))
      {
        message.channel.send({
          content: "Are You Sure You Want To close This Ticket",
          button: closeButton
        })
      }
      else
      {
        message.channel.send("This Command Can Be Run Only In Ticket Channel")
      }
    }
    else
    {
      message.channel.send("You Need Manage Role Perms")
    }
  })

  command(bot, "tickets", message =>
  {
    const embed = new MessageEmbed()
    .setTitle("Tickets Help")
    .setColor("RANDOM")
    .setDescription("Here Are The Commands")
    .addFields(
    {
      name: "`!ticketsetup`",
      value: "Mod Only Command, Creates A Button For Creating Tickets"
    },
    {
      name: "`!ticketcatagory <Catagory ID>`",
      value: "Optional Command. Sets A Particular Catagory For Ticket Channels"
    },
    {
      name: "`ticketcreate`",
      value: "Creates A Ticket For The User Who Runs The Command. By Default This Is off use !onticket to On And !offticket to off"
    },
    {
      name: "`!ticketclose`",
      value: "Closes The Ticket Channel Where This Command Is Run",
    },
    {
      name: "`!ticketreopen`",
      value: "Reopens The Ticket Channel Where Command Is Run",
    },
    {
      name: "`!ticketdelete`",
      value: "Deletes The Ticket Channel Where Command Is Run"
    },
    )
    message.channel.send({embeds: [embed]})
  })
}
const command = require("./command")

module.exports = bot =>
{
  var name
  var avatar
  var webhook
  var text = " "
  command(bot, "fake", async message =>
  {

    if (message.mentions.everyone)
  {
    message.channel.send("Cannot Execute This Because Of The Everyone/here ping")
    return;
  }

    var tagged = message.mentions.users.first();

    var users = message.mentions.users
    let values = Array.from(users.values())
    if (values.length > 3)
    {
      message.channel.send("In Order To Prevent Misuse This Command Is Locked To 3 Mentions")
      return;
    }

    if (tagged == null || typeof tagged == "undefined")
    {
      message.channel.send("Please Tag Someone")
      return;
    }
    name = tagged.username;
    avatar = tagged.avatarURL();
    message.channel.bulkDelete(1).catch(err => {console.log("Cannot Delete In Fake 14")})
    var textSplit = message.content.split(` `)
    for (var i = 2; i < textSplit.length; i++)
    {
      text = text + textSplit[i] + " "
    }
    if (text == " " || text == null || text == "") return message.channel.send("Please Enter Text After The Mention")
    try{
    const webhooks = await message.channel.fetchWebhooks();
    let keys = Array.from(webhooks.values())
    if (keys == [])
    {
      text = ""
      webhook = message.channel.createWebhook("Nekie", {
      avatar: "https://cdn.discordapp.com/embed/avatars/0.png"
    })
    }
    keys.forEach(key => {
      if (key.name == "Nekie")
      {
        webhook = key;
        sendWebhook(webhook)
      }
    })
    }catch{
      text = " "
    }
    if (!webhook)
    {
      text = ""
      message.channel.createWebhook("Nekie", {
      avatar: "https://cdn.discordapp.com/embed/avatars/0.png"
    })
    .then(webhook => console.log(`Created webhook ${webhook}`))
	  .catch(message.channel.send("Command Setup Please Run The Command Now"));
    }

    
  })

  const sendWebhook = async message =>
  {
    await webhook.send({
      content: `${text}`,
      username: name,
      avatarURL: avatar,
    });
    text = " "
    webhook = null
  }

  bot.on("interactionCreate", async interaction =>
  {
    if (!interaction.isCommand() || !interaction.guildId) return;

    if (interaction.commandName == "fake")
    {
    tagged = interaction.options.get("user").value

    guild = bot.guilds.cache.get(interaction.guildId)
    var member = guild.members.cache.get(tagged)
    var user = member.user
    name = user.username;
    avatar = user.avatarURL();
    text = interaction.options.get("message").value
    try{
    const webhooks = await interaction.channel.fetchWebhooks();
    let keys = Array.from(webhooks.values())
    if (keys == [])
    {
      text = ""
      webhook = interaction.channel.createWebhook("Nekie", {
      avatar: "https://cdn.discordapp.com/embed/avatars/0.png"
    })
    }
    keys.forEach(key => {
      if (key.name == "Nekie")
      {
        webhook = key;
        interaction.reply({content: "Sending Message", ephemeral: true})
        sendWebhook(webhook)
      }
    })
    }catch{
      text = " "
    }
    if (!webhook)
    {
      text = ""
      interaction.channel.createWebhook("Nekie", {
      avatar: "https://cdn.discordapp.com/embed/avatars/0.png"
    })
    .then(webhook => console.log(`Created webhook ${webhook}`))
	  .catch(interaction.followUp({content: "Command Setup Please Run The Command Now", ephemeral: true}))
    }
    }
  })
}
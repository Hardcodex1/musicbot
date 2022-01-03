const command = require("./command")
const db = require("quick.db")
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

  command(bot, "setprefix", message =>
{
  if (message.member.permissions.has("MANAGE_GUILD") || message.member.permissions.has("ADMINISTRATOR"))
  {

  var customPrefix = db.get(`prefix-${message.channel.guild.id}`)
  var prefix

  if (customPrefix == null || typeof customPrefix == "null")
  {
    prefix = "!"
  }
  else
  {
    prefix = customPrefix
  }

  var newPrefix = message.content.replace(`${prefix}setprefix`, " ")
  newPrefix = newPrefix.trim();

  if (newPrefix == null || newPrefix == " ")
  {
    message.channel.send("Prefix Cannot Be Empty")
  }

  console.log(newPrefix.length)

  if (newPrefix.length == 1)
    {
      db.set(`prefix-${message.guild.id}`, newPrefix)
      message.channel.send(`Prefix Set As ${newPrefix}`)
      return;
    }
    message.channel.send("A Single Character Can Only Be Used As Custom Prefix")
  }
  else
  message.channel.send("Sorry But You Need Manage Server Permission")

  
})

command(bot, "deleteprefix", message =>
{
  if (message.member.permissions.has("MANAGE_GUILD") || message.member.permissions.has("ADMINISTRATOR"))
  {

  var customPrefix = db.get(`prefix-${message.channel.guild.id}`)

  if (typeof customPrefix == "null" || customPrefix == null) return message.channel.send("No Prefix Has Been Set")


  if (customPrefix.length == 1)
    {
      db.delete(`prefix-${message.channel.guild.id}`)
      message.channel.send(`Prefix ${customPrefix} has been deleted`)
      return;
    }
  }
  else
  {
    message.channel.send("You Need Manage Server Permission")
  }
})

/*bot.on("messageCreate", message =>
{
  var tagged = message.mentions.users.first()
  if (tagged == null || typeof tagged == "undefined") return
  if (tagged.id === "862304613185093642")
  {
    var prefix = getPrefix(message)
    message.channel.send(`The Prefix For This Server Is ${prefix} use ${prefix}setprefix to change`).then(msg =>
    {
      setTimeout(() => msg.delete(), 6000)
    })
  }
})*/

command(bot, "prefix", message =>
{
  var prefix = getPrefix(message)
  message.channel.send(`Use ${prefix}setprefix to set a custom prefix <Character> and use ${prefix}deleteprefix to delete \n The current prefix for this server is ${prefix}`)
})

}
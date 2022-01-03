const command = require("./command")
const fetch = require("node-fetch")
const db = require("quick.db")
const {MessageEmbed} = require("discord.js")

module.exports = bot =>
{
  const answers = [`Hey I'm Nekie, who are u?`, `I'm Nekie A Multipurpose Bot, wbu?`, `I'm A Smart Bot Made By A Smart Man, btw who u?`, `First Tell Me Who Are U....`, `None Of Your Buisness`, `Won't Tell Lmao`]

 const randomAns = message =>
 {
   var max = answers.length
   var index = Math.random() * max
   index = Math.round(index)
   var answer = answers[index]
   return answer
 }

 bot.on("messageCreate", async message =>
 {
   var tagged = message.mentions.users.first()
   if (!tagged) return
   if (tagged.id == "908429371755335733")
   {
     var check = db.get(`autochat-${message.guild.id}`)
     
     if (!check)
     {
       message.channel.send("AI Chat Is Disabled, use !aichat <on,off>").then(msg => {
         setTimeout(()=> msg.delete(), 2000)
       })
       return
     }

     var text = message.content.replace("<@908429371755335733>", " ")
     text = text.trim().toLowerCase()
     if (text == " " || typeof text == "undefined" || typeof text == "null" || typeof text == "") return

     message.channel.sendTyping()

     if (text.startsWith("who are you") || text.startsWith("who are u") || text.startsWith("may i know you are you") || text.startsWith("introduce yourself"))
     {
       message.channel.send(randomAns(message))
       return
     }
     else if (text.startsWith("i was created by") || text.startsWith("my dear great botmaster") || text.startsWith(":-) i was created by") || text.startsWith(":-) my dear great botmaster") || text.startsWith(":-) i was created by"))
     {
       message.channel.send("Tostiffent Is My Master!")
     }

      try{
     fetch.default(`https://api.monkedev.com/fun/chat?msg=${text}&uid=${message.author.id}`)
     .then(res => res.json())
     .then(data => {
       console.log(data)
       if (data.response.toLowerCase().startsWith("my name is") || data.response.toLowerCase().startsWith("you know i'm") || data.response.toLowerCase().startsWith("i believe you asked that before"))
       {
         message.channel.send(randomAns(message))
         return
       }
       message.reply({content: data.response})
     })
      } catch {
        message.reply({
          content: `Chat Bot Is Having An Issue Try Later`
        })
      }
   }
 })

 command(bot, "aichat", message =>
 {
   var split = message.content.split(" ")
   var cmd = split[1]
   if (cmd == "on")
   {
     db.set(`autochat-${message.guild.id}`, "true")
     message.channel.send("AI Chat Bot Has Been Enabled, Ping The Bot With A Message To Use")
     return;
   }
   else if (cmd == "off")
   {
     db.delete(`autochat-${message.guild.id}`)
     message.channel.send("AI Chat Bot Has Been Disabled")
     return;
   }
 })

 command(bot, "dogfact", message =>
 {
    message.channel.sendTyping()

     fetch.default(`https://api.monkedev.com/facts/dog`)
     .then(res => res.json())
     .then(data => {
       const embed = new MessageEmbed()
       .setTitle(data.fact)
       message.reply({embeds: [embed]})
     })
 })

 command(bot, "catfact", message =>
 {
        message.channel.sendTyping()

     fetch.default(`https://api.monkedev.com/facts/cat`)
     .then(res => res.json())
     .then(data => {
       const embed = new MessageEmbed()
       .setTitle(data.fact)
       message.reply({embeds: [embed]})
     })
 })

 command(bot, "monkeyfact", message =>
 {
        message.channel.sendTyping()

     fetch.default(`https://api.monkedev.com/facts/monkey`)
     .then(res => res.json())
     .then(data => {
       const embed = new MessageEmbed()
       .setTitle(data.fact)
       message.reply({embeds: [embed]})
     })
 })

 const getPrefix = message => {
  var prefix = db.get(`prefix-${message.guild.id}`)

  if (prefix == null || typeof prefix == "null")
  {
    prefix = "!"
  }
  return prefix
  }

 command(bot, "ask", message =>
 {
    message.channel.sendTyping()
    var prefix = getPrefix(message)

    var text = message.content.replace(`${prefix}ask`, " ")
    text = text.trim()

    if (!text)
    {
      message.channel.send(`Ask A Question -_-`)
      return
    }

     fetch.default(`https://api.monkedev.com/fun/8ball`)
     .then(res => res.json())
     .then(data => {
       const embed = new MessageEmbed()
       .setTitle(`${message.author.username} Asked: ${text}`)
       .setDescription(`Nekie Says: ${data.answer}`)
       message.reply({embeds: [embed]})
     })
 })
}
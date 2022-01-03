const command = require("./command")
const translate = require('@iamtraction/google-translate');
const snipeSchema = require("./schemas/snipe-Schema")
const mongo = require("./mongo")
const Discord = require('discord.js')
const https = require('https');
const url = 'https://www.reddit.com/r/memes/hot/.json?limit=10000'
const urlCats = 'https://www.reddit.com/r/Blep/hot/.json?limit=10000'
const fetch = require("node-fetch")
const db = require("quick.db")
const {MessageButton, MessageActionRow, MessageEmbed} = require("discord.js")
const ud = require('urban-dictionary')
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

  let deleteButton = new MessageButton()
            .setStyle('DANGER')
            .setLabel('🗑️')
            .setCustomId("delete")

    const row = new MessageActionRow()
    .addComponents(deleteButton)

  command(bot, "test", message =>
  {
    message.channel.send({content: "testing", components: [row]})
  })

  var questions = ["absolutly", "no chance", "ask again later", "it is said so", "igs"]
  var percentage
  const randomNum = message =>
  {
  var max = 101;
  var num = Math.random() * max
  return percentage = Math.round(num)
  }

  const randomNumGif = message =>
  {
  var max = message.length;
  var num = Math.random() * max
  return percentage = Math.round(num)
  }

  const randomQNum = message =>
  {
  max = 4
  var num = Math.random() * max
  return percentage = Math.round(num)
  }

  command(bot, "gayrate", message =>
  {
    var pinged = message.mentions.users.first();
    if (pinged == null)
    {
      message.channel.send(`${message.author.username} is ${randomNum()}% Gae 🏳️‍🌈`)
    }
    else
    {
      message.channel.send(`${pinged.username} is ${randomNum()}% Gae 🏳️‍🌈`)
    }
  })

  command(bot, "simprate", message =>
  {
    var pinged = message.mentions.users.first();
    if (pinged == null)
    {
      message.channel.send(`${message.author.username} is ${randomNum()}% Simp`)
    }
    else
    {
      message.channel.send(`${pinged.username} is ${randomNum()}% Simp`)
    }
  })

  command(bot, "hornyrate", message =>
  {
    var pinged = message.mentions.users.first();
    if (pinged == null)
    {
      message.channel.send(`${message.author.username} is ${randomNum()}% Horny 😳`)
    }
    else
    {
      message.channel.send(`${pinged.username} is ${randomNum()}% Horny 😳`)
    }
  })

 /* command(bot, "ask", message =>
  {
    var prefix = getPrefix(message)

    var question = message.content.replace(`${prefix}ask`, " ")
    question = question.trim();
    if (question == null)
    {
      message.channel.send(`Ask A Question -_-`)
    }
    else
    {
      var num = randomQNum(message)
      message.channel.send(`Question: ${question} \n Answer: ${questions[num]}`)
    }
  })*/

  command(bot, "nuke", message =>
  {
    message.channel.send("`Hostile Nuke Inbound...`(0.0%)").then((msg) =>
    {
      setTimeout(() => msg.edit("`Logging Into System...` (5.3%)"), 2000)
      setTimeout(() => msg.edit(`Owner Found ${message.guild.owner.user.username} (13.8%)`), 7000)
      setTimeout(() => msg.edit("`Owner Hacked...`(23.7%)"), 10000)
      setTimeout(() => msg.edit("`Accessing Server Roles...`(29.9%)"), 13000)
      setTimeout(() => msg.edit("`Deleted All Roles...`(47.59%)"), 16000)
      setTimeout(() => msg.edit("`Fetching channels...`(54.86%)"), 19000)
      setTimeout(() => msg.edit("`Channels Deleted Data Collected...`(64.56%)"), 22000)
      setTimeout(() => msg.edit("`Selling Data Somehwere...`(69.69%)"), 25000)
      setTimeout(() => msg.edit("`Exiting System...`(89.87%)"), 27000)
      setTimeout(() => msg.edit("`Server Nuke Success...`(100%) (Its real trust me)"), 30000)
    })
  })

  command(bot, "ping", message =>
  {
    message.channel.send(`🏓Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`).catch(err => {null})
  })

  command(bot, "bugReport", message =>
  {
    message.channel.send("To Report Join My Server And Dm Me Tostiffent#6969 \n https://discord.gg/AqJVGQDgYF")
  })

  command(bot, "support", message =>
  {
    message.channel.send("https://discord.gg/AqJVGQDgYF").catch(err => {null})
  })

  command(bot, "privacy", message =>
  {
    message.channel.send("1) The Data Collected By The Bot is only for the purpose of registring entries for giveaway and bump reminder \n 2) The Data Collected Is GuildID and UserID and Few ChannelID in Case Of Sending Bump Reminder Messages \n 3) This Data Is Used To Improve Your Experience With The Bot \n 4) The Collected Info Is Visible and Shared With Only The Owner Of The Bot \n 5) If You Have Any Concerns Regarding The Bot Feel Free To Join Our support Server And Contact Tostiffent#6969 \n 6) The Data Can Be Removed By Removing The bot From The Server And Contacting The Developer \n 7) The Data Is Stored In A Secure Database Which Cannot Be Accessed By Anyone But The Bot Owner")
  })

  command (bot, "translate", async message =>
  {
    var prefix = getPrefix(message)

    var text = message.content.replace(`${prefix}translate`, " ")
    text = text.trim()
    if (text == null || text == " " || text == "")
    {
      message.channel.send("Provide Some Text Sir")
      return;
    }
    const translated = await translate(text, { to: 'en'})
    message.channel.send(`Translated: ${translated.text}`)
  })

   bot.on("messageDelete", async message =>
{
  try{
  var name = message.author.username;
  var text = message.content;
  if (message.author.id == "849905403021361162")
  {
    text = "Lmfao You Cannot Snipe Me"
  }
  }
  catch{
    null
  }
  var channelID = message.channel.id
  const snipe = {
    username: `${name}`,
    snipeText: `${text}`,
  }

  await db.set(`snipe-${channelID}`,snipe)
})

 command(bot,"snipe", async message =>
 {
   if (!db.has(`snipe-${message.channel.id}`)) return message.channel.send("Notting To Snipe");

   var sniped = await db.get(`snipe-${message.channel.id}`)

  const snipeEmbed = new Discord.MessageEmbed()
  .setTitle(`${sniped.username} Said:`)
  .setColor("RANDOM")
  .setDescription(`${sniped.snipeText}`)
  .setThumbnail("https://cdn.discordapp.com/attachments/862307473162502174/864445060358471720/clown-5862845_960_720.png")

  message.channel.send({embeds: [snipeEmbed]}).catch(err => {null})
   
 })


  command(bot,"emoji", message =>
{
  const split = message.content.split(":")
  const checkSplit1 = split[0]
  if (typeof checkSplit1 == "undefined" || checkSplit1 == "" || checkSplit1 == null ) return;

  const checkSplit = checkSplit1.split(" ")

  if (typeof checkSplit == "undefined" || checkSplit == " " || checkSplit == null || checkSplit.length != 2) return;

  var check = checkSplit[1]
  const emojiSplit = split[2]

  if (typeof emojiSplit == "undefined" || emojiSplit == null) return;

  const split2 = emojiSplit.split(">")
  var id = split2[0]

  if (check == "<a")
  {
    message.channel.send(`https://cdn.discordapp.com/emojis/${id}.gif`)
  }
  else 
  {
    message.channel.send(`https://cdn.discordapp.com/emojis/${id}.png`)
  }
})

bot.on('interactionCreate', async(button) =>{
  if (button.customId == "nextMeme")
  {
    https.get(url, async (result) => {
            var body = ''
            result.on('data', async (chunk) => {
                body += chunk
            })

            result.on('end', async () => {
                var response = JSON.parse(body)
                var index = response.data.children[Math.floor(Math.random() * 99) + 1].data

                if (index.post_hint !== 'image') {

                    var text = index.selftext
                    const textembed = new Discord.MessageEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                  await button.update({content: "Meme", embeds: [textembed]})
                }

                var image = index.preview.images[0].source.url.replace('&amp;', '&')
                var title = index.title
                var link = 'https://reddit.com' + index.permalink
                var subRedditName = index.subreddit_name_prefixed

                if (index.post_hint !== 'image') {
                    const textembed = new Discord.MessageEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                   await button.update({content: "Meme", embeds: [textembed]})
                }
                const imageembed = new Discord.MessageEmbed()
                    .setTitle(subRedditName)
                    .setImage(image)
                    .setColor("RANDOM")
                    .setDescription(`[${title}](${link})`)
                    .setURL(`https://reddit.com/${subRedditName}`)
                    .setFooter(`Requested By: ${button.user.username}`)
                    
                await button.update({content: "Meme", embeds: [imageembed]})

            }).on('error', function (e) {
                console.log('Got an error: ', e)
            })
  })
  }
  else if(button.customId == "nextCat")
  {
    https.get(urlCats, (result) => {
            var body = ''
            result.on('data', (chunk) => {
                body += chunk
            })

            result.on('end', async () => {
                var response = JSON.parse(body)
                var index = response.data.children[Math.floor(Math.random() * 99) + 1].data

                if (index.post_hint !== 'image') {

                    var text = index.selftext
                    const textembed = new Discord.MessageEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                     await button.update({content: "Meme", embeds: [textembed]})
                }

                var image = index.preview.images[0].source.url.replace('&amp;', '&')
                var title = index.title
                var link = 'https://reddit.com' + index.permalink
                var subRedditName = index.subreddit_name_prefixed

                if (index.post_hint !== 'image') {
                    const textembed = new Discord.MessageEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                    await button.update({content: "Meme", embeds: [textembed]})
                }
                const imageembed = new Discord.MessageEmbed()
                    .setTitle(subRedditName)
                    .setImage(image)
                    .setColor("RANDOM")
                    .setDescription(`[${title}](${link})`)
                    .setURL(`https://reddit.com/${subRedditName}`)
                    .setFooter(`Requested By: ${button.clicker.user.username}`)
                    
                    await button.update({content: "Meme", embeds: [imageembed]})

            }).on('error', function (e) {
                console.log('Got an error: ', e)
            })
  })
  }
  else if (button.customId == "delete")
    {
      const user = await button.guild.members.fetch({user: button.user.id, force: true})

      if (user.permissions.has("MANAGE_MESSAGES"))
      {
        await button.reply("Deleted")
        button.message.delete().catch(err => {console.log("cannot delete msg funpercentage 324")})
        return;
      }
      else
      {
        await button.reply("You Cannot Perform This Action")
        return;
      }
    }
    else if (button.customId == "save")
    {
      message = button.message
      button.user.send(message.embeds[0].image.url)
    }

})

command(bot,"meme", message =>
{
  let memeButton = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Next 😂')
            .setCustomId("nextMeme")

  let saveButton = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Save')
            .setCustomId("save")

  let deleteButton = new MessageButton()
            .setStyle('DANGER')
            .setLabel('🗑️')
            .setCustomId("delete")
  
  const row = new MessageActionRow()
    .addComponents(memeButton)
    .addComponents(saveButton)
    .addComponents(deleteButton)

  https.get(url, (result) => {
            var body = ''
            result.on('data', (chunk) => {
                body += chunk
            })

            result.on('end', () => {
                var response = JSON.parse(body)
                var index = response.data.children[Math.floor(Math.random() * 99) + 1].data

                if (index.post_hint !== 'image') {

                    var text = index.selftext
                    const textembed = new Discord.MessageEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                    message.channel.send({embeds: [textembed]})
                }

                var image = index.preview.images[0].source.url.replace('&amp;', '&')
                var title = index.title
                var link = 'https://reddit.com' + index.permalink
                var subRedditName = index.subreddit_name_prefixed

                if (index.post_hint !== 'image') {
                    const textembed = new Discord.MessageEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                    message.channel.send({embeds: [textembed]})
                }
                const imageembed = new Discord.MessageEmbed()
                    .setTitle(subRedditName)
                    .setImage(image)
                    .setColor("RANDOM")
                    .setDescription(`[${title}](${link})`)
                    .setURL(`https://reddit.com/${subRedditName}`)
                    .setFooter(`Requested By: ${message.author.username}`)
                message.channel.send({
                  content: `${message.author.toString()} Here Is A Meme`,
                  embeds: [imageembed],
                  components: [row]
                })
            }).on('error', function (e) {
                console.log('Got an error: ', e)
            })
  })
})

command(bot,"hug", async message =>
{
  const pinged = message.mentions.users.first();
  var name;

  if (pinged != null)
  {
    name = pinged.username
  }
  else
  {
    name = message.author.username
  }

  let url = `https://g.tenor.com/v1/search?q=hugAnime&key=${process.env.TENOR}&limit=100`
  let responce = await fetch(url)
  let json = await responce.json();
  let index = randomNumGif(json.results)

  const hugEmbed = new Discord.MessageEmbed()
  .setTitle(`${message.author.username} Hugs ${name}`)
  .setImage(`${json.results[index].media[0].gif.url}`)
  .setColor("RANDOM")
  .setURL(`${json.results[index].url}`)
  .setFooter(`Requested By: ${message.author.username}`)

  message.channel.send({ embeds: [hugEmbed]})

})



command(bot,"slap", async message =>
{
  const pinged = message.mentions.users.first();
  var name;

  if (pinged != null)
  {
    name = pinged.username
  }
  else
  {
    name = message.author.username
  }

  let url = `https://g.tenor.com/v1/search?q=slapAnime&key=${process.env.TENOR}&limit=100`
  let responce = await fetch(url)
  let json = await responce.json();
  let index = randomNumGif(json.results)

  const hugEmbed = new Discord.MessageEmbed()
  .setTitle(`${message.author.username} Slaped ${name}`)
  .setImage(`${json.results[index].media[0].gif.url}`)
  .setColor("RANDOM")
  .setURL(`${json.results[index].url}`)
  .setFooter(`Requested By: ${message.author.username}`)

  message.channel.send({ embeds: [hugEmbed]})

})

command(bot,"kill", async message =>
{
  const pinged = message.mentions.users.first();
  var name;

  if (pinged != null)
  {
    name = pinged.username
  }
  else
  {
    name = message.author.username
  }

  let url = `https://g.tenor.com/v1/search?q=killAmongus&key=${process.env.TENOR}&limit=100`
  let responce = await fetch(url)
  let json = await responce.json();
  let index = randomNumGif(json.results)

  const hugEmbed = new Discord.MessageEmbed()
  .setTitle(`${message.author.username} Kills ${name}`)
  .setImage(`${json.results[index].media[0].gif.url}`)
  .setColor("RANDOM")
  .setURL(`${json.results[index].url}`)
  .setFooter(`Requested By: ${message.author.username}`)

  message.channel.send({ embeds: [hugEmbed]})

})

command(bot,"kiss", async message =>
{
  const pinged = message.mentions.users.first();
  var name;

  if (pinged != null)
  {
    name = pinged.username
  }
  else
  {
    name = message.author.username
  }

  let url = `https://g.tenor.com/v1/search?q=AnimeKiss&key=${process.env.TENOR}&limit=100`
  let responce = await fetch(url)
  let json = await responce.json();
  let index = randomNumGif(json.results)

  const hugEmbed = new Discord.MessageEmbed()
  .setTitle(`${message.author.username} Kisses ${name}`)
  .setImage(`${json.results[index].media[0].gif.url}`)
  .setColor("RANDOM")
  .setURL(`${json.results[index].url}`)
  .setFooter(`Requested By: ${message.author.username}`)

  message.channel.send({ embeds: [hugEmbed]})

})

command(bot,"pat", async message =>
{
  const pinged = message.mentions.users.first();
  var name;

  if (pinged != null)
  {
    name = pinged.username
  }
  else
  {
    name = message.author.username
  }

  let url = `https://g.tenor.com/v1/search?q=AnimePat&key=${process.env.TENOR}&limit=100`
  let responce = await fetch(url)
  let json = await responce.json();
  let index = randomNumGif(json.results)

  const hugEmbed = new Discord.MessageEmbed()
  .setTitle(`${message.author.username} Pats ${name}`)
  .setImage(`${json.results[index].media[0].gif.url}`)
  .setColor("RANDOM")
  .setURL(`${json.results[index].url}`)
  .setFooter(`Requested By: ${message.author.username}`)

  message.channel.send({ embeds: [hugEmbed]})

})


command(bot,"lick", async message =>
{
  const pinged = message.mentions.users.first();
  var name;

  if (pinged != null)
  {
    name = pinged.username
  }
  else
  {
    name = message.author.username
  }

  let url = `https://g.tenor.com/v1/search?q=AnimeLick&key=${process.env.TENOR}&limit=100`
  let responce = await fetch(url)
  let json = await responce.json();
  let index = randomNumGif(json.results)

  const hugEmbed = new Discord.MessageEmbed()
  .setTitle(`${message.author.username} Licks ${name}`)
  .setImage(`${json.results[index].media[0].gif.url}`)
  .setColor("RANDOM")
  .setURL(`${json.results[index].url}`)
  .setFooter(`Requested By: ${message.author.username}`)

  message.channel.send({ embeds: [hugEmbed]})

})



command(bot, "cat", message =>
{
  let memeButton = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Next 😂')
            .setCustomId("nextMeme")

  let saveButton = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('Save')
            .setCustomId("save")

  let deleteButton = new MessageButton()
            .setStyle('DANGER')
            .setLabel('🗑️')
            .setCustomId("delete")
  
  const row = new MessageActionRow()
    .addComponents(memeButton)
    .addComponents(saveButton)
    .addComponents(deleteButton)

  https.get(urlCats, (result) => {
            var body = ''
            result.on('data', (chunk) => {
                body += chunk
            })

            result.on('end', () => {
                var response = JSON.parse(body)
                var index = response.data.children[Math.floor(Math.random() * 99) + 1].data

                if (index.post_hint !== 'image') {

                    var text = index.selftext
                    const textembed = new Discord.MessageEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                    message.channel.send(textembed)
                }

                var image = index.preview.images[0].source.url.replace('&amp;', '&')
                var title = index.title
                var link = 'https://reddit.com' + index.permalink
                var subRedditName = index.subreddit_name_prefixed

                if (index.post_hint !== 'image') {
                    const textembed = new Discord.MessageEmbed()
                        .setTitle(subRedditName)
                        .setColor(9384170)
                        .setDescription(`[${title}](${link})\n\n${text}`)
                        .setURL(`https://reddit.com/${subRedditName}`)

                    message.channel.send(textembed)
                }
                const imageembed = new Discord.MessageEmbed()
                    .setTitle(subRedditName)
                    .setImage(image)
                    .setColor("RANDOM")
                    .setDescription(`[${title}](${link})`)
                    .setURL(`https://reddit.com/${subRedditName}`)
                    .setFooter(`Requested By: ${message.author.username}`)
                message.channel.send({
                  content: `${message.author.toString()} Here Is A Cat`,
                  embed: imageembed,
                  components: [row]
                })
            }).on('error', function (e) {
                console.log('Got an error: ', e)
            })
  })
})

bot.on("interactionCreate", async interaction =>
{
  if (!interaction.isContextMenu()) return

  if (interaction.commandName == "hug")
  {
    interaction.deferReply()
    channel = interaction.channel
    targetMsg = await channel.messages.fetch(interaction.targetId)
    var user = await targetMsg.author.username
    let url = `https://g.tenor.com/v1/search?q=AnimeHug&key=${process.env.TENOR}&limit=100`
  let responce = await fetch(url)
  let json = await responce.json();
  let index = randomNumGif(json.results)

  const hugEmbed = new Discord.MessageEmbed()
  .setTitle(`${interaction.user.username} Hugs ${user}`)
  .setImage(`${json.results[index].media[0].gif.url}`)
  .setColor("RANDOM")
  .setURL(`${json.results[index].url}`)
  .setFooter(`Requested By: ${interaction.user.username}`)

  interaction.followUp({ embeds: [hugEmbed]})
  }
})

command(bot, "define", message =>
  {
    var count = 0;
    var prefix = getPrefix(message)
    var text = message.content.replace(`${prefix}define`, " ")
     text = text.trim().toLowerCase()

     if (!text || text == "" || text == " ")
     {
       return message.channel.send("Please Give Something To Search")
     }

    ud.define(text).then((results) => {

  Object.entries(results[0]).forEach(([key, prop]) => {
    if (count == 0)
    {
      const embed = new MessageEmbed()
      .setTitle("Definition")
      .setDescription(`\`Question:\` ${text} \n\n \`Definition:\` ${prop} \n\n **NOTE: These Are Not The Right Definitions**`)
      .setColor("RANDOM")
      .setFooter(`Requested By ${message.author.username}`)
      message.channel.send({embeds: [embed]})
      count = 1;
    }
  })
}).catch((error) => {
  message.channel.send(`No Results`)
})

  })


  command(bot, "someone", message =>
  {
    message.guild.members.fetch().then(members =>
    {
      console.log(members.length)
    })
  })
}
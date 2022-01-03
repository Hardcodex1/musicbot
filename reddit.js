const command = require("./command")
const mongo = require("./mongo")
const redditSchema = require("./schemas/reddit-Schema")
const db = require("quick.db")
const https = require('https');
const Discord = require("discord.js")

module.exports = bot =>
{
  command(bot, "redditchannel", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADMINISTRATOR"))
    {
      message.reply({
        constent: "You Need ADMIN Or Manage Sever Permission"
      })
      return;
    }

   var channelID = message.channel.id;
   var guildID = message.guild.id

   await redditSchema.findOneAndUpdate(
   {
     channelID: channelID,
   },
   {
     name: "redditPosts",
     channelID: channelID,
     guildID: guildID,
   },
   {
     upsert: true,
     new: true,
   })

   message.reply({content: "Channel Set For Reddit Posts, Use !redditadd to add posts"})

  })

  const randomNumGif = message =>
  {
  var max = message.length - 1;
  var num = Math.random() * max
  return percentage = Math.round(num)
  }

  const getPrefix = message => {
  var prefix = db.get(`prefix-${message.guild.id}`)

  if (prefix == null || typeof prefix == "null")
  {
    prefix = "!"
  }
  return prefix
  }

  command(bot, "redditadd", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADMINISTRATOR"))
    {
      message.reply({
        constent: "You Need ADMIN Or Manage Sever Permission"
      })
      return;
    }

    var check = await redditSchema.find({
      channelID: message.channel.id
    })

    if (typeof check[0] == "undefined") return message.reply({
      content: "This Channel Is Not Set For Reddit Posts, use !redditchannel"
    })

    var prefix = getPrefix(message)

    var text = message.content.replace(`${prefix}redditadd`, " ")
    text = text.trim()

    if (text.startsWith("r/") || text.startsWith("R/")) return message.reply({content: "Please enter the case sensitive name of the subreddit without r/"})

    await redditSchema.findOneAndUpdate({
      channelID: message.channel.id
    },
    {
      $addToSet: {
        subReddits: text
      }
    })

    message.reply({
      content: `Subreddit ${text} added. If Any Error occurs delete subreddit name using !redditdelete <name> and add the right one. \n **Please Wait Few Mins For The First Post To Appear**`
    })
  })

  function setTime()
  {
    setTimeout(() => sendPost("abcd"), 1000 * 60 * 10)
  }

  const sendPost = async message =>
  {
   var servers = await redditSchema.find({
      name: "redditPosts"
    })

    if (typeof servers[0] == "undefined")
    {
      setTime()
      return
    }

    if (typeof servers[0].subReddits[0] == "undefined")
    {
      setTime()
      return
    }

    var i = 0;
    myLoop()

    function myLoop() {
      setTimeout(function() {
        console.log(`Sending Post ${i}`)
      const {channelID, guildID, subReddits} = servers[i]

      var guild = bot.guilds.cache.get(guildID)
      if (!guild) return
      var channel = guild.channels.cache.get(channelID)

      var index = randomNumGif(subReddits)

      var url = `https://www.reddit.com/r/${subReddits[index]}/hot/.json?limit=10000`

      https.get(url, (result) => {
                var body = ''
                var chunked = false
                result.on('data', (chunk) => {
                    body += chunk
                    if (chunked == false){
                        chunked = true
                    }
                })
                result.on('end', () => {
                    if (body.length > 1000){
                        var response = JSON.parse(body)
                        var postChildren = []
                       if (channel.nsfw == false && channel.id != "864008840319860786"){
                            var postsNumber = 0
                            for (var number = 0; number < response.data.children.length; number++){
                                postChildren.push(number)
                            }
                            for (var found = false; found == false; postsNumber ++){
                                if (postChildren.length > 0){
                                    var index1 = Math.floor(Math.random() * (postChildren.length))
                                    var index2 = postChildren[index1]
                                    if (response.data.children[index2].data.over_18 == true){
                                        postChildren.splice(index1, 1)
                                    } else {
                                        var index = response.data.children[index2].data
                                        var found = true
                                    }
                                } else {
                                    var found = true
                                }
                            }
                        } else {
                            var index = response.data.children[Math.floor(Math.random() * (response.data.children.length-1)) + 1].data
                        }
                        if (postChildren.length > 0 || channel.nsfw || channel.id == "864008840319860786" || channel.id == "858910801447092278"){
                            var title = index.title
                            var link = 'https://reddit.com' + index.permalink
                            var subRedditName = index.subreddit_name_prefixed
                            if (index.post_hint !== 'image') {
                                var text = index.selftext
                                if (title.length > 256) {
                                    title = (title.substring(0, 253) + "...")
                                } 
                                if (text.length > 2048) {
                                    text = (text.substring(0, 2045) + "...")
                                } 
                                const textembed = new Discord.MessageEmbed()
                                .setTitle(title)
                                .setColor('#ff0000')
                                .setDescription(text)
                                .setURL(link)
                                channel.send({emebds: [textembed]})
                            }
                            if (index.post_hint == 'image'){
                                var image = index.preview.images[0].source.url.replace('&amp;', '&')
                                if (title.length > 256) {
                                    title = (title.substring(0, 253) + "...")
                                } 
                                const imageembed = new Discord.MessageEmbed()
                                .setTitle(title)
                                .setImage(image)
                                .setColor('#ff0000')
                                .setURL(link)
                                channel.send({embeds: [imageembed]})  
                            }
                        } else {
                            channel.send('Could not find a Post From One Of The Subreddits that was not nsfw')
                        }
                    } else {
                        channel.send(`Could not find subreddit ${subReddits[index]}, please make sure the name is case sensitive`)
                    }
                }).on('error', function (e) {
                    console.log('Got an error: ', e)
                })
            })
        i++
        if (i < servers.length){
          myLoop()
        }
      }, 5000)
     }
     setTime()
  }

  command(bot, "setTime", message =>
  {
    setTime()
  })

  command(bot, "sendRestartPost", message =>
  {
    restartPost()
  })

  command(bot, "redditstop", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADMINISTRATOR"))
    {
      message.reply({
        constent: "You Need ADMIN Or Manage Sever Permission"
      })
      return;
    }

    await redditSchema.deleteMany({
      channelID: message.channel.id
    })

    message.channel.send("Reddit Posts Stopped For This Channel")
  })

  command(bot, "redditcheck", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADMINISTRATOR"))
    {
      message.reply({
        constent: "You Need ADMIN Or Manage Sever Permission"
      })
      return;
    }

   var result = await redditSchema.find({
      channelID: message.channel.id
    })

    if (typeof result[0] == "undefined") return message.channel.send("Channel Not Set For Reddit Posts")

    if (typeof result[0].subReddits[0] == "undefined") return message.channel.send("No Sub Reddits Added")

    var msg = ""

    for (var i = 0; i < result[0].subReddits.length; i++)
    {
      msg = msg + `r/${result[0].subReddits[i]}, `
    }

    const embed = new Discord.MessageEmbed()
    .setTitle(`SubReddits In ${message.channel.name}`)
    .setDescription(msg)
    .setColor("RANDOM")

    message.channel.send({embeds: [embed]})
  })

  command(bot, "redditdelete", async message =>
  {
    if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.permissions.has("ADMINISTRATOR"))
    {
      message.reply({
        constent: "You Need ADMIN Or Manage Sever Permission"
      })
      return;
    }

    var check = await redditSchema.find({
      channelID: message.channel.id
    })

    if (typeof check[0] == "undefined") return message.reply({
      content: "This Channel Is Not Set For Reddit Posts, use !redditchannel"
    })

    if (typeof check[0].subReddits[0] == "undefined") return message.reply({
      content: "This Channel Has No Subreddits, use !redditadd"
    })

    var prefix = getPrefix(message)

    var text = message.content.replace(`${prefix}redditdelete`, " ")
    text = text.trim()

    await redditSchema.findOneAndUpdate({
      channelID: message.channel.id
    },
    {
      $pull: {
        subReddits: text
      }
    })

    message.reply({content: `${text} has been deleted (if it existed lmao)`})
  })

  const restartPost = async message =>
  {
   var servers = await redditSchema.find({
      name: "redditPosts"
    })

    console.log(servers)

    if (typeof servers[0] == "undefined")
    {
      setTime()
      return;
    }

    if (typeof servers[0].subReddits[0] == "undefined")
    {
      setTime()
      return
    }

    var i = 0;
    myLoop()

    function myLoop() {
      setTimeout(function() {
        console.log(`Sending Post ${i}`)
      const {channelID, guildID, subReddits} = servers[i]

      var guild = bot.guilds.cache.get(guildID)
      if (!guild) return
      var channel = guild.channels.cache.get(channelID)

      var index = randomNumGif(subReddits)

      var url = `https://www.reddit.com/r/${subReddits[index]}/hot/.json?limit=10000`

      https.get(url, (result) => {
                var body = ''
                var chunked = false
                result.on('data', (chunk) => {
                    body += chunk
                    if (chunked == false){
                        chunked = true
                    }
                })
                result.on('end', () => {
                    if (body.length > 1000){
                        var response = JSON.parse(body)
                        var postChildren = []
                       if (channel.nsfw == false && channel.id != "864008840319860786"){
                            var postsNumber = 0
                            for (var number = 0; number < response.data.children.length; number++){
                                postChildren.push(number)
                            }
                            for (var found = false; found == false; postsNumber ++){
                                if (postChildren.length > 0){
                                    var index1 = Math.floor(Math.random() * (postChildren.length))
                                    var index2 = postChildren[index1]
                                    if (response.data.children[index2].data.over_18 == true){
                                        postChildren.splice(index1, 1)
                                    } else {
                                        var index = response.data.children[index2].data
                                        var found = true
                                    }
                                } else {
                                    var found = true
                                }
                            }
                        } else {
                            var index = response.data.children[Math.floor(Math.random() * (response.data.children.length-1)) + 1].data
                        }
                        if (postChildren.length > 0 || channel.nsfw || channel.id == "864008840319860786" || channel.id == "858910801447092278"){
                            var title = index.title
                            var link = 'https://reddit.com' + index.permalink
                            var subRedditName = index.subreddit_name_prefixed
                            if (index.post_hint !== 'image') {
                                var text = index.selftext
                                if (title.length > 256) {
                                    title = (title.substring(0, 253) + "...")
                                } 
                                if (text.length > 2048) {
                                    text = (text.substring(0, 2045) + "...")
                                } 
                                const textembed = new Discord.MessageEmbed()
                                .setTitle(title)
                                .setColor('#ff0000')
                                .setDescription(text)
                                .setURL(link)
                                channel.send({emebds: [textembed]})
                            }
                            if (index.post_hint == 'image'){
                                var image = index.preview.images[0].source.url.replace('&amp;', '&')
                                if (title.length > 256) {
                                    title = (title.substring(0, 253) + "...")
                                } 
                                const imageembed = new Discord.MessageEmbed()
                                .setTitle(title)
                                .setImage(image)
                                .setColor('#ff0000')
                                .setURL(link)
                                channel.send({embeds: [imageembed]})  
                            }
                        } else {
                            channel.send('Could not find a Post From One Of The Subreddits that was not nsfw')
                        }
                    } else {
                        channel.send(`Could not find subreddit ${subReddits[index]}, please make sure the name is case sensitive`)
                    }
                }).on('error', function (e) {
                    console.log('Got an error: ', e)
                })
            })
        i++
        if (i < servers.length){
          myLoop()
        }
      }, 5000)
     }
  }

  command(bot, "reddit", message =>
  {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Help For Reddit **SENDS A POST EVERY 10 MINS**`)
    .setDescription("Here Are The Commands")
    .addFields(
    {
      name: " <:1143arrowturquoise:878921659820695622>`!redditchannel`",
      value: "Sets The Channel For Reddit Posts",
    },
    {
      name: " <:1143arrowturquoise:878921659820695622>`!redditadd <subreddit name case sensitive>`",
      value: "This adds that particular subreddit, NOTE: Enter the exact name For Example memes cannot be written as Memes"
    },
    {
      name: "<:1143arrowturquoise:878921659820695622>`!redditdelete <sub Reddit name>`",
      value: "Deletes That Subreddit",
    },
    {
      name: "<:1143arrowturquoise:878921659820695622>`!redditcheck`",
      value: "Use To Check The Sub Reddits Added",
    },
    {
      name: "<:1143arrowturquoise:878921659820695622>`!redditstop`",
      value: "Stops All Reddit Posts For That Channel"
    },
    {
      name: "`**Warning**`",
      value: "`If You Add Any NSFW Sub Reddits It Won't Send Unless Channel Is Marked As NSFW`"
    },
    )
    .setColor("#FFFF00")
    message.reply({embeds: [embed]})
  })
}
const mongoose = require("mongoose")

const redditSchema = mongoose.Schema({
  name: String,
  channelID: String,
  guildID: String,
  subReddits: [String],
})

module.exports = mongoose.model("Reddit Post Channels", redditSchema)
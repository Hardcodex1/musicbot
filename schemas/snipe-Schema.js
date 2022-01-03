const mongoose = require("mongoose")

const snipeSchema = mongoose.Schema({
  guildID: String,
  channelID: String,
  userName: String,
  snipe: String,
})

module.exports = mongoose.model("snipes", snipeSchema)
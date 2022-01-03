const mongoose = require("mongoose")

const levelSchema = mongoose.Schema({
  name: String,
  guildID: String,
  userID: String,
  level: Number,
  xp: Number,
  guildUserID: String,
  roles: [String],
  message: String,
  channelID: String,
  serverID: String,
  status: String,
  blacklist: [String],
  reqXp: Number,
  username: String,
  totalXp: Number,
})

module.exports = mongoose.model("levels", levelSchema)
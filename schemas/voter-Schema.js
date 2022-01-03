const mongoose = require("mongoose")

const voterSchema = mongoose.Schema({
  voterID: String,
  votes: Number,
})

module.exports = mongoose.model("voters", voterSchema)
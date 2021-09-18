const mongoose = require('mongoose')
//const { mongoPath } = require('./config.json')

const mongoPath = 'mongodb+srv://Hardcodex:rayyaan123@nekie.keklr.mongodb.net/Nekie?retryWrites=true&w=majority'

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  return mongoose

  var options =  { useMongoClient: true, keepAlive: 1, connectTimeoutMS: 30000, reconnectTries: 30, reconnectInterval: 5000 }
mongoose.connect(config.mongoConnectionString, options, (err) => {
    if(err) {
        console.error("Error while connecting", err);
    }
});
}
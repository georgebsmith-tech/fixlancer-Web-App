const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI



mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("push Connction successful" + data)
    }

})


const Schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    uid: {
        type: String,
        required: true,
        unique: true
    },

    player_id: {
        type: String,
        required: true,
        unique: true
    }


})
const PushNotice = mongoose.model("PushNotice", Schema)

module.exports = PushNotice
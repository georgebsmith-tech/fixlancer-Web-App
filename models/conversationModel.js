const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI



mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("conversation Connction successful")
    }

})

const Schema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true

    },
    message: {
        type: String,
        required: true
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now
    }

})


const Chat = mongoose.model("Chat", Schema)

module.exports = Chat
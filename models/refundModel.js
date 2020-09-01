const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI


mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("refynd Connction successful" + data)
    }

})


const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    amount: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    },
    cleared: {
        type: Boolean,
        default: false
    },
    forFix: {
        type: String,
        required: true
    }

})
const Refund = mongoose.model("Refund", Schema)

module.exports = Refund
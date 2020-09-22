const mongoose = require("mongoose");

const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI
//
mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Acct Connction successful" + data)
    }

})


const Schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,

    },
    accName: {
        type: String,
        default: ""

    },
    accNumber: {
        type: String,
        default: ""

    },

    bankName: {
        type: String,
        default: ""

    },
    createdAt: {
        type: String,
        default: Date.now
    }


})
const Bank = mongoose.model("Bank", Schema)

module.exports = Bank
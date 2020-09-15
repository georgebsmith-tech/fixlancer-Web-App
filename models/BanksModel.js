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
        required: true
    },
    accName: {
        type: String,
        required: true,
    },
    accNumber: {
        type: String,
        required: true,
        unique: true
    },

    bankName: {
        type: String,
        required: true,
    },


})
const Bank = mongoose.model("Bank", Schema)

module.exports = Bank
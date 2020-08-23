const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI


mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Revenue Connction successful" + data)
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
    kind: {
        type: String, //values are referal-bonus and others
        default: "referrals"
    },
    referral: {
        type: String,
        require: true
    },

    date: {
        type: Date,
        default: Date.now
    },
    cleared: {
        type: Boolean,
        default: false
    }

})
const Revenue = mongoose.model("Revenue", Schema)

module.exports = Revenue
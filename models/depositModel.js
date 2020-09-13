const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI


mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("deposit Connction successful" + data)
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    cleared: {
        type: Boolean,
        default: false
    }

})
Schema.pre("validate", function (next) {
    this.updatedAt = new Date()
    next()
})
const Deposit = mongoose.model("Deposit", Schema)

module.exports = Deposit
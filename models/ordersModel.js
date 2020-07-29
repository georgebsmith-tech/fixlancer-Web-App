const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI



mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Orders Connction successful")
    }

})


const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true

    },
    fix: {
        type: String,
        required: true
    },
    delivery: {
        type: Date,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    seller: {
        type: String,
        require: true
    },
    state: {
        type: String,
        required: true,
        default: "Ongoing" // other values are Delivered, canceled and completed
    }


})

const Order = mongoose.model("Order", Schema)

module.exports = Order
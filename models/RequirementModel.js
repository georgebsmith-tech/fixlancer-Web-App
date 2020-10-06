const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI


mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Requirement Connction successful" + data)
    }

})


const Schema = new mongoose.Schema({
    order_id: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    content: {
        type: Object,
        required: true
    }

})
const Requirement = mongoose.model("Requirement", Schema)

module.exports = Requirement
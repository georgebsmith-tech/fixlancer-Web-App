const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI


mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Milestone Connction successful" + data)
    }

})


const Schema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const Milestone = mongoose.model("Milestone", Schema)

module.exports = Milestone
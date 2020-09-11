const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI



mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Transaction Connction successful")
    }

})
const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        require: true
    },

    content: {
        type: Object,
        required: true,
    },
    transaction_id: {
        type: Number,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true

    }



})

const Transaction = mongoose.model("Transaction", Schema)

module.exports = Transaction
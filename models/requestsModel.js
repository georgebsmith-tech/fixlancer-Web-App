const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI



mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Requests Connction successful")
    }

})

// const ExtraSchema = new mongoose.Schema({
//     description: {
//         type: String,
//     },
//     price: {
//         type: Number,
//     }
// })


const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true

    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    sub_category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Open" // other values are Awarded and Closed
    },
    offers: {
        type: Array // this links to the different offers from bids
    },
    approved: {
        type: Boolean,
        default: false
    },
    delivery: {
        type: Number,
        required: true
    }


})


const Request = mongoose.model("Request", Schema)

module.exports = Request
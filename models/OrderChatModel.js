const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI



mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("OrderChat Connction successful")
    }

})

const Schema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true

    },
    message: {
        type: String,
        required: true,
        default: ""
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now
    },
    delivered: {
        type: Boolean,
        default: true

    },
    read: {
        type: Boolean,
        default: false
    },
    order_id: {
        type: Number
    },
    type: {
        type: String,
        enum: ["cancellation request", "accepted cancellation", "rejected cancellation"]

    },
    content: {
        type: Object

    }


})


const OrderChat = mongoose.model("OrderChat", Schema)

module.exports = OrderChat
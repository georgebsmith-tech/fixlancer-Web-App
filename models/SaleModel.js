const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI



mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Sales Connction successful")
    }

})

const CancellationSchema = new mongoose.Schema({
    requested: {
        type: Boolean
    },
    by: {
        type: String
    },
    cancellation: {
        type: String,
        enum: ["automatic", "rejected", "accepted", "pending"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    actionTakenAt: {
        type: Date
    }
})


const Schema = new mongoose.Schema({

    seller: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["fix", "request"]
    },
    delivery_date: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    buyer: {
        type: String,
        require: true
    },
    state: {
        type: String,
        required: true,
        default: "ongoing" // other values are Delivered, canceled and completed
    },
    order_id: {
        type: Number,
        required: true,
        unique: true

    },
    job_id: {
        type: Number
    },
    hasStarted: {
        type: Boolean,
        default: false
    }
    ,
    startedAt: {
        type: Date,
        default: null
    },
    cancellation: {
        type: CancellationSchema
    }


})

const Sale = mongoose.model("Sale", Schema)

module.exports = Sale
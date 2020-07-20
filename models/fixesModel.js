const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI



mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Categories Connction successful" + data)
    }

})


const OrdersByMonthSchema = new mongoose.Schema({
    month: {
        type: String,
        unique: true
    },
    amount: {
        type: Number,
        default: 0
    }
})

const Schema = new mongoose.Schema({
    user_id: {
        type: String,
        unique: true,
        required: true
    },
    uid: {
        type: String,
        required: true,
        unique: true
    },
    total_visits: {
        type: Number,
        default: 0
    },
    total_refs: {
        type: Number,
        default: 0
    },
    total_earn: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    total_orders: {
        type: Number,
        default: 0
    },
    orders_by_month: [OrdersByMonthSchema]


})
const Affiliate = mongoose.model("Affiliate", Schema)

module.exports = Affiliate
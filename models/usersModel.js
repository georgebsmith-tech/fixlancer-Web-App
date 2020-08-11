const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI

mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Users Connction successful" + data)
    }

})


const Schema = new mongoose.Schema({
    imageURL: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: ""
    },
    usernameChanges: {
        type: Number,
        default: 0
    },
    country: {
        type: String,
        required: true
    },
    last_seen: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    },
    requests: {
        type: Array
    },
    orders: {
        type: Array
    },
    sales: {
        type: Array
    },
    notices: {
        type: Array
    },
    rating: {
        type: Number,
        default: 0
    },
    website: {
        type: String,
        default: ""
    },
    conversations: {
        type: Array
    }

})
const User = mongoose.model("User", Schema)

module.exports = User
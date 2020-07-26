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
        default: new Date().now
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
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
        type: String
    },
    usernameChanges: {
        type: Number,
        default: 0
    },
    country: {
        type: String,
        required: true
    }

})
const User = mongoose.model("User", Schema)

module.exports = User
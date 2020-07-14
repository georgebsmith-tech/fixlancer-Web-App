const mongoose = require("mongoose");


const dataBaseUrl = "mongodb://localhost:27017/fixlancerDataBase"

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
    hashPassword: {
        type: String,
        required: true,
    },
    bio: {
        type: String
    },

})
const User = mongoose.model("User", Schema)

module.exports = User
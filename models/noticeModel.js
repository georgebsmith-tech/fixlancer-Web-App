const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()


const dataBaseUrl = process.env.MONGO_ATLAS_URI



mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Notice Connction successful")
    }

})


const Schema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true

    },
    date: {
        type: Date,
        default: Date.now
    },
    seller: {
        type: String,
        require: true
    },
    content: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false
    }


})

const Notice = mongoose.model("Notice", Schema)

module.exports = Notice
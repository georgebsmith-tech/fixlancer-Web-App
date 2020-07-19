const mongoose = require("mongoose");


const dataBaseUrl = "mongodb://localhost:27017/fixlancerDataBase"

mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Categories Connction successful" + data)
    }

})


const Schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    items: {
        type: Array,
    },

    date: {
        type: Date,
        default: Date.now
    }


})
const Category = mongoose.model("Category", Schema)

module.exports = Category
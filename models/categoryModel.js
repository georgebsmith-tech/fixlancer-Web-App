const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()
const slugify = require("slugify");
slugify.extend({ '#': 'sharp', '+': "plus", "-": "minus", "*": "times", "&": "and", "/": "or" })


const dataBaseUrl = process.env.MONGO_ATLAS_URI


mongoose.connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, data) => {
    if (err) {
        console.log("error" + err)
    } else {
        console.log("Categories Connction successful" + data)
    }

})

const SubCat = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    number_of_fixes: {
        type: Number,
        default: 0
    }
})

const Schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    number_of_subs: {
        type: Number,
        default: 0
    },
    subcat: {
        type: [SubCat]
    },

    date: {
        type: Date,
        default: Date.now
    },
    prices: {
        type: [Number]
    },
    catSlug: {
        type: String,
        required: true
    }

})

Schema.pre("validate", function (next) {
    if (this.name) {
        this.catSlug = slugify(this.name,
            {
                lower: true,
                strict: true
            })
    }
})
const Category = mongoose.model("Category", Schema)

module.exports = Category
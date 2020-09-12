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
        console.log("Fix Connction successful")
    }

})

const ExtraSchema = new mongoose.Schema({
    description: {
        type: String,
    },
    price: {
        type: Number,
    }
})


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
    requirements: {
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
    subcategory: {
        type: String,
        required: true
    },
    delivery_days: {
        type: Number,
        required: true
    },
    tags: {
        type: Array
    },
    images_url: {
        type: [String],
        required: true
    },
    video: {
        type: String
    }
    ,
    featured: {
        type: Boolean,
        default: false
    },
    trusted: {
        type: Boolean,
        default: false
    }
    ,
    extras: {
        type: [ExtraSchema]
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now
    },
    ratings: {
        type: [Number]
    },
    titleSlug: {
        type: String,
        required: true
    },
    subcatSlug: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    }



})

Schema.pre("validate", function (next) {
    if (this.subcategory) {
        this.subcatSlug = slugify(this.subcategory.toLowerCase());
    }
    if (this.title) {
        this.titleSlug = slugify(this.title, {
            lower: true,
            strict: true
        })
    }


    next()
})




const Fix = mongoose.model("Fix", Schema)

module.exports = Fix
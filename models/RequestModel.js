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
        console.log("Requests Connction successful")
    }

})

const OfferSchema = new mongoose.Schema({
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

    price: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    delivery: {
        type: Number,
        required: true
    },
    image_url: {
        type: String,
        default: null
    },
    slug: {
        type: String,
        required: true
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

    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Open" // other values are Awarded and Closed
    },
    offers: {
        type: [OfferSchema] // this links to the different offers from bids
    },
    approved: {
        type: Boolean,
        default: false
    },
    delivery: {
        type: Number,
        required: true
    }

    , slug: {
        type: String,
        required: true
    }
    ,
    job_id: {
        type: Number,
        required: true,
        unique: true
    }


})

Schema.pre("validate", function (next) {
    if (this.title) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true
        })
    }


    next()
})


const Request = mongoose.model("Request", Schema)

module.exports = Request
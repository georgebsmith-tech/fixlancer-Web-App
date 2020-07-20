
const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose");

const router = require("express").Router()
const Joi = require("joi")
const bcrypt = require("bcrypt")
const multer = require("multer")
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const jwt = require("jsonwebtoken");

console.log(process.env.AWS_REGION)

const UserModel = require("../models/usersModel")
const BankModel = require("../models/bankModel")

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

// AWS.config.region = 'us-east-2'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-2:6b0c4083-7b45-440d-8ca8-2fbf7bb2828f',
// });

const s3 = new AWS.S3()
const storage = multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "fixlancerwebapp",
    metadata: function (req, file, cb) {
        cb(null, { fieldName: "Fixlancer_Web_App" })
    },
    key: function (req, file, cb) {
        cb(null, new Date().getTime().toString() + file.originalname)
    }
})

const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1025 * 10
    }
})
const singleUpload = upload.single("photo")

router.get("/", async function (req, res) {
    const data = await UserModel.find()
    res.status(200).send(data)
})

//Registration route
router.post("/register", async (req, res) => {
    singleUpload(req, res, async function (err) {
        if (err) {
            return res.send(err)
        } else {
            // const Schema = {
            //     username: Joi.string().min(4).required()
            // }

            // Joi.validate(req.body, Schema)
            //     .then(data => {
            //         console.log(data)
            //     })
            //     .catch(err => {
            //         res.status(400).send(err.details[0].message)
            //         return
            //     })

            // console.log(req.file)
            const body = req.body
            if (body.solved) {
                console.log("Puzzle solved")
                const userRes = await UserModel.find({ username: body.username })
                if (userRes.length >= 1) {
                    console.log("Username Exists")
                    return res.status(404).json({
                        message: "Username already Exists"
                    })
                }

                const emailRes = await UserModel.find({ email: body.email })
                if (emailRes.length >= 1) {
                    res.status(404).json({
                        message: "email already Exists"
                    })
                }
                const phoneRes = await UserModel.find({ phone: body.phone })
                if (phoneRes.length >= 1) {
                    res.status(404).json({
                        message: "Someone is already using this number"
                    })
                }

            } else {
                res.status(404).json({
                    message: "Puzzle not solved!"
                })
            }
            body.hashPassword = (await bcrypt.hash(body.password, 15)).toString()
            body.imageURL = req.file.location
            try {
                const user = new UserModel(body)
                const data = await user.save()
                console.log("Data saved")

                res.status(200).json({
                    message: "Data Saved!!",
                    body: data
                })

            } catch (err) {
                res.status(404).json({
                    error: "Error"
                })
                throw err

            }

        }

    })






})


router.post("/login", async (req, res) => {
    // console.log(process.env)
    const body = req.body
    console.log(body)
    const data = await UserModel.findOne({ username: body.username })
    if (data) {
        console.log(data)
        const ispassword = await bcrypt.compare(body.password, data.hashPassword)
        console.log(ispassword)
        if (ispassword) {
            const userAuthToken = jwt.sign({ id: data.username }, process.env.USER_JWT_SECRET)
            res.status(200).header("token", userAuthToken).json({
                body: data,
                token: userAuthToken
            })
        } else {
            res.status(401).json({
                message: "Incorrect  username or password"
            })
        }
    } else {
        res.status(401).json({
            message: "Incorrect username or password"
        })
    }

})


router.get("/personal-info/:username", async (req, res) => {
    const data = await UserModel.findOne({
        username: req.params.username
    })
    if (data) {
        await delete data.hashPassword
        const bankDetails = await BankModel.findOne({ username: data.username })
        res.status(200).json({
            body: data,
            bankDetails: bankDetails
        })
    } else {
        res.status(401).json({
            message: "No User with that username"
        })
    }
})


router.put("/register/:username", upload.single("photo"), async function (req, res) {
    const body = req.body
    body.imageURL = req.file.path
    const data = await UserModel.findOneAndUpdate({ username: req.params.username }, body, { new: true })

    res.status(200).json(data)
})



router.post("/bank-details/:username", async function (req, res) {
    const data = await UserModel.findOne({ username: req.params.username })

    if (data) {
        const body = req.body
        console.log(body)
        const details = {
            username: req.params.username,
            accName: body.accName,
            accNumber: body.accNumber,
            bankName: body.bankName
        }
        const bankDetails = new BankModel(details)
        const savedData = await bankDetails.save()
        res.status(200).json(savedData)
    } else {
        res.status(401).json({
            message: "No user with that information"
        })
    }
})


module.exports = router

const dotenv = require("dotenv")
dotenv.config()

const upload = require("../controlers/awsConfig")



const mongoose = require("mongoose");

const router = require("express").Router()
const Joi = require("joi")
const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken");

console.log(process.env.AWS_REGION)

const UserModel = require("../models/usersModel")
const BankModel = require("../models/bankModel")

const singleUpload = upload.single("photo")

router.get("/", async function (req, res) {
    const data = await UserModel.find()
    res.status(200).send(data)
})

//Registration route
router.post("/register", async (req, res) => {

    const body = req.body

    if (body.solved) {
        console.log("Puzzle solved")
        const userRes = await UserModel.find({ username: body.username })
        if (userRes.length >= 1) {
            console.log("Username Exists")
            return res.status(401).json({
                error: "Username already Exists"
            })
        }


        const emailRes = await UserModel.find({ email: body.email })
        if (emailRes.length >= 1) {
            res.status(401).json({
                error: "email already Exists"
            })
        }
        const phoneRes = await UserModel.find({ phone: body.phone })
        if (phoneRes.length >= 1) {
            res.status(401).json({
                error: "There's already a user with this number"
            })
        }
        if (body.password !== body.confirm_password) {
            return res.status(401).json({
                error: "'password' and 'confirm password' fields must match "
            })
        }

    } else {
        res.status(401).json({
            error: "Puzzle not solved!"
        })
    }
    body.password = (await bcrypt.hash(body.password, 15)).toString()
    // body.imageURL = req.file.location
    try {
        const user = new UserModel(body)
        const data = await user.save()
        console.log("Data saved")

        res.status(200).json({
            created: true
        })

    } catch (err) {
        return res.status(404).json({
            error: err
        })


    }
})


router.post("/login", async (req, res) => {
    // console.log(process.env)
    const body = req.body
    console.log(body)
    const data = await UserModel.findOne({ username: body.username })
    if (data) {
        console.log(data)
        const ispassword = await bcrypt.compare(body.password, data.password)
        console.log(ispassword)
        if (ispassword) {
            const userAuthToken = jwt.sign({ id: data.username }, process.env.USER_JWT_SECRET)
            res.status(200).header("token", userAuthToken).json({
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
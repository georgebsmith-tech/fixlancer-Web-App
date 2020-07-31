
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
                error: "Username already Exists",
                errorCode: 1
            })
        }


        const emailRes = await UserModel.find({ email: body.email })
        if (emailRes.length >= 1) {
            res.status(401).json({
                error: "email already Exists",
                errorCode: 2

            })
        }
        const phoneRes = await UserModel.find({ phone: body.phone })
        if (phoneRes.length >= 1) {
            res.status(401).json({
                error: "There's already a user with this number",
                errorCode: 3
            })
        }
        if (body.password !== body.confirm_password) {
            return res.status(401).json({
                error: "'password' and 'confirm password' fields must match ",
                errorCode: 4
            })
        }

    } else {
        res.status(401).json({
            error: "Puzzle not solved!",
            errorCode: 5
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
        const hash = data.password
        console.log(hash)
        const password = body.password
        console.log(password)
        const ispassword = await bcrypt.compare(password, hash)
        console.log(ispassword)
        if (ispassword) {
            const userAuthToken = jwt.sign({ id: data.username }, process.env.USER_JWT_SECRET)
            res.status(200).header("token", userAuthToken).json({
                token: userAuthToken,
                loggedIn: true
            })
        } else {
            res.status(401).json({
                message: "Incorrect  username or password",
                loggedIn: false
            })
        }
    } else {
        res.status(401).json({
            message: "Incorrect username or password",
            loggedIn: false
        })
    }

})
router.post("/email", async (req, res) => {
    const data = await UserModel.findOne({
        email: req.body.email
    })
    if (data) {
        await delete data.hashPassword
        const bankDetails = await BankModel.findOne({ username: data.username })
        res.status(200).json({
            data: data,
            bankDetails: bankDetails,
            found: true
        })
    } else {
        res.status(200).json({
            error: "No User with that username",
            found: false
        })
    }
})
router.post("/phone", async (req, res) => {
    const data = await UserModel.findOne({
        phone: req.body.phone
    })
    if (data) {
        await delete data.hashPassword
        const bankDetails = await BankModel.findOne({ username: data.username })
        res.status(200).json({
            data: data,
            bankDetails: bankDetails,
            found: true
        })
    } else {
        res.status(200).json({
            error: "No User with that username",
            found: false
        })
    }
})


router.get("/:username", async (req, res) => {
    const requestString = req.query

    const data = await UserModel.findOne({
        username: req.params.username
    })
    if (data) {
        const bankDetails = await BankModel.findOne({ username: data.username })
            .select({ bio: true, username: true })
        res.status(200).json({
            username: data.username,
            ungoing_sales: 0,
            balance: 0,
            unread_msgs: 0,
            ungoing_orders: 0,
            unread_notices: 0,
            bio: "",
            rating: 0



        })
    } else {
        res.status(200).json({
            error: "No User with that username",
            found: false
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

// router.get("/:username", async (req,res)=>{
// const user = await UserModel.findOne({username:req.params.username})
// console.log(user)
// })


module.exports = router
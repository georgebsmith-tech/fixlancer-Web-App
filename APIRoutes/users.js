
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
const SalesModel = require("../models/salesModel")
const OrdersModel = require("../models/ordersModel")
const NoticesModel = require("../models/noticeModel")

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

//Controllers
const userLogin = require("../controlers/users/userLogin")
// const passport = require("passport")

router.post("/login", userLogin)
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

router.post("/:username/bank-details", async function (req, res) {
    const data = await UserModel.findOne({ username: req.params.username })

    if (data) {
        const body = req.body
        console.log(body)
        const details = {
            username: req.params.username,
            accName: body.acc_name,
            accNumber: body.acc_number,
            bankName: body.bank_name
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

const checkUserAuthenticated = require("../middleware/userIsAuthenticated")
router.get("/u", async (req, res) => {
    const requestString = req.query
    req.params.username = req.session.passport.user
    console.log("it is " + req.params.username)
    console.log(requestString)
    if (requestString.content === "full") {

        const data = await UserModel.findOne({ username: req.params.username })
        let bankDetails = await BankModel.findOne({ username: data.username })
        const unreadNotices = await NoticesModel.find({ user_id: data._id, read: false })
        if (!bankDetails) bankDetails = {}
        const ongoingSales = await SalesModel.find({ user_id: data._id, state: "ongoing" })
        const ongoingOrders = await OrdersModel.find({ user_id: data._id, state: "ongoing" })
        if (data) {
            return res.status(200).json({
                data: {
                    full_name: data.fullName,
                    username: data.username,
                    city: data.city,
                    phone: data.phone,
                    bio: data.bio,
                    unread_notices: unreadNotices.length,
                    unread_msgs: 0,
                    active_sales: ongoingSales.length,
                    active_orders: ongoingOrders.length,
                    balance: 0,
                    bamk_details: {
                        bank_name: bankDetails.bankName,
                        acct_name: bankDetails.accName,
                        acc_number: bankDetails.accNumber
                    }

                }
            })


        } else {
            return res.status(200).json({
                error: "No User with that username",
                found: false
            })
        }
    } else if (requestString.content === "profile") {
        const data = await UserModel.findOne({ username: req.params.username })
        return res.status(200).json({
            username: data.username,
            rating: data.rating,
            phone: data.phone,
            bio: data.bio,
            created_at: data.createdAt.toDateString()
        })
    } else {



        const data = await UserModel.findOne({
            username: req.params.username
        }).select("bio username rating")
        if (data) {
            const ongoingSales = await SalesModel.find({ user_id: data._id, state: "ongoing" })
            const ongoingOrders = await OrdersModel.find({ user_id: data._id, state: "ongoing" })
            const unreadNotices = await NoticesModel.find({ user_id: data._id, read: false })


            console.log(ongoingSales)


            res.status(200).json({
                data: {
                    username: data.username,
                    ungoing_sales: 0,
                    summary: [["unread messages", 0],
                    ["balance", 0],
                    ["active sales", ongoingSales.length],
                    ["active orders", ongoingOrders.length]

                    ],

                    bio: data.bio,
                    rating: data.rating,
                    unread_notices: unreadNotices.length
                }

            })
        } else {
            res.status(200).json({
                error: "No User with that username",
                found: false
            })
        }
    }
})







router.put("/register/:username", upload.single("photo"), async function (req, res) {
    const body = req.body
    body.imageURL = req.file.path
    const data = await UserModel.findOneAndUpdate({ username: req.params.username }, body, { new: true })

    res.status(200).json(data)
})


const updateUserDetails = require("../controlers/users/updateUserDetails")
router.patch("/:username", updateUserDetails)
module.exports = router
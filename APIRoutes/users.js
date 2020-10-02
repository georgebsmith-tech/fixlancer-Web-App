
const dotenv = require("dotenv")
dotenv.config()

const upload = require("../controlers/awsConfig")


//midleware imports
const updateUserProfileAndBank = require("../controlers/users/updateUserProfileAndBank")



const mongoose = require("mongoose");

const router = require("express").Router()
const Joi = require("joi")
const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken");

console.log(process.env.AWS_REGION)

const UserModel = require("../models/UserModel")
const BankModel = require("../models/BanksModel")
const SalesModel = require("../models/SaleModel")
// const OrdersModel = require("../models/ordersModel")
const NoticesModel = require("../models/NoticesModel")
const RevenueModel = require("../models/RevenuesModel")
const DepositModel = require("../models/DepositsModel")
const RefundModel = require("../models/RefundsModel")


const singleUpload = upload.single("photo")

router.get("/", async function (req, res) {
    const data = await UserModel.find()
    res.status(200).send(data)

})


const sendResetPasswordLink = require("../controlers/users/sendPasswordLink")

router.get("/reset", sendResetPasswordLink)

router.get("/leaving", (req, res) => {
    let user = req.query.user
    if (req.query.online) {
        UserModel.findOneAndUpdate({ username: user }, { online: true }, { new: true })
            .then(data => {
                console.log(data)

            })
        console.log("back!!!!!!!!!!!")

    } else {

        let date = new Date()
        UserModel.findOneAndUpdate({ username: user }, { online: false, last_seen: date }, { new: true })
            .then(data => {
                console.log(data)

            })
        console.log("leaving!!!!!!!!!!!")
    }
})


const registerUser = require("../controlers/users/registerUser")
//Registration route

router.post("/register", registerUser)

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
    req.params.username = req.session.passport ? req.session.passport.user : "Betty"
    console.log("it is " + req.params.username)
    console.log(requestString)
    let balance = 0;
    if (requestString.content === "full") {
        let username = req.params.username
        const data = await UserModel.findOne({ username: req.params.username })
        let bankDetails = await BankModel.findOne({ username: data.username })
        const unreadNotices = await NoticesModel.find({ user_id: data._id, read: false })
        if (!bankDetails) bankDetails = {}
        const ongoingSales = await SalesModel.find({ user_id: data._id, state: "ongoing" })
        const ongoingOrders = await OrdersModel.find({ user_id: data._id, state: "ongoing" })
        const userRevenue = await RevenueModel.findOne({ username: username })
        if (userRevenue)
            balance += userRevenue.amount

        const userDeposit = await DepositModel.findOne({ username: username })
        if (userDeposit)
            balance += userDeposit.amount
        const userRefund = await RefundModel.findOne({ username: username })
        if (userRefund)
            balance += userRefund.amount

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
                    balance,
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
            const ongoingSales = await SalesModel.find({ seller: data.username, state: "ongoing" })
            const ongoingOrders = await SalesModel.find({ buyer: data.username, state: "ongoing" })
            const unreadNotices = await NoticesModel.find({ user_id: data._id, read: false })
            const userRevenue = await RevenueModel.findOne({ username: req.params.username })
            if (userRevenue)
                balance += userRevenue.amount

            const userDeposit = await DepositModel.findOne({ username: req.params.username })
            if (userDeposit)
                balance += userDeposit.amount
            const userRefund = await RefundModel.findOne({ username: req.params.username })
            if (userRefund)
                balance += userRefund.amount


            console.log(ongoingSales)


            res.status(200).json({
                data: {
                    username: data.username,
                    ungoing_sales: 0,
                    summary: [["unread messages", 0],
                    ["balance", balance],
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

router.get("/:username", async (req, res) => {
    const requestString = req.query
    console.log(requestString)
    let balance = 0;
    if (requestString.content === "full") {

        const data = await UserModel.findOne({ username: req.params.username })
        let bankDetails = await BankModel.findOne({ username: data.username })
        const unreadNotices = await NoticesModel.find({ user_id: data._id, read: false })
        if (!bankDetails) bankDetails = {}
        const ongoingSales = await SalesModel.find({ seller: req.params.username, state: "ongoing" })
        const ongoingOrders = await SalesModel.find({ buyer: req.params.username, state: "ongoing" })
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
                    userColor: data.userColor,
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
            userColor: data.userColor,
            created_at: data.createdAt.toDateString()
        })
    } else {



        const data = await UserModel.findOne({
            username: req.params.username
        }).select("bio username rating userColor")
        if (data) {
            const ongoingSales = await SalesModel.find({ seller: data.username, state: "ongoing" })
            const ongoingOrders = await SalesModel.find({ buyer: data.username, state: "ongoing" })
            const unreadNotices = await NoticesModel.find({ user_id: data._id, read: false })
            const userRevenue = await RevenueModel.findOne({ username: req.params.username })
            if (userRevenue)
                balance += userRevenue.amount
            console.log(balance)

            const userDeposit = await DepositModel.findOne({ username: req.params.username })
            if (userDeposit)
                balance += userDeposit.amount
            console.log(balance)
            const userRefund = await RefundModel.findOne({ username: req.params.username })
            if (userRefund)
                balance += userRefund.amount
            console.log(balance)


            console.log(ongoingSales)


            res.status(200).json({
                data: {
                    username: data.username,
                    ungoing_sales: 0,
                    summary: [["unread messages", 0],
                    ["balance", balance],
                    ["active sales", ongoingSales.length],
                    ["active orders", ongoingOrders.length]

                    ],

                    bio: data.bio,
                    rating: data.rating,
                    unread_notices: unreadNotices.length,
                    userColor: data.userColor
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



router.put("/:username", upload.single("photo"), updateUserProfileAndBank)



router.put("/register/:username", upload.single("photo"), async function (req, res) {
    const body = req.body
    body.imageURL = req.file.path
    const data = await UserModel.findOneAndUpdate({ username: req.params.username }, body, { new: true })

    res.status(200).json(data)
})


const updateUserDetails = require("../controlers/users/updateUserDetails")
router.patch("/:username", updateUserDetails)
module.exports = router
const router = require("express").Router()
const DepositModel = require("../models/DepositModel");
const TransactionModel = require("../models/TransactionModel");
const axios = require("axios").default;

// let domain = "https://fixlancer.herokuapp.com"
let domain = "http://localhost:3000"
router.get("/", async (req, res) => {
    const data = await DepositModel.find()
    return res.status(200).json({ data })
})

router.get("/:username", async (req, res) => {
    const data = await DepositModel.findOne({ username: req.params.username })
    if (data)
        return res.status(200).json({ data })
    return res.status(401).json({
        error: "User doesnt have a deposit"
    })
})


router.post("/", async (req, res) => {
    const reqBody = req.body
    console.log(reqBody)
    let data, deposit
    deposit = await DepositModel.findOne({ username: reqBody.username })
    console.log(deposit)
    if (deposit) {
        deposit.amount += reqBody.amount
        data = await deposit.save()
    } else
        deposit = new DepositModel(reqBody)
    data = await deposit.save()
    console.log(data)
    let traansactionData = {
        username: data.username,
        amount: reqBody.amount,
        type: "deposit",
        content: {
            deposit_id: data._id
        }

    }
    let depositTransaction = await axios.post(`${domain}/api/transactions`, traansactionData)
    return res.status(201).json({
        data,
        transaction: depositTransaction.data
    })


})

router.patch("/", async (req, res) => {
    const reqBody = req.body
    const amount = reqBody.amount
    const deposit = await DepositModel.findOne({ username: reqBody.username })
    let leftAmount = -deposit.amount + amount
    if (leftAmount > 0) {
        deposit.amount = 0
        deposit.updatedAt = new Date()
        return res.json({
            leftAmount
        })
    }
    deposit.amount = -leftAmount
    deposit.updatedAt = new Date()
    return res.json({
        leftAmount: -leftAmount
    })


})



module.exports = router
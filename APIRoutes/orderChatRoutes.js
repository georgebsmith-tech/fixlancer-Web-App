const router = require("express").Router()
const RevenueModel = require("../models/RevenuesModel")
const DepositModel = require("../models/DepositsModel")
const RefundModel = require("../models/RefundsModel")

const OrderChatModel = require("../models/OrderChatModel")

router.get("/", async (req, res) => {
    const chats = await OrderChatModel.find({})
    res.status(200).json({ chats })
})

router.post("/", async (req, res) => {
    let body = req.body
    const type = body.type

    if (type === "extras") {
        const { username, order_id, to } = body
        const foundMax = await OrderChatModel.find({ order_id }).sort({ extra_id: -1 }).limit(1).select("extra_id")
        const extra_id = foundMax.length === 0 ? 1 : foundMax[0].extra_id + 1

        body = {
            extra_id,
            order_id,
            from: username,
            to,
            type,
            message: type,
            content: {
                price: body.price,
                days: body.days,
                description: body.description,
                createdAt: new Date()

            }
        }


    }
    const chat = new OrderChatModel(body)
    const data = await chat.save()
    res.status(201).json({ chat: data })
})

router.put("/", async (req, res) => {
    const body = req.body


    const order_id = body.order_id;
    const extra_id = body.extra_id
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"


    const refund = await RefundModel.findOne({ username: loggedUser })
    const deposit = await DepositModel.findOne({ username: loggedUser })
    const revenue = await RevenueModel.findOne({ username: loggedUser })



    const chat = await OrderChatModel.findOne({ extra_id, order_id })
    const newChat = { ...chat.toObject() }
    newChat.content.paid = true

    const data = await OrderChatModel.findOneAndUpdate({ extra_id, order_id }, { content: newChat.content }, { new: true })
    res.status(201).json({ chat: data })
})

module.exports = router
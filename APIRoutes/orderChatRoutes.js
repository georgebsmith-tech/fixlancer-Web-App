const router = require("express").Router()

const OrderChatModel = require("../models/OrderChatModel")

router.get("/", async (req, res) => {
    const chats = await OrderChatModel.find({})
    res.status(200).json({ chats })
})

router.post("/", async (req, res) => {
    const chat = new OrderChatModel(req.body)
    const data = await chat.save()
    res.status(201).json({ chat: data })
})






module.exports = router
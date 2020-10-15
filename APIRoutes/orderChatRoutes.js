const router = require("express").Router()

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


    // return res.status(201).json(body)
    const chat = new OrderChatModel(req.body)
    const data = await chat.save()
    res.status(201).json({ chat: data })
})

module.exports = router
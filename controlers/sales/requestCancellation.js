
const SalesModel = require("../../models/SaleModel")
const OrderChatModel = require("../../models/OrderChatModel")


module.exports = async (req, res) => {
    const order_id = req.body.order_id
    const username = req.body.username
    const to = req.body.to
    const data = await SalesModel.findOneAndUpdate({ order_id }, { cancellation: { requested: true, by: username } }, { new: true })

    const chat = {
        order_id,
        from: username,
        to,
        type: "cancellation request",
        message: "cancellation requested",
        content: {
            accepted: false,
            createdAt: new Date()

        }
    }
    const orderChat = new OrderChatModel(chat)
    const savedChat = await orderChat.save()

    console.log("cancellation requested")
    res.status(201).json({ data, savedChat })
}
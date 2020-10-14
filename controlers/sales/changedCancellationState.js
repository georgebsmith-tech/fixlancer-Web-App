
const SalesModel = require("../../models/SaleModel")
const OrderChatModel = require("../../models/OrderChatModel")


module.exports = async (req, res) => {
    try {

        const body = req.body
        const order_id = body.order_id
        const from = body.username
        const to = body.to
        const state = body.state
        const chatID = body.chatID
        console.log("chatID")
        console.log(chatID)

        const salesData = await SalesModel.findOneAndUpdate(
            {
                order_id
            },
            {
                state: state === "accept" ? "cancelled" : "ongoing",
                cancellation: {
                    cancellation: state === "accept" ? "accepted" : "rejected",
                    actionTakenAt: new Date()
                }
            },
            {
                new: true
            }
        )


        const newChatData = new OrderChatModel({
            order_id,
            from,
            to,
            message: "accepted cancellation",
            type: "accepted cancellation",
            content: {
                accpted: true,
                acceptedAt: new Date()
            }
        })
        const savedChat = await newChatData.save()

        const modifiedChat = await OrderChatModel.findOneAndUpdate({ _id: chatID }, { content: { accepted: true } }, { new: true })


        // console.log(salesData)
        // console.log(body)
        res.status(200).json(
            {
                salesData,
                savedChat,
                modifiedChat
            })
    } catch (err) {
        throw err

    }
}

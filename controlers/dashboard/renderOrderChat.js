const SaleModel = require("../../models/SaleModel")
const RequestModel = require("../../models/RequestModel")
const OrderChat = require("../../models/OrderChatModel")
module.exports = async (req, res) => {
    const order_id = req.query.oid
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    const order = await SaleModel.findOne({ order_id })
    console.log(order)
    const request = await RequestModel.findOne({ job_id: order.job_id })
    const offer = request.offers.find((offers) => (offers.username === order.buyer || offers.username === order.seller))
    const order_mod = { ...order.toObject() }
    order_mod.price = offer.price


    let date = new Date()

    const orderChats = await OrderChat.find({ order_id })
    console.log(orderChats)

    let timeElapse = parseInt((date) / (1000 * 60))
    if ((timeElapse - 5) > 60 * 24 * 7) {
        theTime = parseInt((timeElapse - 5) / (60 * 24 * 7));
        ago = `${theTime}w`
        // console.log(ago)
    }
    else if ((timeElapse - 5) > 60 * 24) {

        theTime = parseInt((timeElapse - 5) / (60 * 24));
        ago = `${theTime}d`
        // console.log(ago)
    } else if ((timeElapse - 5) > 60) {

        theTime = parseInt((timeElapse - 6) / (60));
        ago = `${theTime}h`

    } else {

        ago = `${parseInt(timeElapse - 5)}m`
        // console.log(ago)
    }

    const recipient = order_mod.seller === loggedUser ? order_mod.buyer : order_mod.seller

    res.render("order-chat", { chats: orderChats, order: order_mod, loggedUser, recipient, online: true, timeElapse, ago })

}
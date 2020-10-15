const SaleModel = require("../../models/SaleModel")
const RequestModel = require("../../models/RequestModel")
const OrderChat = require("../../models/OrderChatModel")
const RequirementsModel = require("../../models/RequirementModel")
module.exports = async (req, res) => {
    const order_id = req.query.oid
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    const order = await SaleModel.findOne({ order_id })

    const request = await RequestModel.findOne({ job_id: order.job_id })
    const offer = request.offers.find((offers) => (offers.username === order.buyer || offers.username === order.seller))
    const order_mod = { ...order.toObject() }
    order_mod.price = offer.price
    order_mod.title = offer.title
    order_mod.imageURL = offer.image_url
    let requirements = await RequirementsModel.findOne({ order_id })



    let date = new Date()

    const orderChats = await OrderChat.find({ order_id })


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
    let timeIt = true

    let delivery_date = parseInt((order_mod.delivery_date - date) / 1000)
    if (delivery_date <= 0) {
        timeIt = false


    }
    let days = parseInt(delivery_date / (60 * 60 * 24))
    delivery_date = delivery_date % (60 * 60 * 24)

    let hours = parseInt((delivery_date) / (60 * 60))
    delivery_date = delivery_date % (60 * 60)

    let minutes = parseInt(delivery_date / 60)
    let seconds = delivery_date % (60)


    let timer = {
        days,
        hours,
        minutes,
        seconds,
        timeIt
    }
    console.log(orderChats)


    const recipient = order_mod.seller === loggedUser ? order_mod.buyer : order_mod.seller
    const context = {
        chats: orderChats,
        order: order_mod,
        loggedUser,
        recipient,
        online: true,
        timeElapse,
        ago,
        requirements,
        timer
    }

    res.render("order-chat", context)

}
const SaleModel = require("../../models/SaleModel")
const RequestModel = require("../../models/RequestModel")
module.exports = async (req, res) => {
    const order_id = req.query.oid
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    const order = await SaleModel.findOne({ order_id })
    console.log(order)
    const request = await RequestModel.findOne({ job_id: order.job_id })
    const offer = request.offers.find((offers) => (offers.username === order.buyer || offers.username === order.seller))
    const order_mod = { ...order.toObject() }
    order_mod.price = offer.price
    console.log("This")
    console.log(order_mod)


    res.render("order-chat", { loggedUser, order: order_mod })
}
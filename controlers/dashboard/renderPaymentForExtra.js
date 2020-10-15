const OrderChatModel = require("../../models/OrderChatModel")
const RevenueModel = require("../../models/RevenuesModel")
const DepositModel = require("../../models/DepositsModel")
const RefundModel = require("../../models/RefundsModel")
module.exports = async function (req, res) {
    try {
        let availableBalance = 0
        const query = req.query
        const order_id = query.oid
        const extra_id = query.eid
        const loggedUser = req.session.passport ? req.session.passport.user : "Betty"
        const refund = await RefundModel.findOne({ username: loggedUser })
        const deposit = await DepositModel.findOne({ username: loggedUser })
        const revenue = await RevenueModel.findOne({ username: loggedUser })
        for (let obj of [revenue, refund, deposit]) {
            if (obj)
                availableBalance += obj.amount
        }
        const extra = await OrderChatModel.findOne({ order_id, extra_id })

        let refundAmount = 0;
        let fee = 0;
        if (refund) {
            if (refund.amount >= extra.content.price) {
                fee = 0
            } else {
                refundAmount += refund.amount
                fee = (extra.content.price - refundAmount) * 0.05
            }



        }






        const total = fee * 1 + extra.content.price * 1

        console.log(extra)
        res.render("extra-payment", { extra, fee, total, order_id, availableBalance })

    } catch (err) {
        throw err

    }


}
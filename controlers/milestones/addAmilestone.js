const MilestoneModel = require("../../models/MilestoneModel")

const RevenueModel = require("../../models/RevenuesModel")
const SaleModel = require("../../models/SaleModel")
const NoticeModel = require("../../models/NoticesModel")
const axios = require("axios").default;
// let domain = "http://localhost:5000"
let domain = "https://fixlancer.herokuapp.com"



module.exports = async function (req, res) {
    try {

        const body = req.body
        const username = body.seller
        const per = body.percent / 100
        const order_id = body.order_id

        const sale = await SaleModel.findOne({ order_id })
        const milestoneAmount = per * sale.price
        console.log(sale)
        console.log(milestoneAmount)
        let milestone = new MilestoneModel({
            order_id,
            amount: milestoneAmount

        })
        milestone = await milestone.save()


        const revenue = await RevenueModel.findOneAndUpdate({ username }, { $inc: { amount: milestoneAmount } }, { new: true })
        const data = await MilestoneModel.find({})
        const response = await axios.post(`${domain}/api/transactions`, {
            username,
            type: "milestone",
            content: {
                order_id

            },
            amount: milestoneAmount
        })

        let notice = new NoticeModel({
            username,
            type: "milestone",
            content: {
                amount: milestoneAmount,
                order_id
            }

        })
        notice = await notice.save()



        const transaction = response.data

        res.status(201).json({ milestone, revenue, transaction, notice })


    } catch (err) {
        throw err
    }

}
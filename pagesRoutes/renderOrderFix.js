const FixModel = require("../models/FixModel")
const RequestModel = require("../models/RequestModel")
const RevenueModel = require("../models/RevenuesModel")
const DepositModel = require("../models/DepositsModel")
const RefundModel = require("../models/RefundsModel")

module.exports = async function (req, res) {
    const jobId = req.query.job_id
    const titleSlug = req.params.titleSlug
    let fix = {};
    let offer
    let custom = false;
    if (jobId) {
        const mod_fix = await FixModel.findOne({ titleSlug: titleSlug }).select("requirements")

        const data = await RequestModel.findOne({ job_id: jobId })


        offer = data.offers.find(offer => offer.slug === titleSlug)

        fix.price = offer.price
        fix.images_url = [offer.image_url]
        fix.delivery_days = offer.delivery
        fix.mainSlug = data.slug
        fix.titleSlug = offer.slug
        fix.requirements = mod_fix.requirements
        fix.username = offer.username
        fix.title = offer.title
        custom = true
        console.log(offer)
        console.log(fix)

    } else
        fix = await FixModel.findOne({ titleSlug: titleSlug })
    let balance = 0;
    let refundAmount = 0;

    if (req.session.passport) {

        const revenue = await RevenueModel.findOne({ username: req.session.passport.user })
        if (revenue) {
            balance += revenue.amount
            // console.log(balance)
        }


        const deposit = await DepositModel.findOne({ username: req.session.passport.user })
        if (deposit) {
            balance += deposit.amount

        }

        const refund = await RefundModel.findOne({ username: req.session.passport.user })
        if (refund) {
            refundAmount = refund.amount
            balance += refundAmount
            // console.log(balance)
        }

    }

    let total = fix.price - balance

    let fee = fix.price - refundAmount > 0 ? 0.05 * (fix.price - refundAmount) : 0
    total += fee
    if (total < 0) total = fix.price + fee


    // console.log(fix)
    res.render("order-fix", { fix, balance, total, fee, custom, jobId })

}
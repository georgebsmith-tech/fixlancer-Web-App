const router = require("express").Router()
const RefundModel = require("../models/RefundsModel");

router.get("/", async (req, res) => {
    const data = await RefundModel.find()
    return res.status(200).json({ data })
})

router.get("/:username", async (req, res) => {
    const data = await RefundModel.findOne({ username: req.params.username })
    if (data)
        return res.status(200).json({ data })
    return res.status(401).json({
        error: "User doesnt have a refund"
    })
})


router.post("/", async (req, res) => {
    const reqBody = req.body
    console.log(reqBody)
    // return
    const revenue = new RefundModel(reqBody)
    const data = await revenue.save()
    return res.status(200).json(data)

})

router.patch("/", async (req, res) => {
    const reqBody = req.body
    const amount = reqBody.amount
    const refund = await RefundModel.findOne({ username: reqBody.username })
    let leftAmount = -refund.amount + amount
    if (leftAmount > 0) {
        refund.amount = 0
        refund.updatedAt = new Date()
        return res.json({
            leftAmount
        })
    }
    refund.amount = -leftAmount
    refund.updatedAt = new Date()
    return res.json({
        leftAmount: -leftAmount
    })


})


module.exports = router
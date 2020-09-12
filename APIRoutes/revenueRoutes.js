const router = require("express").Router()
const RevenueModel = require("../models/RevenueModel");

router.get("/", async (req, res) => {
    const data = await RevenueModel.find()
    return res.status(200).json({ data })
})

router.get("/:username", async (req, res) => {
    const data = await RevenueModel.findOne({ username: req.params.username })
    if (data)
        return res.status(200).json({ data })
    return res.status(401).json({
        error: "User doesnt have a revenue"
    })
})


router.post("/", async (req, res) => {
    const reqBody = req.body
    console.log(reqBody)
    const revenue = new RevenueModel(reqBody)
    const data = await revenue.save()
    return res.status(200).json(data)

})
router.patch("/", async (req, res) => {
    const reqBody = req.body
    const amount = reqBody.amount
    const revenue = await RevenueModel.findOne({ username: reqBody.username })
    let leftAmount = -(revenue.amount - amount)
    if (leftAmount >= 0) {
        console.log("leftAmount in Revenue: " + leftAmount)
        revenue.amount = leftAmount
        revenue.updatedAt = new Date()
        return res.json({
            leftAmount
        })
    }


})
module.exports = router
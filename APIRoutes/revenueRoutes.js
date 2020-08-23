const router = require("express").Router()
const RevenueModel = require("../models/revenueModel");

router.get("/", async (req, res) => {
    const data = await RevenueModel.find()
    return res.status(200).json({ data })
})


router.post("/", async (req, res) => {
    const reqBody = req.body
    console.log(reqBody)
    const revenue = new RevenueModel(reqBody)
    const data = await revenue.save()
    return res.status(200).json(data)

})


module.exports = router
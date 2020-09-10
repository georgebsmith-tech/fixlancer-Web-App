const router = require("express").Router()
const RefundModel = require("../models/RefundModel");

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
    const revenue = new RefundModel(reqBody)
    const data = await revenue.save()
    return res.status(200).json(data)

})


module.exports = router
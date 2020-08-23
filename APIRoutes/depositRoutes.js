const router = require("express").Router()
const DepositModel = require("../models/depositModel");

router.get("/", async (req, res) => {
    const data = await DepositModel.find()
    return res.status(200).json({ data })
})

router.get("/:username", async (req, res) => {
    const data = await DepositModel.findOne({ username: req.params.username })
    if (data)
        return res.status(200).json({ data })
    return res.status(401).json({
        error: "User doesnt have a deposit"
    })
})


router.post("/", async (req, res) => {
    const reqBody = req.body
    console.log(reqBody)
    const revenue = new DepositModel(reqBody)
    const data = await revenue.save()
    return res.status(200).json(data)

})



module.exports = router
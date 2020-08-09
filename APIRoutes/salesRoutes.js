const router = require("express").Router()
const SalesModel = require("../models/salesModel")

router.post("/", async (req, res) => {
    const reqBody = req.body
    const request = new SalesModel(reqBody)
    const data = await request.save()
    return res.status(200).send({
        body: data
    })
})
router.get("/", async (req, res) => {
    const data = await SalesModel.find()
    res.status(200).json({
        number_of_records: data.length,
        data: data
    })
})




module.exports = router
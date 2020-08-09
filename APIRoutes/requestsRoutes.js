const router = require("express").Router()
const RequestModel = require("../models/requestsModel");

router.post("/", async (req, res) => {
    const reqBody = req.body
    const request = new RequestModel(reqBody)
    const data = await request.save()
    return res.status(200).send({
        body: data
    })
})
router.get("/", async (req, res) => {
    const data = await RequestModel.find()
    res.status(200).json({
        number_of_records: data.length,
        data: data
    })
})




module.exports = router
const router = require("express").Router()
const PushModel = require("../models/pushNoticeModel");

router.post("/", async (req, res) => {
    try {
        const pushSubscriber = PushModel(req.body)
        const data = await pushSubscriber.save()
        return res.status(200).json({
            message: "Data Saved",
            body: data
        })
    } catch (err) {
        res.status(400).send(err)

    }



})
router.get("/", async (req, res) => {
    const data = await PushModel.find()
    res.status(200).json({
        result: data
    })
})

router.get("/:username", async (req, res) => {
    const data = await PushModel.findOne({
        username: req.params.username
    })
    res.status(200).json({
        result: data
    })
})



module.exports = router
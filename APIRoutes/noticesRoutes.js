const router = require("express").Router()
const NoticesModel = require("../models/noticeModel")


router.get("/", async (req, res) => {
    const data = await NoticesModel.find()

    res.status(200).json(data)
})





module.exports = router
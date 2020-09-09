const router = require("express").Router()
const NoticesModel = require("../models/noticeModel")


router.get("/", async (req, res) => {
    const data = await NoticesModel.find()

    res.status(200).json(data)
})


router.patch("/:username", (req, res) => {
    NoticesModel.find({ username: req.params.username, read: false })
        .then(data => {
            console.log(data)
            data.forEach(notice => {
                notice.read = true
                notice.save()
                    .then(data => {
                    })
            })
            res.end()
        })

})





module.exports = router
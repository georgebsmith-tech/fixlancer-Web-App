const router = require("express").Router()
const NoticesModel = require("../models/NoticesModel")


router.get("/", async (req, res) => {
    const data = await NoticesModel.find()

    res.status(200).json(data)
})


router.patch("/:username", async (req, res) => {
    NoticesModel.find({ username: req.params.username, read: false })
        .then(data => {
            console.log(data)
            data.forEach(notice => {
                notice.read = true
                notice.save()
                    .then(data => {
                        console.log(data)

                    })
            })
            res.json({ done: true })
        })

})

router.post("/", async (req, res) => {
    const body = req.body
    const notice = new NoticesModel(body)
    notice.save()
        .then(data => {
            return res.status(201).json(data)
        })


})





module.exports = router
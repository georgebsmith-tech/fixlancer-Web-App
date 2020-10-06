const router = require("express").Router()
const RequestModel = require("../models/RequestModel");
const NoticeModel = require("../models/NoticesModel");

router.post("/", async (req, res) => {
    let user = req.session.passport.user
    const reqBody = req.body
    reqBody.username = user
    const lastRequest = await RequestModel.find().sort({ job_id: -1 }).limit(1)
    reqBody.job_id = lastRequest.length === 0 ? 1 : lastRequest[0].job_id + 1
    const request = new RequestModel(reqBody)
    const data = await request.save()
    return res.status(200).send({
        body: data
    })
})
router.patch("/", async (req, res) => {
    console.log(req.body)
    const reqBody = req.body
    reqBody.username = req.session.passport ? req.session.passport.user : "Smith"
    RequestModel.findOne({ _id: reqBody._id })
        .then(data => {
            data.offers.push(reqBody)
            data.save()
                .then(data => {
                    let notice = new NoticeModel({
                        username: data.username,
                        type: "offer",
                        content: {
                            price: reqBody.price,
                            username: reqBody.username,
                            title: data.title,
                            job_id: data._id,
                            slug: data.slug
                        }
                    })
                    notice.save()
                        .then(data => {
                            console.log(data)
                        })
                    return res.status(201).json(data)
                })
        })
})

router.patch("/:slug", (req, res) => {
    RequestModel.findOneAndUpdate(req.body, { status: "closed" }, { new: true })
        .then(data => {
            console.log(data)
            res.end()
        })

})



router.get("/", async (req, res) => {
    console.log(req.query)
    const Auser = req.query.a_user
    if (Auser) {
        let user = req.session.passport ? req.session.passport.user : "Betty"
        const data = await RequestModel.find({ username: user })
        return res.status(200).json({
            number_of_records: data.length,
            data: data
        })
    }
    const data = await RequestModel.find()
    res.status(200).json({
        number_of_records: data.length,
        data: data
    })
})

router.get("/:slug", async function (req, res) {

})


// router.get("/", async (req, res) => {
//     const data = await RequestModel.find()
//     res.status(200).json({
//         number_of_records: data.length,
//         data: data
//     })
// })





module.exports = router
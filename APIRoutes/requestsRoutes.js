const router = require("express").Router()
const RequestModel = require("../models/requestsModel");

router.post("/", async (req, res) => {

    let user = req.session.passport.user
    const reqBody = req.body
    reqBody.username = user
    const request = new RequestModel(reqBody)
    const data = await request.save()
    return res.status(200).send({
        body: data
    })
})



router.get("/", async (req, res) => {
    console.log(req.query)
    const Auser = req.query.a_user
    if (Auser) {
        let user = req.session.passport.user
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
const router = require("express").Router()
const FixModel = require("../models/fixesModel");
const upload = require("../controlers/awsConfig")

const multiple_uploads = upload.array("photo")

router.post("/", multiple_uploads, async (req, res) => {
    console.log(req.files)
    const reqBody = req.body
    reqBody.images_url = []
    req.files.forEach(file => {
        reqBody.images_url.push(file.location)
    })
    const fix = new FixModel(reqBody)
    const data = await fix.save()
    return res.status(200).send({
        body: data
    })
})
router.get("/", async (req, res) => {
    const reqString = req.query
    const state = reqString.state
    const count = reqString.count
    if (state === "random") {
        const data = await FixModel.aggregate([{ $sample: { size: count * 1 } }])
        return res.status(200).json(data)
    }
    if (state === "featured") {
        return res.status(200).json({
            state,
            count: "default"
        })
    }
    const data = await FixModel.find()
    res.status(200).json({
        number_of_records: data.length,
        data: data
    })
})






module.exports = router
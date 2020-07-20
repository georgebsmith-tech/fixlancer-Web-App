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
    const data = await FixModel.find()
    res.status(200).json({
        number_of_records: data.length,
        data: data
    })
})




module.exports = router
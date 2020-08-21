const router = require("express").Router()
const FixModel = require("../models/fixesModel");
const upload = require("../controlers/awsConfig")

// const multiple_uploads = upload.array("photo")
const multiple_uploads = upload.fields(
    [
        {
            name: 'video', maxCount: 1
        }, {
            name: 'photo', maxCount: 3
        }
    ]
)

router.post("/", multiple_uploads, async (req, res) => {
    const reqBody = req.body
    console.log(reqBody)
    console.log(req.files)
    // return res.json({
    //     message: "done"
    // })
    reqBody.username = req.session.passport.user

    reqBody.images_url = []
    reqBody.extras = [
        {
            description: reqBody.extra1_desc,
            price: reqBody.extra1_amount
        },
        {
            description: reqBody.extra2_desc,
            price: reqBody.extra2_amount
        }

    ]

    reqBody.tags = reqBody.tags.split(",")
    if (req.files.video) {
        reqBody.video = req.files.video[0].location
    }
    if (req.files.photo) {
        req.files.photo.forEach(file => {
            reqBody.images_url.push(file.location)
        })
    }

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

router.get("/:username", async (req, res) => {
    const data = await FixModel.find({ username: req.params.username })
    res.status(200).json({
        number_of_records: data.length,
        data: data
    })
})






module.exports = router
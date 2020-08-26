const ConversationModel = require("../models/conversationModel")

const router = require("express").Router()

router.get("/", async function (req, res) {
    const data = await ConversationModel.find()

    return res.status(200).json(data)
})

router.get("/:username", async (req, res) => {
    const from = req.params.username
    const to = req.query.with
    const data = await ConversationModel.find().or([{ from, to }, { from: to, to: from }])
    res.status(200).json({
        data
    })

})

router.post("/", async (req, res) => {
    const reqBody = req.body
    // console.log(reqBody)
    if (reqBody.from && reqBody.to && reqBody.message !== "") {
        const chat = new ConversationModel(reqBody)
        const data = await chat.save()
        return res.status(201).json(data)
    }
    return res.status(401).json({
        error: "All fields are required"
    })


})

module.exports = router
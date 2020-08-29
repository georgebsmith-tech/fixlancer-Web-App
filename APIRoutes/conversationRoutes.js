const ConversationModel = require("../models/conversationModel")

const router = require("express").Router()

router.get("/", async function (req, res) {
    const data = await ConversationModel.find()

    return res.status(200).json(data)
})

router.get("/:username", async (req, res) => {
    let to = req.query.with
    if (to) {
        // console.log(req.params.username)
        // console.log(to)

        const data = await ConversationModel.find().or([{ from: req.params.username, to }, { from: to, to: req.params.username }])
        return res.status(200).json({
            data
        })
    }
    const username = req.params.username
    console.log(username)
    const data = await ConversationModel.find().or([{ from: username }, { to: username }])
    return res.status(200).json({
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
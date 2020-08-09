const ConversationModel = require("../models/conversationModel")

const router = require("express").Router()

router.get("/", async function (req, res) {
    const data = await ConversationModel.find()

    return res.status(200).json(data)
})





module.exports = router
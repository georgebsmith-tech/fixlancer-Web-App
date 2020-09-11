const router = require("express").Router()
const TransactionModel = require("../models/TransactionModel")
const axios = require("axios")


router.get("/", async (req, res) => {
    TransactionModel.find()
        .then(data => {
            res.status(200).json({
                data
            })

        })

})

async function updateFunds(body) {
    axios.patch("/api/refunds")



}

router.post("/", async (req, res) => {
    const reqBody = req.body
    updateFunds(reqBody)
    return
    console.log(reqBody)
    TransactionModel.find().select("transaction_id").sort({ transaction_id: -1 }).limit(1)
        .then(async data => {
            reqBody.transaction_id = data.length === 0 ? 1 : data[0].transaction_id + 1
            const transaction = new TransactionModel(reqBody)
            const savedData = await transaction.save()
            return res.status(201).json(
                {
                    data: savedData
                }
            )

        })
})



module.exports = router
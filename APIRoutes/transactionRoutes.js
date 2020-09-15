const router = require("express").Router()
const TransactionModel = require("../models/TransactionModel")
const axios = require("axios").default;


router.get("/", async (req, res) => {
    TransactionModel.find()
        .then(data => {
            res.status(200).json({
                data
            })

        })

})

// let domain = "http://localhost:5000"
let domain = "https://fixlancer.herokuapp.com"
async function updateFunds(body) {
    console.log(body)
    const resp = await axios.patch(`${domain}/api/refunds`, body)
    const data = resp.data
    console.log(data)
    if (data.leftAmount > 0) {
        const resp = await axios.patch(`${domain}/api/revenues`, {
            amount: data.leftAmount,
            username: body.username
        })
        const data2 = resp.data
        if (data2.leftAmount > 0) {
            const resp = await axios.patch(`${domain}/api/deposits`, {
                amount: data2.leftAmount,
                username: body.username
            })
            console.log(resp.data)
        }
    }






}

router.post("/", async (req, res) => {
    const reqBody = req.body
    // console.log(reqBody)
    if (reqBody.type !== "deposit")
        updateFunds(reqBody)
    // return
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
const router = require("express").Router()
const SalesModel = require("../models/SaleModel")
const requestCancellation = require("../controlers/sales/requestCancellation")
const cancelOrder = require("../controlers/sales/cancelOrder")

router.post("/", async (req, res) => {
    const reqBody = req.body
    SalesModel.find().select("order_id").sort({ order_id: -1 }).limit(1)
        .then(async data => {
            reqBody.order_id = data.length === 0 ? 1 : data[0].order_id + 1
            const sale = new SalesModel(reqBody)
            const savedData = await sale.save()
            return res.status(200).json(
                {
                    data: savedData
                }
            )

        })

})
router.get("/", async (req, res) => {
    const data = await SalesModel.find()
    res.status(200).json({
        number_of_records: data.length,
        data: data
    })
})

router.put("/state", cancelOrder)



router.post("/cancellation", requestCancellation)




module.exports = router

const SalesModel = require("../../models/SaleModel")


module.exports = async (req, res) => {
    try {


        const order_id = req.body.order_id
        const salesData = await SalesModel.findOneAndUpdate(
            {
                order_id
            },
            {
                state: "cancelled",
                cancellation: {
                    cancellation: "accepted",
                    actionTakenAt: new Date()
                }
            },
            {
                new: true
            }
        )

        console.log(salesData)
        // console.log(body)
        res.status(200).json(
            {
                salesData
            })
    } catch (err) {
        throw err

    }
}

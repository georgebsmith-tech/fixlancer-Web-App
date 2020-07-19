const router = require("express").Router()
const AffiliateModel = require("../models/affiliateModel");


// console.log(AffiliateModel)
const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

router.post("/", async (req, res) => {
    const reqBody = req.body
    reqBody.orders_by_month = []
    months.forEach(month => {
        reqBody.orders_by_month.push({ month: month })
    })
    const affiliate = new AffiliateModel(reqBody)
    const data = await affiliate.save()
    return res.status(200).send({
        body: data
    })
})




module.exports = router
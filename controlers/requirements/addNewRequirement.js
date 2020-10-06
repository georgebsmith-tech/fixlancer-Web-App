const RequirementModel = require("../../models/RequirementModel")
const SaleModel = require("../../models/SaleModel")
module.exports = async function (req, res) {
    try {
        const body = req.body
        const newBody = {
            order_id: body.order_id,
            content: {
                requirements: body.requirements,
                file: ""
            }
        }
        const requirement = new RequirementModel(newBody)
        const data = await requirement.save()
        const sale = await SaleModel.findOneAndUpdate({ order_id: body.order_id }, { hasStarted: true, startedAt: new Date() }, { new: true })


        res.status(200).json({ requirement: data, sale })

    } catch (err) {
        throw err
    }



}
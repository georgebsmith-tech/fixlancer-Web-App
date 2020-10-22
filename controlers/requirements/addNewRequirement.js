const RequirementModel = require("../../models/RequirementModel")
const SaleModel = require("../../models/SaleModel")
const upload = require("../../configuration/cloudinaryConfig")



module.exports = async function (req, res) {
    try {

        let { file, requirements, order_id, fileName } = req.body
        if (file) {
            const response = await upload(file)
            file = response.secure_url
            console.log(response)

        }


        // res.status(200).json(response)


        let newBody = {
            order_id,
            content: {
                fileName,
                requirements,
                file

            }
        }
        // console.log(newBody)
        // return

        const requirement = new RequirementModel(newBody)
        const data = await requirement.save()
        const sale = await SaleModel.findOneAndUpdate({ order_id }, { hasStarted: true, startedAt: new Date() }, { new: true })
        console.log(data)


        res.status(200).json({ requirement: data, sale })

    } catch (err) {
        throw err
    }



}
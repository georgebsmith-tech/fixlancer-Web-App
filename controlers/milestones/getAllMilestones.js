const MilestoneModel = require("../../models/MilestoneModel")



module.exports = async function (req, res) {
    try {
        const data = await MilestoneModel.find({})

        res.status(201).json({ data })


    } catch (err) {
        throw err
    }

}
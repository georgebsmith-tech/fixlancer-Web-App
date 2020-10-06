const FixModel = require("../../models/FixModel")

module.exports = async (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"

    const slug = req.query.fixid
    const order_id = req.query.oid

    const data = await FixModel.findOne({ titleSlug: slug }).select("requirements")
    res.render("order-requirements", { loggedUser, data, order_id })


}
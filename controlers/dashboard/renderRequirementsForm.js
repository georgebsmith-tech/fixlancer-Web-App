module.exports = async (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    res.render("order-requirements", { loggedUser })


}
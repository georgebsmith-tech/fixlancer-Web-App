function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect("/dashboard")
        return
    }
    next()
}



module.exports = checkNotAuthenticated
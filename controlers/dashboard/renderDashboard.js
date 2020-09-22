const UserModel = require("../../models/UserModel")
const CategoriesModel = require("../../models/CategoriesModel")

const FixModel = require("../../models/FixModel")



let domain = "https://fixlancer.herokuapp.com"
// let domain = "http://localhost:5000"

const axios = require("axios").default
module.exports = async (req, res) => {

    let loggedUser = req.session.passport ? req.session.passport.user : "Betty"

    UserModel.findOneAndUpdate({ username: loggedUser }, { online: true }, { new: true })
        .then(data => {
            // console.log(data)

        })
    const categories = await CategoriesModel.find({}).select("name catSlug")

    const resp = await axios.get(`${domain}/api/fixes?state=random&count=6`)
    const resp2 = await axios.get(`${domain}/api/users/${loggedUser}`)
    console.log(resp2.data)
    console.log(resp2.data.data.summary)
    let summary = resp2.data.data
    let fixes = await FixModel.find({ username: loggedUser })

    const featuredFixes = resp.data
    const context = {
        categories,
        featuredFixes,
        summary,
        fixes, loggedUser
    }
    res.render("dashboard-new", context)
}
// module.exports = async function (req, res) {
//     // console.log(process.env)
//     const body = req.body
//     console.log(body)
//     const data = await UserModel.findOne({ username: body.username })
//     if (data) {
//         console.log(data)
//         const hash = data.password
//         console.log(hash)
//         const password = body.password
//         console.log(password)
//         const ispassword = await bcrypt.compare(password, hash)
//         console.log(ispassword)
//         if (ispassword) {
//             const userAuthToken = jwt.sign({ id: data.username }, process.env.USER_JWT_SECRET)
//             res.status(200).header("token", userAuthToken).json({
//                 token: userAuthToken,
//                 loggedIn: true
//             })
//         } else {
//             res.status(401).json({
//                 message: "Incorrect  username or password",
//                 loggedIn: false
//             })
//         }
//     } else {
//         res.status(401).json({
//             message: "Incorrect username or password",
//             loggedIn: false
//         })
//     }

// }

const passport = require("passport")
module.exports = passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true

})
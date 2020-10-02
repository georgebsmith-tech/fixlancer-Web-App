module.exports = async (req, res) => {

    const body = req.body

    if (body.solved) {
        console.log("Puzzle solved")
        const userRes = await UserModel.find({ username: body.username })
        if (userRes.length >= 1) {
            console.log("Username Exists")
            return res.status(401).json({
                error: "Username already Exists",
                errorCode: 1
            })
        }


        const emailRes = await UserModel.find({ email: body.email })
        if (emailRes.length >= 1) {
            res.status(401).json({
                error: "email already Exists",
                errorCode: 2

            })
        }
        const phoneRes = await UserModel.find({ phone: body.phone })
        if (phoneRes.length >= 1) {
            res.status(401).json({
                error: "There's already a user with this number",
                errorCode: 3
            })
        }
        if (body.password !== body.confirm_password) {
            return res.status(401).json({
                error: "'password' and 'confirm password' fields must match ",
                errorCode: 4
            })
        }

    } else {
        res.status(401).json({
            error: "Puzzle not solved!",
            errorCode: 5
        })
    }
    body.password = (await bcrypt.hash(body.password, 15)).toString()
    // body.imageURL = req.file.location
    try {
        const user = new UserModel(body)
        const data = await user.save()
        console.log("Data saved")

        res.status(200).json({
            created: true
        })

    } catch (err) {
        return res.status(404).json({
            error: err
        })


    }
}
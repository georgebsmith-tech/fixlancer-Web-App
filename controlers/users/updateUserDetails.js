const UserModel = require("../../models/UserModel")
const BankModel = require("../../models/BanksModel")
const bcrypt = require("bcrypt")

module.exports = async function (req, res) {
    const reqBody = req.body;
    const theUser = await UserModel.findOne({ username: req.params.username })
    if (!theUser) {
        return res.status(401).json({
            error: "No user with the username " + req.params.username,
            error_code: 1
        })
    }
    if (req.params.username !== reqBody.username) {
        const usernameExist = await UserModel.findOne({ username: reqBody.username })

        if (usernameExist) {
            return res.status(400).json({
                error: `Username ${reqBody.username} already exist`,
                error_code: 2
            })
        }

    }

    let updatedUser, userUpdate;
    if (reqBody.password.trim() !== "") {
        if (reqBody.password !== reqBody.repeat_password) {
            return res.status(400).json({
                error: "password field and repeat password field don't match",
                error_code: 3
            })
        } else {
            const password = await bcrypt.hash(reqBody.password, 12)
            userUpdate = {
                username: reqBody.username,
                fullName: reqBody.full_name,
                city: reqBody.city,
                phone: reqBody.phone,
                bio: reqBody.bio,
                password
            }

        }
    } else {
        userUpdate = {
            username: reqBody.username,
            fullName: reqBody.full_name,
            city: reqBody.city,
            phone: reqBody.phone,
            bio: reqBody.bio,
        }
    }

    const bankDetals = {
        bankName: reqBody.bank_name,
        accNumber: reqBody.acc_number,
        accName: reqBody.acc_name,
        username: reqBody.username
    }
    const updatedBank = await BankModel.findOneAndUpdate({ username: req.params.username }, bankDetals, { new: true })
    updatedUser = await UserModel.findOneAndUpdate({ username: req.params.username }, userUpdate, { new: true })

    const outData = {
        data: updatedUser,
        bankDetals: updatedBank
    }

    res.status(201).json(outData)

} 
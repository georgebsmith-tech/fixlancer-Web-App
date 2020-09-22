const UserModel = require("../../models/UserModel")
const BankModel = require("../../models/BanksModel")

module.exports = async (req, res) => {
    const username = req.params.username
    const reqBody = req.body
    console.log(reqBody)
    let userData = {
        bio: reqBody.bio,
        city: reqBody.city,
        fullName: reqBody.fullName
    }
    if (reqBody.password !== "" && reqBody.password === reqBody.confirmPassword) {
        password = await bcrypt.hash(reqBody.password, 15)
        userData.password = password
    }
    if (req.file) {
        userData.imageURL = req.file.location
    }
    if (username !== reqBody.username) {
        userData.username = reqBody.username
    }
    if (reqBody.phone !== reqBody.oldPhone) {
        userData.phone = reqBody.phone
    }

    let newBankDetails = {
        bankName: reqBody.bankName,
        accNumber: reqBody.accNumber,
        accName: reqBody.accName
    }

    let bank;
    const oldBank = await BankModel.findOne({ username: username })
    if (oldBank) {
        console.log(newBankDetails)
        bank = await BankModel.findOneAndUpdate({ username: username }, newBankDetails, { new: true })

    } else {
        console.log(newBankDetails)
        newBankDetails.username = username
        console.log(newBankDetails)
        let theData = new BankModel(newBankDetails)
        bank = await theData.save()

    }
    console.log(`bank: ${bank}`)



    const data = await UserModel.findOneAndUpdate({ username: username }, userData, { new: true })


    return res.status(201).json({
        message: "Done",
        data, bank
    })





}
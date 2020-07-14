
const mongoose = require("mongoose")
const router = require("express").Router()
const bcrypt = require("bcrypt")
const multer = require("multer")

const UserModel = require("../models/usersModel")
const BankModel = require("../models/bankModel")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(":", "-") + file.originalname)
    }
})
const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1025 * 10
    }
})
// const upload = multer({ dest: "uploads/" })

//Registration route
router.post("/register", upload.single("photo"), async (req, res) => {
    console.log(req.file)
    const body = req.body
    if (body.solved) {
        console.log("Puzzle solved")
        const userRes = await UserModel.find({ username: body.username })
        if (userRes.length >= 1) {
            console.log("Username Exists")
            return res.status(404).json({
                message: "Username already Exists"
            })
        }

        const emailRes = await UserModel.find({ email: body.email })
        if (emailRes.length >= 1) {
            res.status(404).json({
                message: "email already Exists"
            })
        }
        const phoneRes = await UserModel.find({ phone: body.phone })
        if (phoneRes.length >= 1) {
            res.status(404).json({
                message: "Someone is already using this number"
            })
        }

    } else {
        res.status(404).json({
            message: "Puzzle not solved!"
        })
    }
    body.hashPassword = (await bcrypt.hash(body.password, 15)).toString()
    body.imageURL = req.file.path
    try {
        const user = new UserModel(body)
        const data = await user.save()
        console.log("Data saved")

        res.status(200).json({
            message: "Data Saved!!",
            body: data
        })

    } catch (err) {
        res.status(404).json({
            error: "Error"
        })
        throw err

    }


})


router.post("/login", async (req, res) => {
    const body = req.body
    console.log(body)
    const data = await UserModel.findOne({ username: body.username })
    if (data) {
        console.log(data)
        const ispassword = await bcrypt.compare(body.password, data.hashPassword)
        console.log(ispassword)
        if (ispassword) {
            res.status(200).json({
                body: data
            })
        } else {
            res.status(401).json({
                message: "Incorrect  username or password"
            })
        }
    } else {
        res.status(401).json({
            message: "Incorrect username or password"
        })
    }

})


router.get("/personal-info/:username", async (req, res) => {
    const data = await UserModel.findOne({
        username: req.params.username
    })
    if (data) {
        await delete data.hashPassword
        const bankDetails = await BankModel.findOne({ username: data.username })
        res.status(200).json({
            body: data,
            bankDetails: bankDetails
        })
    } else {
        res.status(401).json({
            message: "No User with that username"
        })
    }
})


router.put("/register/:username", upload.single("photo"), async function (req, res) {
    const body = req.body
    body.imageURL = req.file.path
    const data = await UserModel.findOneAndUpdate({ username: req.params.username }, body, { new: true })

    res.status(200).json(data)
})



router.post("/bank-details/:username", async function (req, res) {
    const data = await UserModel.findOne({ username: req.params.username })

    if (data) {
        const body = req.body
        console.log(body)
        const details = {
            username: req.params.username,
            accName: body.accName,
            accNumber: body.accNumber,
            bankName: body.bankName
        }
        const bankDetails = new BankModel(details)
        const savedData = await bankDetails.save()
        res.status(200).json(savedData)
    } else {
        res.status(401).json({
            message: "No user with that information"
        })
    }
})


module.exports = router
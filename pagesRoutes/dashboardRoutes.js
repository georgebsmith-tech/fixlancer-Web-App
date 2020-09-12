const router = require("express").Router()
const axios = require("axios").default

//models
const UserModel = require("../models/UserModel")
const FixModel = require("../models/FixModel")
// const RequestModel = require("../models/RequestsModel")
const DepositModel = require("../models/DepositModel")
const RevenueModel = require("../models/RevenueModel")
const RefundModel = require("../models/RefundModel")
const ConversationModel = require("../models/ConversationModel")
const NoticeModel = require("../models/NoticeModel")
const TransactionModel = require("../models/TransactionModel")

const checkUserAuthenticated = require("../middleware/userIsAuthenticated")





router.get("/", checkUserAuthenticated, (req, res) => {

    let user = req.session.passport.user

    UserModel.findOneAndUpdate({ username: user }, { online: true }, { new: true })
        .then(data => {
            // console.log(data)

        })
    res.render("dashboard")
})
router.get("/my-requests", (req, res) => {
    const notice = req.query.notice
    console.log(notice)
    res.render("my-requests", { notice })
})

// router.get("/job-requests", async (req, res) => {
//     try {
//         const requests = await RequestModel.find({ approved: true })
//         const loggedUser = req.session.passport ? req.session.passport.user : "Smith"
//         requests.reverse()

//         // console.log(requests)

//         res.render("all-requests", { requests, loggedUser })

//     } catch (err) {
//         throw err
//     }

// })

router.get("/create-a-fix", (req, res) => {
    res.render("create-fix")
})

router.get("/post-job-request", checkUserAuthenticated, (req, res) => {
    res.render("post-request")
})
let domain = "https://fixlancer.herokuapp.com"
// let domain = "http://localhost:3000"
router.get("/inbox", async (req, res) => {
    try {


        let recipient = req.query.with;
        let loggedUser;
        // console.log("1 Got here")
        if (!req.session.passport) { loggedUser = "Smith" }
        else { loggedUser = req.session.passport.user }
        if (recipient) {
            let date = new Date()

            const userColorData = await UserModel.findOne({ username: recipient }).select("userColor online last_seen")
            let chats = await axios.get(`${domain}/api/chats/${loggedUser}?with=${recipient}`)
            chats = chats.data.data
            let timeElapse = parseInt((date - userColorData.last_seen) / (1000 * 60))
            if ((timeElapse - 5) > 60 * 24 * 7) {
                theTime = parseInt((timeElapse - 5) / (60 * 24 * 7));
                ago = `${theTime}w`
                // console.log(ago)
            }
            else if ((timeElapse - 5) > 60 * 24) {
                console.log(timeElapse - 5)
                theTime = parseInt((timeElapse - 5) / (60 * 24));
                ago = `${theTime}d`
                // console.log(ago)
            } else if ((timeElapse - 5) > 60) {
                console.log(timeElapse - 5)
                theTime = parseInt((timeElapse - 6) / (60));
                ago = `${theTime}h`
                console.log(ago)
            } else {
                console.log(timeElapse - 5)
                ago = `${parseInt(timeElapse - 5)}m`
                // console.log(ago)
            }

            res.render("chat-detailed", { chats, loggedUser, recipient, userColorData, online: userColorData.online, timeElapse, ago })
            return

        }



        const resp = await axios.get(`${domain}/api/chats/${loggedUser}`)


        const conversations = resp.data.data
        if (conversations.length === 0) {
            res.render("chats", { theConversations: conversations, loggedUser })
            return
        }
        let users = conversations.map(user => { return [user.to, user.from] }).map(pair => {
            if (pair[0] !== loggedUser) {
                return pair[0]
            }
            return pair[1]
        })

        let theConversations = [];
        users = [...new Set(users)]


        await users.forEach(async (user, index) => {
            let data = await ConversationModel.find().or([{ from: user, to: loggedUser }, { to: user, from: loggedUser }])

            const userColorData = await UserModel.findOne({ username: user }).select("userColor online last_seen")
            let deConversation = {
                from: data.slice(-1)[0].from,
                to: data.slice(-1)[0].to,
                message: data.slice(-1)[0].message,
                userColor: userColorData.userColor,
                createdAt: data.slice(-1)[0].createdAt.toDateString()
            }
            theConversations.push(deConversation)
            // console.log(deConversation)
            if (index * 1 === users.length - 1) {
                theConversations = theConversations.reverse()

                res.render("chats", { theConversations, loggedUser })
                return
            }
        })
    } catch (err) {
        throw err
    }
})
router.get("/affiliate", checkUserAuthenticated, (req, res) => {
    res.render("affiliate")
})
router.get("/profile", checkUserAuthenticated, (req, res) => {
    res.render("profile")
})

router.get("/my-orders", checkUserAuthenticated, (req, res) => {
    res.render("my-orders-ongoing")
})
router.get("/my-orders/completed", checkUserAuthenticated, (req, res) => {
    res.render("my-orders-completed")
})
router.get("/my-orders/cancelled", checkUserAuthenticated, (req, res) => {
    res.render("my-orders-cancelled")
})
router.get("/my-orders/delivered", checkUserAuthenticated, (req, res) => {
    res.render("my-orders-delivered")
})

router.get("/my-sales/delivered", checkUserAuthenticated, (req, res) => {
    res.render("my-sales-delivered")
})

router.get("/my-sales/", checkUserAuthenticated, (req, res) => {
    res.render("my-sales-ongoing")
})
router.get("/my-sales/completed", checkUserAuthenticated, (req, res) => {
    res.render("my-sales-completed")
})




router.get("/profile/edit", checkUserAuthenticated, (req, res) => {
    res.render("edit")
})
router.get("/my-sales/cancelled", checkUserAuthenticated, (req, res) => {
    res.render("my-sales-cancelled")
})
router.get("/finance", async (req, res) => {
    let revenue = 0;
    let deposit = 0;
    let refund = 0;
    const user = req.session.passport ? req.session.passport.user : undefined

    const revenueData = await RevenueModel.findOne({ username: user })
    if (revenueData)
        revenue = revenueData.amount

    const depositData = await DepositModel.findOne({ username: user })
    if (depositData)
        deposit = depositData.amount
    const refundData = await RefundModel.findOne({ username: user })
    if (refundData)
        refund = refundData.amount



    res.render("finance", {
        revenue, deposit, refund
    })
})

router.get("/finance/transactions", async (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    const transactions = await TransactionModel.find({ username: loggedUser })
    transactions.reverse()
    // console.log(transactions)
    res.render("finance-transactions", { transactions })
})


router.get("/finance/notices", async (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Smith"

    const notices = await NoticeModel.find({ username: loggedUser })
    notices.reverse()


    res.render("finance-notices", { notices })
})
router.get("/finance/withdraw", async (req, res) => {
    let revenue = 0;
    const user = req.session.passport ? req.session.passport.user : "Smith"

    const revenueData = await RevenueModel.findOne({ username: user })
    if (revenueData)
        revenue = revenueData.amount
    res.render("finance-withdraw", { revenue })
})
router.get("/order-chat", async (req, res) => {


    res.render("order-chat")
})

router.get("/:slug", async (req, res) => {
    const slug = req.params.slug
    const loggedUser = req.session.passport ? req.session.passport.user : "Smith"
    const fixes = await FixModel.find({ username: loggedUser }).select("title titleSlug images_url")
    const requestData = await RequestModel.findOne({ slug })
    // console.log(requestData)
    res.render("request", { title: "title", request: requestData, loggedUser, fixes })
})
router.get("/edit", checkUserAuthenticated, (req, res) => {
    res.render("edit")
})






module.exports = router
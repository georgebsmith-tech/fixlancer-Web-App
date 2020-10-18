const router = require("express").Router();
const axios = require("axios").default;
let domain = "https://fixlancer.herokuapp.com"
// let domain = "http://localhost:5000"
//models
const UserModel = require("../models/UserModel");
const FixModel = require("../models/FixModel");
const RequestModel = require("../models/RequestModel");
const DepositModel = require("../models/DepositsModel");
const RevenueModel = require("../models/RevenuesModel");
const RefundModel = require("../models/RefundsModel");
const ConversationModel = require("../models/ConversationsModel");
const NoticeModel = require("../models/NoticesModel");
const TransactionModel = require("../models/TransactionModel");
const SaleModel = require("../models/SaleModel");
const CategoriesModel = require("../models/CategoriesModel");

const BankModel = require("../models/BanksModel")


const checkUserAuthenticated = require("../middleware/userIsAuthenticated");
const checkAuthenticated = require("../middleware/userIsAuthenticated");



const renderDashboard = require("../controlers/dashboard/renderDashboard")
const payForExtra = require("../controlers/dashboard/renderPaymentForExtra")


const renderRequirementForm = require("../controlers/dashboard/renderRequirementsForm")
router.get("/order-requirements", renderRequirementForm)



router.get("/", checkAuthenticated, renderDashboard)
router.get("/pay-for-extra", payForExtra)
router.get("/my-requests", (req, res) => {
    const notice = req.query.notice
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"

    res.render("my-requests", { notice, loggedUser })
})

const rederOrderChat = require("../controlers/dashboard/renderOrderChat")
router.get("/order-chat", rederOrderChat)


router.get("/job-requests", async (req, res) => {
    try {
        const requests = await RequestModel.find({ approved: true })
        const loggedUser = req.session.passport ? req.session.passport.user : "Smith"
        requests.reverse()

        // console.log(requests)

        res.render("all-requests", { requests, loggedUser })

    } catch (err) {
        throw err
    }

})

router.get("/create-a-fix", (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    res.render("create-fix", { loggedUser })
})

router.get("/post-job-request", checkUserAuthenticated, (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    res.render("post-request", { loggedUser })
})


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

                theTime = parseInt((timeElapse - 5) / (60 * 24));
                ago = `${theTime}d`
                // console.log(ago)
            } else if ((timeElapse - 5) > 60) {

                theTime = parseInt((timeElapse - 6) / (60));
                ago = `${theTime}h`

            } else {

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


router.get("/my-orders", async (req, res) => {
    let loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    let orders = await SaleModel.find({ buyer: loggedUser, state: "ongoing" })
    console.log(orders)
    let customOrders = []
    for (let order of orders) {
        let request = await RequestModel.findOne({ job_id: order.job_id })
        if (!request) continue
        console.log(request)
        let sellerData = await UserModel.findOne({ username: order.seller }).select("userColor")
        // console.log(sellerData)
        let offer = request.offers.find(offer => offer.username === order.seller)
        console.log(offer)
        let theFix = {
            title: offer.title,
            image_url: offer.image_url,
            price: offer.price,
            seller: offer.username,
            buyer: loggedUser,
            delivery_date: order.delivery_date,
            sellerColor: sellerData.userColor,
            loggedUser,
            order_id: order.order_id,
            slug: offer.slug,
            hasStarted: order.hasStarted,
            startedAt: order.startedAt


        }
        customOrders.push(theFix)

    }
    console.log(customOrders)
    let ordersAll = await SaleModel.find({ buyer: loggedUser })
    let orderCounts = {
        ongoing: ordersAll.filter(order => order.state === "ongoing").length,
        delivered: ordersAll.filter(order => order.state === "delivered").length,
        cancelled: ordersAll.filter(order => order.state === "cancelled").length,
        completed: ordersAll.filter(order => order.state === "completed").length
    }


    res.render("my-orders-ongoing", { orders: customOrders, orderCounts, loggedUser })
})


router.get("/my-orders/completed", async (req, res) => {

    let loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    let orders = await SaleModel.find({ buyer: loggedUser, state: "completed" })
    let customOrders = []
    for (let order of orders) {
        let request = await RequestModel.findOne({ job_id: order.job_id })
        let sellerData = await UserModel.findOne({ username: order.seller }).select("userColor")
        // console.log(sellerData)
        let offer = request.offers.find(offer => offer.username === order.seller)
        let theFix = {
            title: offer.title,
            image_url: offer.image_url,
            price: offer.price,
            seller: offer.username,
            buyer: loggedUser,
            delivery_date: order.delivery_date,
            sellerColor: sellerData.userColor,
            loggedUser


        }
        customOrders.push(theFix)

    }
    let ordersAll = await SaleModel.find({ buyer: loggedUser })
    let orderCounts = {
        ongoing: ordersAll.filter(order => order.state === "ongoing").length,
        delivered: ordersAll.filter(order => order.state === "delivered").length,
        cancelled: ordersAll.filter(order => order.state === "cancelled").length,
        completed: ordersAll.filter(order => order.state === "completed").length
    }
    console.log(customOrders)
    res.render("my-orders-completed", { orders: customOrders, orderCounts, loggedUser })
})
router.get("/my-orders/cancelled", async (req, res) => {
    let loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    let orders = await SaleModel.find({ buyer: loggedUser, state: "cancelled" })
    let customOrders = []
    for (let order of orders) {
        let request = await RequestModel.findOne({ job_id: order.job_id })
        let sellerData = await UserModel.findOne({ username: order.seller }).select("userColor")
        // console.log(sellerData)
        let offer = request.offers.find(offer => offer.username === order.seller)
        let theFix = {
            title: offer.title,
            image_url: offer.image_url,
            price: offer.price,
            seller: offer.username,
            buyer: loggedUser,
            delivery_date: order.delivery_date,
            sellerColor: sellerData.userColor,
            loggedUser,
            hasStarted: order.hasStarted,
            slug: offer.slug,
            startedAt: order.startedAt,
            order_id: order.order_id


        }
        // let theFix = {
        //     title: offer.title,
        //     image_url: offer.image_url,
        //     price: offer.price,
        //     seller: loggedUser,
        //     buyer: sale.buyer,
        //     delivery_date: sale.delivery_date,
        //     sellerColor: buyerData.userColor,
        //     loggedUser,
        //     





        // }
        customOrders.push(theFix)

    }
    let ordersAll = await SaleModel.find({ buyer: loggedUser })
    let orderCounts = {
        ongoing: ordersAll.filter(order => order.state === "ongoing").length,
        delivered: ordersAll.filter(order => order.state === "delivered").length,
        cancelled: ordersAll.filter(order => order.state === "cancelled").length,
        completed: ordersAll.filter(order => order.state === "completed").length
    }
    console.log(customOrders)

    res.render("my-orders-cancelled", { orders: customOrders, orderCounts, loggedUser })
})

function getOrderCounts(buyer) {

}
router.get("/my-orders/delivered", async (req, res) => {
    let loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    let orders = await SaleModel.find({ buyer: loggedUser, state: "delivered" })
    let ordersAll = await SaleModel.find({ buyer: loggedUser })
    let orderCounts = {
        ongoing: ordersAll.filter(order => order.state === "ongoing").length,
        delivered: ordersAll.filter(order => order.state === "delivered").length,
        cancelled: ordersAll.filter(order => order.state === "cancelled").length,
        completed: ordersAll.filter(order => order.state === "completed").length
    }
    let customOrders = []
    for (let order of orders) {
        let request = await RequestModel.findOne({ job_id: order.job_id })
        let sellerData = await UserModel.findOne({ username: order.seller }).select("userColor")
        // console.log(sellerData)
        let offer = request.offers.find(offer => offer.username === order.seller)
        let theFix = {
            title: offer.title,
            image_url: offer.image_url,
            price: offer.price,
            seller: offer.username,
            buyer: loggedUser,
            delivery_date: order.delivery_date,
            sellerColor: sellerData.userColor,
            loggedUser


        }
        customOrders.push(theFix)
    }
    console.log(customOrders)

    res.render("my-orders-delivered", { orders: customOrders, orderCounts, loggedUser })
})



router.get("/my-sales/delivered", async (req, res) => {
    let loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    let sales = await SaleModel.find({ seller: loggedUser, state: "delivered" })
    let salesAll = await SaleModel.find({ seller: loggedUser })
    let salesCounts = {
        ongoing: salesAll.filter(order => order.state === "ongoing").length,
        delivered: salesAll.filter(order => order.state === "delivered").length,
        cancelled: salesAll.filter(order => order.state === "cancelled").length,
        completed: salesAll.filter(order => order.state === "completed").length
    }
    let customSales = []
    for (let sale of sales) {
        console.log(sale)
        let request = await RequestModel.findOne({ job_id: sale.job_id })
        let buyerData = await UserModel.findOne({ username: sale.buyer }).select("userColor")
        console.log(request)
        console.log(request.offers)
        console.log(sale.buyer)
        console.log("***************************************")
        let offer = request.offers.find(offer => offer.username === loggedUser)
        let theFix = {
            title: offer.title,
            image_url: offer.image_url,
            price: offer.price,
            seller: loggedUser,
            buyer: sale.buyer,
            delivery_date: sale.delivery_date,
            sellerColor: buyerData.userColor,
            loggedUser


        }
        customSales.push(theFix)

    }
    res.render("my-sales-delivered", { sales: customSales, salesCounts, loggedUser })
})

router.get("/my-sales", async (req, res) => {
    let loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    let sales = await SaleModel.find({ seller: loggedUser, state: "ongoing" })
    let salesAll = await SaleModel.find({ seller: loggedUser })
    let salesCounts = {
        ongoing: salesAll.filter(order => order.state === "ongoing").length,
        delivered: salesAll.filter(order => order.state === "delivered").length,
        cancelled: salesAll.filter(order => order.state === "cancelled").length,
        completed: salesAll.filter(order => order.state === "completed").length
    }
    let customSales = []
    for (let sale of sales) {
        let request = await RequestModel.findOne({ job_id: sale.job_id })
        let buyerData = await UserModel.findOne({ username: sale.buyer }).select("userColor")
        // console.log(request)
        if (!request) continue
        // console.log(request.offers)
        // console.log(sale.buyer)
        // console.log("***************************************")
        let offer = request.offers.find(offer => offer.username === loggedUser)
        let theFix = {
            title: offer.title,
            image_url: offer.image_url,
            price: offer.price,
            seller: loggedUser,
            buyer: sale.buyer,
            delivery_date: sale.delivery_date,
            sellerColor: buyerData.userColor,
            loggedUser,
            order_id: sale.order_id,
            slug: offer.slug,
            hasStarted: sale.hasStarted,
            startedAt: sale.startedAt


        }
        customSales.push(theFix)

    }
    // console.log(customSales)
    res.render("my-sales-ongoing", { sales: customSales, salesCounts, loggedUser })
})
router.get("/my-sales/completed", async (req, res) => {
    let loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    let sales = await SaleModel.find({ seller: loggedUser, state: "completed" })
    let salesAll = await SaleModel.find({ seller: loggedUser })
    let salesCounts = {
        ongoing: salesAll.filter(order => order.state === "ongoing").length,
        delivered: salesAll.filter(order => order.state === "delivered").length,
        cancelled: salesAll.filter(order => order.state === "cancelled").length,
        completed: salesAll.filter(order => order.state === "completed").length
    }
    let customSales = []
    for (let sale of sales) {
        console.log(sale)
        let request = await RequestModel.findOne({ job_id: sale.job_id })
        let buyerData = await UserModel.findOne({ username: sale.buyer }).select("userColor")
        console.log(request)
        console.log(request.offers)
        console.log(sale.buyer)
        console.log("***************************************")
        let offer = request.offers.find(offer => offer.username === loggedUser)
        let theFix = {
            title: offer.title,
            image_url: offer.image_url,
            price: offer.price,
            seller: loggedUser,
            buyer: sale.buyer,
            delivery_date: sale.delivery_date,
            sellerColor: buyerData.userColor,
            loggedUser


        }
        customSales.push(theFix)

    }
    res.render("my-sales-completed", { sales: customSales, salesCounts, loggedUser })
})



router.get("/profile/edit", async (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    const data = await UserModel.findOne({ username: loggedUser })

    let bank = await BankModel.findOne({ username: loggedUser })
    if (!bank)
        bank = {
            accName: "",
            accNumber: "",
            bankName: ""
        }

    res.render("edit", { data, bank, loggedUser })
})
router.get("/my-sales/cancelled", async (req, res) => {
    let loggedUser = req.session.passport ? req.session.passport.user : "Betty"
    let sales = await SaleModel.find({ seller: loggedUser, state: "cancelled" })
    let salesAll = await SaleModel.find({ seller: loggedUser })
    let salesCounts = {
        ongoing: salesAll.filter(order => order.state === "ongoing").length,
        delivered: salesAll.filter(order => order.state === "delivered").length,
        cancelled: salesAll.filter(order => order.state === "cancelled").length,
        completed: salesAll.filter(order => order.state === "completed").length
    }
    let customSales = []
    for (let sale of sales) {
        console.log(sale)
        let request = await RequestModel.findOne({ job_id: sale.job_id })
        let buyerData = await UserModel.findOne({ username: sale.buyer }).select("userColor")
        console.log(request)
        console.log(request.offers)
        console.log(sale.buyer)
        console.log("***************************************")
        let offer = request.offers.find(offer => offer.username === loggedUser)
        let theFix = {
            title: offer.title,
            image_url: offer.image_url,
            price: offer.price,
            seller: loggedUser,
            buyer: sale.buyer,
            delivery_date: sale.delivery_date,
            sellerColor: buyerData.userColor,
            loggedUser,
            hasStarted: sale.hasStarted,
            slug: offer.slug,
            startedAt: sale.startedAt,
            order_id: sale.order_id


        }
        customSales.push(theFix)

    }
    res.render("my-sales-cancelled", { sales: customSales, salesCounts, loggedUser })
})
router.get("/finance", async (req, res) => {
    let revenue = 0;
    let deposit = 0;
    let refund = 0;
    const loggedUser = req.session.passport ? req.session.passport.user : "Betty"

    const revenueData = await RevenueModel.findOne({ username: loggedUser })
    if (revenueData)
        revenue = revenueData.amount

    const depositData = await DepositModel.findOne({ username: loggedUser })
    if (depositData)
        deposit = depositData.amount
    const refundData = await RefundModel.findOne({ username: loggedUser })
    if (refundData)
        refund = refundData.amount



    res.render("finance", {
        revenue, deposit, refund, loggedUser
    })
})

router.get("/finance/transactions", async (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Smith"
    const transactions = await TransactionModel.find({ username: loggedUser })
    transactions.reverse()
    // console.log(transactions)
    res.render("finance-transactions", { transactions, loggedUser })
})


router.get("/finance/notices", async (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Smith"

    const notices = await NoticeModel.find({ username: loggedUser })
    notices.reverse()


    res.render("finance-notices", { notices, loggedUser })
})
router.get("/finance/withdraw", async (req, res) => {
    let revenue = 0;
    const loggedUser = req.session.passport ? req.session.passport.user : "Smith"

    const revenueData = await RevenueModel.findOne({ username: loggedUser })
    if (revenueData)
        revenue = revenueData.amount
    res.render("finance-withdraw", { revenue, loggedUser })
})

router.get("/:slug", async (req, res) => {
    const slug = req.params.slug
    const loggedUser = req.session.passport ? req.session.passport.user : "Smith"
    const fixes = await FixModel.find({ username: loggedUser }).select("title titleSlug images_url")
    const requestData = await RequestModel.findOne({ slug })
    // console.log(requestData)
    res.render("request", { title: "title", request: requestData, loggedUser, fixes })
})
module.exports = router




const express = require("express")
const mongoose = require("mongoose")
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server)
const axios = require("axios").default

require("dotenv").config()



const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const initialize = require("./configuration/passportConfig")


const usersRoute = require("./APIRoutes/users")
const categoriesRoute = require("./APIRoutes/categories")
const pushNoticeRoute = require("./APIRoutes/pushRoutes")
const affiliatesRoute = require("./APIRoutes/affiliates")
const revenuesRoutes = require("./APIRoutes/revenueRoutes")
const refundRoutes = require("./APIRoutes/refundRoutes")
const depositRoutes = require("./APIRoutes/depositRoutes")
const apiDocumentationRoutes = require("./APIRoutes/apiDocumentationRoutes")
const fixRoutes = require("./APIRoutes/fixRoutes")
const requestRoutes = require("./APIRoutes/requestsRoutes")
const salesRoutes = require("./APIRoutes/salesRoutes")
const conversationRoutes = require("./APIRoutes/conversationRoutes")
const RevenueModel = require("./models/revenueModel")
const UserModel = require("./models/usersModel")

const ConversationModel = require("./models/conversationModel")
const DepositModel = require("./models/depositModel")

const RefundModel = require("./models/refundModel")


app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false

}))


initialize(passport, async username => {
    // console.log("The" + user)
    console.log("initialize in server")
    try {
        const theUser = await UserModel.findOne({ username: username })
        // console.log(theUser)
        return theUser
    } catch (err) {
        throw err

    }

},
    async username => {
        try {
            const deUser = await UserModel.findOne({ username })
            // console.log(theUser)
            return deUser
        } catch (err) {
            throw err

        }
    })
app.use(passport.initialize())
app.use(passport.session())



app.use(express.urlencoded({ extended: false }))
app.set("views", "views")
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", 'PUT, POST, DELETE, GET, PATCH')
        return res.status(200).json({})
    }
    next()
})








let users = {}
io.on("connection", socket => {
    console.log("A user connected")

    socket.on("new-user", (user) => {
        console.log("New user: " + user)
        // socket.user = user
        users[user] = socket.id
        console.log(users)
        socket.broadcast.emit("new-user", user)
        io.to(users[user]).emit("online-users", Object.keys(users))

    })

    socket.on("disconnect", (user) => {
        console.log("User disconnected!!")
        delete users[user]
        console.log(users)
    })
    socket.on("typing", function (user) {
        socket.broadcast.emit("typing-status", user)
    })
    socket.on("stopped-typing", function (user) {
        socket.broadcast.emit("stopped-typing", user)
    })

    socket.on("chat", async function (data) {
        // socket.broadcast.emit("chat", data)
        let socketId = users[data.receiver]
        io.to(socketId).emit("chat", { sender: data.sender, message: data.message })
        const record = {
            from: data.sender,
            to: data.receiver,
            message: data.message
        }

        const converse = new ConversationModel(record)
        const newConverse = await converse.save()
        console.log(newConverse)


    })
})






const checkUserAuthenticated = require("./middleware/userIsAuthenticated")
const checkUserNotAuthenticated = require("./middleware/userIsNotauthenticated")


app.get("/chat-app", checkUserAuthenticated, function (req, res) {
    res.render("chat-app")
})

app.get("/", checkUserNotAuthenticated, (req, res) => {
    res.render("index")
})
app.get("/login", checkUserNotAuthenticated, (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/dashboard", checkUserAuthenticated, (req, res) => {
    console.log(`From dashboard: ${req.user}`)
    res.render("dashboard")
})

app.get("/dashboard/affiliate", checkUserAuthenticated, (req, res) => {
    res.render("affiliate")
})
let domain = "https://fixlancer.herokuapp.com"
// domain = "http://localhost:3000"
app.get("/dashboard/inbox", async (req, res) => {
    let recipient = req.query.with;
    let loggedUser;
    // console.log("1 Got here")
    if (!req.session.passport) { loggedUser = "Smith" }
    else { loggedUser = req.session.passport.user }
    if (recipient) {
        // console.log("2 Got here")
        let chats = await axios.get(`${domain}/api/chats/${loggedUser}?with=${recipient}`)
        // console.log("3 Got here")
        chats = chats.data.data
        console.log(chats)
        res.render("chat-detailed", { chats, loggedUser })
        return
    }

    const resp = await axios.get(`${domain}/api/chats/${loggedUser}`)

    const conversations = resp.data.data
    // res.render("chats", {
    //     theConversations: conversations, loggedUser

    // })
    let users = conversations.map(user => { return [user.to, user.from] }).map(pair => {
        if (pair[0] !== loggedUser) {
            return pair[0]
        }
        return pair[1]
    })

    let theConversations = [];
    console.log(users)
    users = [...new Set(users)]
    // console.log(users)

    await users.forEach(async user => {
        let data = await ConversationModel.find().or([{ from: user }, { to: user }])

        theConversations.push(data.slice(-1)[0])
        if (users.slice(-1)[0] === user) {
            // console.log(theConversations)
            theConversations = theConversations.reverse()
            res.render("chats", { theConversations, loggedUser })
            return

        }


    })

})

app.get("/alert", (req, res) => {
    res.render("alert")
})

app.get("/dashboard/create-a-fix", (req, res) => {
    res.render("create-fix")
})

app.get("/dashboard/profile/edit", checkUserAuthenticated, (req, res) => {
    res.render("edit")
})

app.get("/dashboard/post-job-request", checkUserAuthenticated, (req, res) => {
    res.render("post-request")
})

app.get("/dashboard/profile", checkUserAuthenticated, (req, res) => {
    res.render("profile")
})

app.get("/dashboard/my-orders", checkUserAuthenticated, (req, res) => {
    res.render("my-orders-ongoing")
})
app.get("/dashboard/my-orders/completed", checkUserAuthenticated, (req, res) => {
    res.render("my-orders-completed")
})
app.get("/dashboard/my-orders/cancelled", checkUserAuthenticated, (req, res) => {
    res.render("my-orders-cancelled")
})
app.get("/dashboard/my-orders/delivered", checkUserAuthenticated, (req, res) => {
    res.render("my-orders-delivered")
})


app.get("/dashboard/my-sales/delivered", checkUserAuthenticated, (req, res) => {
    res.render("my-sales-delivered")
})

app.get("/dashboard/my-sales/", checkUserAuthenticated, (req, res) => {
    res.render("my-sales-ongoing")
})
app.get("/dashboard/my-sales/completed", checkUserAuthenticated, (req, res) => {
    res.render("my-sales-completed")
})

app.get("/dashboard/my-sales/cancelled", checkUserAuthenticated, (req, res) => {
    res.render("my-sales-cancelled")
})


app.get("/dashboard/finance", async (req, res) => {
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

app.get("/dashboard/finance/withdraw", async (req, res) => {
    let revenue = 0;
    const user = req.session.passport ? req.session.passport.user : undefined

    const revenueData = await RevenueModel.findOne({ username: user })
    if (revenueData)
        revenue = revenueData.amount
    res.render("finance-withdraw", { revenue })
})

app.get("/dashboard/finance/transactions", async (req, res) => {

    res.render("finance-w", { revenue })
})
app.get("/dashboard/finance/notices", checkUserAuthenticated, (req, res) => {
    res.render("finance-notices")
})

app.get("/dashboard/my-requests", checkUserAuthenticated, (req, res) => {
    const notice = req.query.notice
    console.log(notice)
    res.render("my-requests", { notice })
})
app.get("/dashboard/edit", checkUserAuthenticated, (req, res) => {
    res.render("edit")
})

app.get("/how-it-works", (req, res) => {
    res.render("how-it-works")
})
app.get("/profile", checkUserAuthenticated, (req, res) => {
    res.redirect(`/${req.session.passport.user}`)
})
app.get("/log-out", checkUserAuthenticated, (req, res) => {
    req.logOut()
    res.redirect("/")
})

const FixModel = require("./models/fixesModel")

app.get("/fix/:subcat/:titleSlug", async (req, res) => {
    const fix = await FixModel.findOne({ titleSlug: req.params.titleSlug })
    const userFixes = await FixModel.find({ username: fix.username })
    const recommendations = await FixModel.find({ category: fix.category }).limit(6)
    const resp = await axios.get(`https://fixlancer.herokuapp.com/api/users/${fix.username}`)
    const user = resp.data.data

    // console.log(user)
    // console.log(fix)
    // console.log(userFixes)
    const sessionPassport = req.session.passport
    let loggedInUser;
    if (sessionPassport) {
        loggedInUser = sessionPassport.user
    }


    res.render("fix-detailed", { fix, user, userFixes, recommendations, loggedInUser })
})


app.get("/order-fix/:titleSlug", async function (req, res) {
    const fix = await FixModel.findOne({ titleSlug: req.params.titleSlug })
    let balance = 0;
    let refundAmount = 0;
    console.log(balance)
    if (req.session.passport) {

        const revenue = await RevenueModel.findOne({ username: req.session.passport.user })
        if (revenue) {
            balance += revenue.amount
            console.log(balance)
        }


        const deposit = await DepositModel.findOne({ username: req.session.passport.user })
        if (deposit) {
            balance += deposit.amount
            console.log(balance)
        }

        const refund = await RefundModel.findOne({ username: req.session.passport.user })
        if (refund) {
            refundAmount = refund.amount
            balance += refundAmount
            console.log(balance)
        }

    }

    let total = fix.price - balance

    let fee = fix.price - refundAmount > 0 ? 0.05 * (fix.price - refundAmount) : 0
    total += fee
    if (total < 0) total = fix.price + fee


    // console.log(fix)
    res.render("order-fix", { fix, balance, total, fee })

})
app.get("/:username", checkUserAuthenticated, (req, res) => {
    res.render("profile")
})






app.use("/uploads", express.static("uploads"))


// app.use(apiDocumentationRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/users", usersRoute)
app.use("/api/categories", categoriesRoute)
app.use("/api/push-notice", pushNoticeRoute)
app.use("/api/affiliates", affiliatesRoute)
app.use("/api/fixes", fixRoutes)
app.use("/api/sales", salesRoutes)
app.use("/api/chats", conversationRoutes)
app.use("/api/revenues", revenuesRoutes)
app.use("/api/deposits", depositRoutes)
app.use("/api/refunds", refundRoutes)
// conversationRoutes






const PORT = process.env.PORT || 3000
server.listen(PORT, function () {
    console.log("Now listening to port " + PORT)
})
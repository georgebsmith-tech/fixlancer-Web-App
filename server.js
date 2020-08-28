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
function changeMessageToRead(data, io) {
    ConversationModel.find({ read: false, from: data.receiver, to: data.name })
        .then(data => {
            data.forEach(async chat => {
                let readData = await ConversationModel.findOneAndUpdate({ _id: chat._id }, { read: true }, { new: true })

                // console.log(readData)
            })
            // console.log(data)
        })
    io.to(users[data.receiver]).emit("message-read", { read: true })
}


io.on("connection", socket => {
    console.log("A user connected")


    socket.on("new-user", (data) => {
        console.log("New user: " + data.name)
        users[data.name] = socket.id
        changeMessageToRead(data, io)
        console.log(users)
        socket.broadcast.emit("new-user", data.name)
        io.to(users[data.name]).emit("online-users", Object.keys(users))

    })

    socket.on("disconnect", (msg) => {
        console.log("User disconnected!!")
        console.log("Lolzzz" + msg)
        let usernames = Object.keys(users)
        console.log(usernames)
        console.log(users)
        console.log(socket.id)
        for (let x = 0; x < usernames.length; x++) {
            if (users[usernames[x]] === socket.id) {
                delete users[usernames[x]]
                break
            }
        }
        // cons
        // delete users[user]
        console.log(users)
    })
    socket.on("typing", function (data) {
        // socket.broadcast.emit("typing-status", user)
        io.to(users[data.receiver]).emit("typing-status", data.name)
    })
    socket.on("stopped-typing", function (user) {
        socket.broadcast.emit("stopped-typing", user)
    })

    socket.on("chat", async function (data) {

        if (Object.keys(users).find(username => { return username === data.receiver })) {
            let socketId = users[data.receiver]
            io.to(socketId).emit("chat", { sender: data.sender, message: data.message })
            io.to(users[data.sender]).emit("message-sent", { status: "seen" })

        } else {
            io.to(users[data.sender]).emit("message-sent", { status: "sent" })
        }
        const record = {
            from: data.sender,
            to: data.receiver,
            message: data.message,
            read: false
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
        const userColorData = await UserModel.findOne({ username: recipient }).select("userColor")
        console.log(userColorData.userColor)
        let chats = await axios.get(`${domain}/api/chats/${loggedUser}?with=${recipient}`)
        chats = chats.data.data
        res.render("chat-detailed", { chats, loggedUser, recipient, userColorData })
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
    // console.log(users)
    users = [...new Set(users)]
    // console.log(users)


    await users.forEach(async (user, index) => {
        let data = await ConversationModel.find().or([{ from: user, to: loggedUser }, { to: user, from: loggedUser }])

        theConversations.push(data.slice(-1)[0])
        if (index * 1 === users.length - 1) {
            theConversations = theConversations.reverse()
            // console.log(`The converse:${theConversations}`)
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
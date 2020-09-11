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

//Routes
const usersRoute = require("./APIRoutes/users")
const noticesRoute = require("./APIRoutes/noticesRoutes")
const categoriesRoute = require("./APIRoutes/categories")
const pushNoticeRoute = require("./APIRoutes/pushRoutes")
const transactionRoutes = require("./APIRoutes/transactionRoutes")
const affiliatesRoute = require("./APIRoutes/affiliates")
const revenuesRoutes = require("./APIRoutes/revenueRoutes")
const refundRoutes = require("./APIRoutes/refundRoutes")
const depositRoutes = require("./APIRoutes/depositRoutes")
const apiDocumentationRoutes = require("./APIRoutes/apiDocumentationRoutes")
const fixRoutes = require("./APIRoutes/fixRoutes")
const requestRoutes = require("./APIRoutes/requestsRoutes")
const salesRoutes = require("./APIRoutes/salesRoutes")
const conversationRoutes = require("./APIRoutes/conversationRoutes")
const RevenueModel = require("./models/RevenueModel")
const UserModel = require("./models/UserModel")

const ConversationModel = require("./models/ConversationModel")
const DepositModel = require("./models/DepositModel")

const RefundModel = require("./models/RefundModel")
const RequestModel = require("./models/RequestsModel")


app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false

}))


initialize(passport, async username => {
    try {
        const theUser = await UserModel.findOne({ username: username })
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

// ConversationModel.find({ from: "Smith" })
//     .then(data => {
//         console.log("Notthing!!!")
//         console.log(data)
//         data.forEach(async chat => {
//             console.log(chat)
//             let newData = await ConversationModel.findOneAndUpdate({ _id: chat._id }, { read: true }, { new: true })
//             console.log(newData)
//         })


//     })



let users = {}
let activeChats = {}
function changeMessageToRead(data, io) {
    ConversationModel.find({ read: false, from: data.receiver, to: data.name })
        .then(data => {
            data.forEach(async chat => {
                let readData = await ConversationModel.findOneAndUpdate({ _id: chat._id }, { read: true }, { new: true })
            })

        })
    io.to(users[data.receiver]).emit("message-read", { read: true })
}
function changeUserStatus(socket, user) {
    socket.broadcast.emit("user-online", user)
}


io.on("connection", socket => {
    console.log("A user connected")

    socket.on("chat-active", function (data) {
        console.log(`Active user: ${data.user}`)
        console.log(`Before Active chats:`)
        console.log(activeChats)
        if (data.active)
            activeChats[data.user] = data.receiver
        else {
            delete activeChats[data.user]

        }
        console.log(`After Active chats:`)
        console.log(activeChats)
    })


    socket.on("new-user", (data) => {
        // console.log("New user: " + data.name)
        users[data.name] = socket.id
        changeMessageToRead(data, io)
        changeUserStatus(socket, data.name)
        console.log(users)
        socket.broadcast.emit("new-user", data.name)
        io.to(users[data.name]).emit("online-users", Object.keys(users))

    })

    socket.on("user-offline", function (user) {
        socket.broadcast.emit("user-offline", user)
    })
    socket.on("user-online", function (user) {
        changeUserStatus(socket, user)
    })

    socket.on("disconnect", (msg) => {
        console.log("User disconnected!!")
        let usernames = Object.keys(users)
        for (let x = 0; x < usernames.length; x++) {
            if (users[usernames[x]] === socket.id) {
                delete users[usernames[x]]
                break
            }
        }
        console.log(users)
    })
    socket.on("typing", function (data) {
        io.to(users[data.receiver]).emit("typing-status", data.name)
    })
    socket.on("stopped-typing", function (user) {
        socket.broadcast.emit("stopped-typing", user)
    })

    socket.on("chat", async function (data) {
        let read;
        let socketId = users[data.receiver]
        io.to(socketId).emit("chat", { sender: data.sender, message: data.message })
        if (activeChats[data.receiver] === data.sender) {
            io.to(users[data.sender]).emit("message-sent", { status: "seen" })
            read = true
        } else {
            io.to(users[data.sender]).emit("message-sent", { status: "sent" })
            read = false
        }
        const record = {
            from: data.sender,
            to: data.receiver,
            message: data.message,
            read
        }
        console.log(record)

        const converse = new ConversationModel(record)
        const newConverse = await converse.save()
        // console.log(newConverse)


    })
})






const checkUserAuthenticated = require("./middleware/userIsAuthenticated")
const checkUserNotAuthenticated = require("./middleware/userIsNotauthenticated")


app.get("/chat-app", checkUserAuthenticated, function (req, res) {
    res.render("chat-app")
})
app.get("/home", function (req, res) {
    res.render("home")
})
app.get("/section/:catSlug", async function (req, res) {
    const catSlug = req.params.catSlug
    const cat = await CategoriesModel.findOne({ catSlug }).select("name subcat")
    const fixes = await FixModel.find({ category: cat.name })
    // console.log(catName)
    const pages = Math.ceil(fixes.length / 4)
    console.log(fixes)
    console.log(cat.subcat)
    res.render("fix-category", { fixes, pages, subcat: cat.subcat, category: cat.name })
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

    let user = req.session.passport.user

    UserModel.findOneAndUpdate({ username: user }, { online: true }, { new: true })
        .then(data => {
            console.log(data)

        })
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
            console.log(ago)
        } else if ((timeElapse - 5) > 60) {
            console.log(timeElapse - 5)
            theTime = parseInt((timeElapse - 6) / (60));
            ago = `${theTime}h`
            console.log(ago)
        } else {
            console.log(timeElapse - 5)
            ago = `${parseInt(timeElapse - 5)}m`
            console.log(ago)
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
        console.log(deConversation)
        if (index * 1 === users.length - 1) {
            theConversations = theConversations.reverse()

            res.render("chats", { theConversations, loggedUser })
            return
        }
    })
})
const CategoriesModel = require("./models/CategoryModel")

app.get("/alert", (req, res) => {
    res.render("alert")
})
app.get("/search-fix", async (req, res) => {
    let term;
    let pageSize = 4
    let searchQuery = req.query.term
    let rawTerms = searchQuery.split(" ")
    let page = req.query.pg * 1
    let skip = (page - 1) * pageSize
    if (rawTerms.length === 1) {
        term = new RegExp(rawTerms[0], "i")
    } else {
        let form = `(${rawTerms[0]})`
        for (let item of rawTerms) {
            form += `|(${item})`
        }
        term = new RegExp(form, "i")

    }

    let count = await FixModel.find().or([{ title: term }, { description: term }, { tags: term }]).countDocuments()
    let pages = Math.ceil(count / pageSize)
    console.log(count)
    console.log(pages)


    let categories = await CategoriesModel.find()
    console.log(categories)
    const fixes = await FixModel.find().or([{ title: term }, { description: term }, { tags: term }]).skip(skip).limit(pageSize)
    // console.log(fixes)
    res.render("search-fix", { fixes, pages, rawTerm: searchQuery, categories, count })
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
    const user = req.session.passport ? req.session.passport.user : "Smith"

    const revenueData = await RevenueModel.findOne({ username: user })
    if (revenueData)
        revenue = revenueData.amount
    res.render("finance-withdraw", { revenue })
})

app.get("/dashboard/finance/transactions", async (req, res) => {

    res.render("finance-w", { revenue })
})

const NoticeModel = require("./models/NoticeModel")
app.get("/dashboard/finance/notices", async (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : "Smith"

    const notices = await NoticeModel.find({ username: loggedUser })
    notices.reverse()


    res.render("finance-notices", { notices })
})

app.get("/dashboard/my-requests", (req, res) => {
    const notice = req.query.notice
    console.log(notice)
    res.render("my-requests", { notice })
})

app.get("/dashboard/job-requests", async (req, res) => {
    const requests = await RequestModel.find({ approved: true })
    const loggedUser = req.session.passport ? req.session.passport.user : "Smith"
    requests.reverse()

    // console.log(requests)

    res.render("all-requests", { requests, loggedUser })
})

app.get("/dashboard/:slug", async (req, res) => {
    const slug = req.params.slug
    const loggedUser = req.session.passport ? req.session.passport.user : "Smith"
    const fixes = await FixModel.find({ username: loggedUser }).select("title titleSlug images_url")
    const requestData = await RequestModel.findOne({ slug })
    // console.log(requestData)
    res.render("request", { title: "title", request: requestData, loggedUser, fixes })
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
    let user = req.session.passport.user
    let date = new Date()
    UserModel.findOneAndUpdate({ username: user }, { online: false, last_seen: date }, { new: true })
        .then(data => {
            console.log(data)

        })
    console.log("leaving!!!!!!!!!!!")
    req.logOut()
    res.redirect("/")
})

const FixModel = require("./models/FixesModel")

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
    const jobId = req.query.job_id
    const titleSlug = req.params.titleSlug
    let fix;
    let offer
    let custom = false;
    if (jobId) {

        const data = await RequestModel.findOne({ job_id: jobId })

        console.log(data)
        offer = data.offers.find(offer => offer.slug === titleSlug)
        console.log(offer)
        fix = offer
        fix.images_url = [offer.image_url]
        fix.delivery_days = offer.delivery
        fix.mainSlug = data.slug
        custom = true





    } else
        fix = await FixModel.findOne({ titleSlug: titleSlug })
    let balance = 0;
    let refundAmount = 0;
    console.log(balance)
    if (req.session.passport) {

        const revenue = await RevenueModel.findOne({ username: req.session.passport.user })
        if (revenue) {
            balance += revenue.amount
            // console.log(balance)
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
            // console.log(balance)
        }

    }

    let total = fix.price - balance

    let fee = fix.price - refundAmount > 0 ? 0.05 * (fix.price - refundAmount) : 0
    total += fee
    if (total < 0) total = fix.price + fee


    // console.log(fix)
    res.render("order-fix", { fix, balance, total, fee, custom, jobId })

})



app.get("/:username", checkUserAuthenticated, (req, res) => {
    res.render("profile")
})






app.use("/uploads", express.static("uploads"))


app.use("/api/notices", noticesRoute)


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
app.use("/api/transactions", transactionRoutes)








const PORT = process.env.PORT || 3000
server.listen(PORT, function () {
    console.log("Now listening to port " + PORT)
})
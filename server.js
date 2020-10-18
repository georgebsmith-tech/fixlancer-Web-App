const express = require("express")
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server)
const axios = require("axios").default;
const ejs = require("ejs")





require("dotenv").config()
let domain = "https://fixlancer.herokuapp.com"
// let domain = "http://localhost:5000"
const SalesModel = require("./models/SaleModel")


//EJS helper functions

const getDate = (date) => {
    if (!date)
        return "N/A"
    let months = ["Jan", "Feb", "Mar", "Apr", "MAy", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let newDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    return newDate
}
app.locals.getDate = (date) => {
    return getDate(date)

}

app.locals.getDateAndTime = (date) => {
    let hr;
    if (date.getHours() === 0)
        hr = 12
    else if (date.getHours() >= 13)
        hr = date.getHours() - 12
    else
        hr = date.getHours()

    // let hr = date.getHours() >= 13 ? date.getHours() - 12 : date.getHours()
    let period = date.getHours() >= 12 ? "pm" : "am"
    return getDate(date) + ` ${hr}:${date.getMinutes()}${period}`
}
app.locals.renderSalesAndOrderDesktop = (order, kind = "sale") => {
    let href;
    if (kind === "sale") {
        href = `/dashboard/order-chat?oid=${order.order_id}`
    } else if (order.hasStarted) {
        href = `/dashboard/order-chat?oid=${order.order_id}`
    } else {
        href = `/dashboard/order-requirements?fixid=${order.slug}&oid=${order.order_id}`
    }

    return `<div class="font14 grid-table padd20-top padd10-bottom border-bottom padd10-sides">
    <div class="flex"><span class="user-avatar"
            data-color="${order.sellerColor}">${order.seller[0].toUpperCase()}</span>${order.seller === order.loggedUser ? order.buyer : order.seller}
    </div>
    <div class="flex">
        <a href="${href}" class="flex"
            style="width: 40px;height: 30px;overflow: hidden;margin-right: 10px;"><img
                src="${order.image_url}"  alt="image of the fix: ${order.title.substr(0, 50) + '...'}">
        </a>

        <a href="${href}" class=" text-orange hover-underline">${order.title}</a>
    </div>
    <div class="flex">${getDate(order.startedAt)}</div>
    <div class="flex"> ₦${order.price}</div>
</div>
    `
}

app.locals.renderSalesAndOrderMobile = (order, kind = "sale") => {
    let href;
    if (kind === "sale") {
        href = `/dashboard/order-chat?oid=${order.order_id}`
    } else if (order.hasStarted) {
        href = `/dashboard/order-chat?oid=${order.order_id}`
    } else {
        href = `/dashboard/order-requirements?fixid=${order.slug}&oid=${order.order_id}`
    }
    return `<section>
    <div class="d-order-and-sale bg-white padd20">
        <div class="grid2-1-6">

            <div class="fix-image-wrapper padd10" style="height:90px;">
            <a href="${href}">
                <img src="${order.image_url}" alt="image of the fix: ${order.title.substr(0, 50) + '...'}">
            </a>
            </div>

            <div class="padd10-top">
                <header class="margin10-bottom">
                    <a href="${href}"
                        class="font14 text-orange line-height hover-underline">${order.title.length > 32 ? order.title.substr(0, 32) + '...' : order.title}</a>
                </header>
                 <div>
                    <a href="#"><i class="fas fa-circle font11"> </i> <span
                            class="font13">${order.seller === order.loggedUser ? order.buyer : order.seller}</span>
                    </a>
                 </div>
                 <div class="delivery-and-star flex-between margin10-top">
                    <div class="date">
                        <i class="fa fa-calendar font12" aria-hidden="true"></i>
                        
                            ${getDate(order.startedAt)}</span>
                        <span class=
                        "hide">
                            <i class="fa fa-star font16"></i><span class="font16"> 5
                            </span>
                        </span>
                    </div>
                <div class="text-green font16">
                    ₦${order.price}
                </div>
        </div>

            </div>
        </div>
        
    </div>
    <div class="divider"></div>
</section>
    `
}
function commafy(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


app.locals.featured = (fix) => {
    let ratings = fix.ratings

    // console.log(ratings)
    let sum_of_ratings = 0;

    let average_rating = 0
    let number_of_ratings = ratings.length
    if (number_of_ratings !== 0) {

        ratings.forEach(rating => {
            sum_of_ratings += rating * 1
        })
        average_rating = (sum_of_ratings / number_of_ratings).toFixed(1)
    }
    return `<div class="a-recommendation">
    <div class="recommended-fix-top">
    <div class="recommended-image-wrapper">
        <a href="/fix/${fix.subcatSlug}/${fix.titleSlug}">
        <img src="${fix.images_url[0]}"
            alt="">
        </a>
    </div>
    <div>
        <div class="recoomended-username-desktop">
            <i class="fa fa-circle"></i>
            <small>${fix.username}</small>
        </div>
        <a href="/fix/${fix.subcatSlug}/${fix.titleSlug}" class="block">
        <p class="recommended-fix-title" style="height:55px;">${fix.title.substr(0, 34)}...
        </p>
        </a>
        <small class="duration-and-rating-trust">
            <span>
                <i class="fas fa-clock"></i> <span>${fix.delivery_days} day(s)</span>
            </span>
            <span class="trust hide">
                <i class="fa fa-check orange"></i>
                <span class="orange">Trusted</span>
            </span>
            <span class="fix-rating ${average_rating === 0 ? "hide" : ""}">
                <i class="fa fa-star"></i>
                <span>${average_rating} (${number_of_ratings})</span>
            </span>
        </small>
    </div>
</div>
<div class="amount-and-alter">
    <div class="recommended-mobile">
        <div>
            <i class="fa fa-circle"></i>
            <small>${fix.username}</small>
        </div>
        <div class="fix-amount-green">
            ₦${commafy(fix.price)}
        </div>
    </div>
    <div class="recommended-desktop">
        <div>
            <i class="fa fa-check orange"></i>
            <small class="orange">Trusted</small>
        </div>
        <div class="fix-amount-green">
        ₦${fix.price}
        </div>
    </div>
</div>
</div>`
}

const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const initialize = require("./configuration/passportConfig")

//Routes imports
const requirementsRoutes = require("./APIRoutes/requirementsRoutes")
const dashboardRoutes = require("./pagesRoutes/dashboardRoutes")
const usersRoute = require("./APIRoutes/users")
const orderChatsRoutes = require("./APIRoutes/orderChatRoutes")
const noticesRoute = require("./APIRoutes/noticesRoutes")
const categoriesRoute = require("./APIRoutes/categories")
const pushNoticeRoute = require("./APIRoutes/pushRoutes")
const transactionRoutes = require("./APIRoutes/transactionRoutes")
const affiliatesRoute = require("./APIRoutes/affiliates")
const revenuesRoutes = require("./APIRoutes/revenueRoutes")
const refundRoutes = require("./APIRoutes/refundRoutes")
const depositRoutes = require("./APIRoutes/depositRoutes")
const fixRoutes = require("./APIRoutes/fixRoutes")
const requestRoutes = require("./APIRoutes/requestsRoutes")
const salesRoutes = require("./APIRoutes/salesRoutes")
const conversationRoutes = require("./APIRoutes/conversationRoutes")

const milestoneRoutes = require("./APIRoutes/milestoneRoutes")



const RevenueModel = require("./models/RevenuesModel")
const UserModel = require("./models/UserModel")

const ConversationModel = require("./models/ConversationsModel")
const DepositModel = require("./models/DepositsModel")
const FixModel = require("./models/FixModel");

const RefundModel = require("./models/RefundsModel")
const RequestModel = require("./models/RequestModel")
const OrderChatModel = require("./models/OrderChatModel")


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




let users = {}
let userChatUsers = {}
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


    socket.on("chat-active", function (data) {

        if (data.active)
            activeChats[data.user] = data.receiver
        else {
            delete activeChats[data.user]

        }

    })


    socket.on("new-user", (data) => {
        // console.log("New user: " + data.name)
        users[data.name] = socket.id
        changeMessageToRead(data, io)
        changeUserStatus(socket, data.name)
        // console.log(users)
        socket.broadcast.emit("new-user", data.name)
        io.to(users[data.name]).emit("online-users", Object.keys(users))

    })

    socket.on("order-new-user", (data) => {
        // console.log("New user: " + data.name)
        console.log(data)
        userChatUsers[data.sender] = socket.id
        // changeMessageToRead(data, io)
        // changeUserStatus(socket, data.name)
        // // console.log(users)
        // socket.broadcast.emit("new-user", data.name)
        // io.to(users[data.name]).emit("online-users", Object.keys(users))

    })

    socket.on("user-offline", function (user) {
        socket.broadcast.emit("user-offline", user)
    })
    socket.on("user-online", function (user) {
        changeUserStatus(socket, user)
    })

    socket.on("disconnect", (msg) => {

        let usernames = Object.keys(users)
        for (let x = 0; x < usernames.length; x++) {
            if (users[usernames[x]] === socket.id) {
                delete users[usernames[x]]
                break
            }
        }
    })

    //order chat
    socket.on("order-typing", function (data) {

        console.log(userChatUsers)
        io.to(userChatUsers[data.receiver]).emit("order-typing-status", data.sender)
    })
    //inbox
    socket.on("typing", function (data) {
        io.to(users[data.receiver]).emit("typing-status", data.name)
    })
    socket.on("stopped-typing", function (user) {
        socket.broadcast.emit("stopped-typing", user)
    })

    //order
    socket.on("order-stopped-typing", function (user) {
        socket.broadcast.emit("order-stopped-typing", user)
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
        // console.log(record)

        const converse = new ConversationModel(record)
        const newConverse = await converse.save()
        // console.log(newConverse)


    })

    //order
    socket.on("order-chat", async function (data) {
        let read;
        let socketId = users[data.receiver]
        io.to(socketId).emit("order-chat", { sender: data.sender, message: data.message })

        if (activeChats[data.receiver] === data.sender) {
            io.to(users[data.sender]).emit("order-message-sent", { status: "seen" })
            read = true
        } else {
            io.to(users[data.sender]).emit("order-message-sent", { status: "sent" })
            read = false
        }
        const record = {
            order_id: data.orderID,
            from: data.sender,
            to: data.receiver,
            message: data.message,
            read
        }
        if (data.type === "dispute") {
            record.type = data.type
            record.content = {
                resolved: false
            }
        }
        const sale = await SalesModel.findOneAndUpdate({ order_id: data.orderID }, { dispute: true }, { new: true })
        console.log(record)


        const ordercahat = new OrderChatModel(record)
        const newOrderChat = await ordercahat.save()
        console.log(newOrderChat)


    })
})


const checkUserAuthenticated = require("./middleware/userIsAuthenticated");
const checkUserNotAuthenticated = require("./middleware/userIsNotauthenticated");
//th
// dashboard route
app.use("/dashboard", dashboardRoutes)

app.get("/u/:username", async (req, res) => {
    const user = req.params.username
    const loggedUser = req.session.passport ? req.session.passport.user : undefined;

    const userData = await UserModel.findOne({ username: user })
    const context = {
        userData,
        loggedUser
    }
    res.render("profile", context)
})



app.get("/reset-password", (req, res) => {
    res.render("reset-password")
})

app.get("/reset-success", (req, res) => {
    res.render("reset-success")
})


app.get("/section/:catSlug", async function (req, res) {
    const catSlug = req.params.catSlug
    const loggedUser = req.session.passport ? req.session.passport.user : undefined
    const cat = await CategoriesModel.findOne({ catSlug }).select("name subcat")
    const fixes = await FixModel.find({ category: cat.name })
    // console.log(catName)
    const pages = Math.ceil(fixes.length / 4)
    // console.log(fixes)
    // console.log(cat.subcat)

    const context = { fixes, pages, subcat: cat.subcat, category: cat.name, loggedUser }
    res.render("fix-category", context)
})

app.get("/", async (req, res) => {
    const categories = await CategoriesModel.find({}).select("name catSlug")

    const resp = await axios.get(`${domain}/api/fixes?state=random&count=18`)
    const resp2 = await axios.get(`${domain}/api/fixes?state=random&count=10`)
    let featuredFixes = resp2.data
    const recommendedations = resp.data
    const context = {
        categories,
        recommendedations,
        featuredFixes
    }
    res.render("index-new", context)
})
app.get("/login", checkUserNotAuthenticated, (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})




const CategoriesModel = require("./models/CategoriesModel")

app.get("/alert", (req, res) => {
    res.render("alert")
})
app.get("/search-fix", async (req, res) => {
    const loggedUser = req.session.passport ? req.session.passport.user : undefined

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
    // console.log(count)
    // console.log(pages)


    let categories = await CategoriesModel.find()
    // console.log(categories)
    const fixes = await FixModel.find().or([{ title: term }, { description: term }, { tags: term }]).skip(skip).limit(pageSize)
    // console.log(fixes)
    res.render("search-fix", { fixes, pages, rawTerm: searchQuery, categories, count, loggedUser })
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


        })

    req.logOut()
    res.redirect("/")
})



app.get("/fix/:subcat/:titleSlug", async (req, res) => {
    const fix = await FixModel.findOne({ titleSlug: req.params.titleSlug })
    const userFixes = await FixModel.find({ username: fix.username })
    const recommendations = await FixModel.find({ category: fix.category }).limit(6)
    const resp = await axios.get(`https://fixlancer.herokuapp.com/api/users/${fix.username}`)
    const user = resp.data.data
    const sessionPassport = req.session.passport
    let loggedUser;
    if (sessionPassport) {
        loggedUser = sessionPassport.user
    }


    res.render("fix-detailed", { fix, user, userFixes, recommendations, loggedUser })
})


const renderOrderFix = require("./pagesRoutes/renderOrderFix")

app.get("/order-fix/:titleSlug", renderOrderFix)





app.get("/:username", checkUserAuthenticated, (req, res) => {
    res.render("profile")
})






app.use("/uploads", express.static("uploads"))




//API routes
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
app.use("/api/orderChats", orderChatsRoutes)
app.use("/api/requirements", requirementsRoutes)
app.use("/api/milestones", milestoneRoutes)





const PORT = process.env.PORT || 5000
server.listen(PORT, function () {
    console.log("Now listening to port " + PORT)
})
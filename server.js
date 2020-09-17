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
app.locals.renderSalesAndOrderDesktop = (order) => {

    return `<div class="font14 grid-table padd20-top padd10-bottom border-bottom padd10-sides">
    <div class="flex"><span class="user-avatar"
            data-color="${order.sellerColor}">${order.seller[0].toUpperCase()}</span>${order.seller === order.loggedUser ? order.buyer : order.seller}
    </div>
    <div class="flex">
        <a href="#" class="flex"
            style="width: 40px;height: 30px;overflow: hidden;margin-right: 10px;"><img
                src="${order.image_url}" alt="" ">
        </a>

        <a href=" #" class=" text-orange hover-underline">${order.title}</a>
    </div>
    <div class="flex">${order.delivery_date.toDateString()}</div>
    <div class="flex"> ₦${order.price}</div>
</div>
    `
}

app.locals.renderSalesAndOrderMobile = (order) => {

    return `<section>
    <div class="d-order-and-sale bg-white padd20">
        <div class="grid2-1-6">

            <div class="fix-image-wrapper padd10" style="height:90px;">
                <img src="${order.image_url}" alt="">
            </div>

            <div class="padd10-top">
                <header class="margin10-bottom">
                    <a href="#"
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
                        
                            ${order.delivery_date.toDateString()}</span>
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
        <p class="recommended-fix-title" style="height:55px;">${fix.title.substr(0, 45)}...
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
const dashboardRoutes = require("./pagesRoutes/dashboardRoutes")
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
const RevenueModel = require("./models/RevenuesModel")
const UserModel = require("./models/UserModel")

const ConversationModel = require("./models/ConversationsModel")
const DepositModel = require("./models/DepositsModel")
const FixModel = require("./models/FixModel");

const RefundModel = require("./models/RefundsModel")
const RequestModel = require("./models/RequestModel")


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




// let users = {}
// let activeChats = {}
// function changeMessageToRead(data, io) {
//     ConversationModel.find({ read: false, from: data.receiver, to: data.name })
//         .then(data => {
//             data.forEach(async chat => {
//                 let readData = await ConversationModel.findOneAndUpdate({ _id: chat._id }, { read: true }, { new: true })
//             })

//         })
//     io.to(users[data.receiver]).emit("message-read", { read: true })
// }
// function changeUserStatus(socket, user) {
//     socket.broadcast.emit("user-online", user)
// }


// io.on("connection", socket => {


//     socket.on("chat-active", function (data) {

//         if (data.active)
//             activeChats[data.user] = data.receiver
//         else {
//             delete activeChats[data.user]

//         }

//     })


//     socket.on("new-user", (data) => {
//         // console.log("New user: " + data.name)
//         users[data.name] = socket.id
//         changeMessageToRead(data, io)
//         changeUserStatus(socket, data.name)
//         // console.log(users)
//         socket.broadcast.emit("new-user", data.name)
//         io.to(users[data.name]).emit("online-users", Object.keys(users))

//     })

//     socket.on("user-offline", function (user) {
//         socket.broadcast.emit("user-offline", user)
//     })
//     socket.on("user-online", function (user) {
//         changeUserStatus(socket, user)
//     })

//     socket.on("disconnect", (msg) => {

//         let usernames = Object.keys(users)
//         for (let x = 0; x < usernames.length; x++) {
//             if (users[usernames[x]] === socket.id) {
//                 delete users[usernames[x]]
//                 break
//             }
//         }
//     })
//     socket.on("typing", function (data) {
//         io.to(users[data.receiver]).emit("typing-status", data.name)
//     })
//     socket.on("stopped-typing", function (user) {
//         socket.broadcast.emit("stopped-typing", user)
//     })

//     socket.on("chat", async function (data) {
//         let read;
//         let socketId = users[data.receiver]
//         io.to(socketId).emit("chat", { sender: data.sender, message: data.message })
//         if (activeChats[data.receiver] === data.sender) {
//             io.to(users[data.sender]).emit("message-sent", { status: "seen" })
//             read = true
//         } else {
//             io.to(users[data.sender]).emit("message-sent", { status: "sent" })
//             read = false
//         }
//         const record = {
//             from: data.sender,
//             to: data.receiver,
//             message: data.message,
//             read
//         }
//         // console.log(record)

//         const converse = new ConversationModel(record)
//         const newConverse = await converse.save()
//         // console.log(newConverse)


//     })
// })


const checkUserAuthenticated = require("./middleware/userIsAuthenticated");
const checkUserNotAuthenticated = require("./middleware/userIsNotauthenticated");
//th
// dashboard route
app.use("/dashboard", dashboardRoutes)



app.get("/section/:catSlug", async function (req, res) {
    const catSlug = req.params.catSlug
    const cat = await CategoriesModel.findOne({ catSlug }).select("name subcat")
    const fixes = await FixModel.find({ category: cat.name })
    // console.log(catName)
    const pages = Math.ceil(fixes.length / 4)
    // console.log(fixes)
    // console.log(cat.subcat)
    res.render("fix-category", { fixes, pages, subcat: cat.subcat, category: cat.name })
})

app.get("/", async (req, res) => {
    const categories = await CategoriesModel.find({}).select("name catSlug")

    const resp = await axios.get(`${domain}/api/fixes?state=random&count=18`)
    const featuredFixes = resp.data
    const context = {
        categories,
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
    res.render("search-fix", { fixes, pages, rawTerm: searchQuery, categories, count })
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


        offer = data.offers.find(offer => offer.slug === titleSlug)

        fix = offer
        fix.images_url = [offer.image_url]
        fix.delivery_days = offer.delivery
        fix.mainSlug = data.slug
        custom = true

    } else
        fix = await FixModel.findOne({ titleSlug: titleSlug })
    let balance = 0;
    let refundAmount = 0;

    if (req.session.passport) {

        const revenue = await RevenueModel.findOne({ username: req.session.passport.user })
        if (revenue) {
            balance += revenue.amount
            // console.log(balance)
        }


        const deposit = await DepositModel.findOne({ username: req.session.passport.user })
        if (deposit) {
            balance += deposit.amount

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


const PORT = process.env.PORT || 5000
server.listen(PORT, function () {
    console.log("Now listening to port " + PORT)
})
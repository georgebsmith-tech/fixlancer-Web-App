const express = require("express")
const mongoose = require("mongoose")
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server)

require("dotenv").config()



const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const initialize = require("./configuration/passportConfig")


const usersRoute = require("./APIRoutes/users")
const categoriesRoute = require("./APIRoutes/categories")
const pushNoticeRoute = require("./APIRoutes/pushRoutes")
const affiliatesRoute = require("./APIRoutes/affiliates")
const apiDocumentationRoutes = require("./APIRoutes/apiDocumentationRoutes")
const fixRoutes = require("./APIRoutes/fixRoutes")
const requestRoutes = require("./APIRoutes/requestsRoutes")
const salesRoutes = require("./APIRoutes/salesRoutes")
const conversationRoutes = require("./APIRoutes/conversationRoutes")
const UserModel = require("./models/usersModel")

const ConversationModel = require("./models/conversationModel")


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

app.get("/chat-app", checkUserAuthenticated, function (req, res) {
    res.render("chat-app")
})

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/dashboard", checkUserAuthenticated, (req, res) => {
    console.log(`From dashboard: ${req.user}`)
    console.log(req.user)
    console.log(req.session.passport.user)
    res.render("dashboard")
})



app.get("/dashboard/profile/edit", checkUserAuthenticated, (req, res) => {
    res.render("edit")
})

app.get("/dashboard/post-request", checkUserAuthenticated, (req, res) => {
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
app.get("/dashboard/my-orders/cancelled", (req, res) => {
    res.render("my-orders-cancelled")
})
app.get("/dashboard/my-orders/delivered", (req, res) => {
    res.render("my-orders-delivered")
})
app.get("/dashboard/finance", checkUserAuthenticated, (req, res) => {
    res.render("finance")
})

app.get("/dashboard/finance/withdraw", checkUserAuthenticated, (req, res) => {
    res.render("finance-withdraw")
})

app.get("/dashboard/finance/transactions", (req, res) => {
    res.render("finance-withdraw")
})

app.get("/dashboard/my-requests", (req, res) => {
    res.render("my-requests")
})

app.get("/how-it-works", (req, res) => {
    res.render("how-it-works")
})
app.get("/profile", (req, res) => {
    res.redirect(`/${req.session.passport.user}`)
})

app.get("/:username", (req, res) => {
    res.render("profile")
})






app.use("/uploads", express.static("uploads"))


// app.use(apiDocumentationRoutes)
app.use("/api/users", usersRoute)
app.use("/api/categories", categoriesRoute)
app.use("/api/push-notice", pushNoticeRoute)
app.use("/api/affiliates", affiliatesRoute)
app.use("/api/fixes", fixRoutes)
app.use("/api/sales", salesRoutes)
app.use("/api/chats", conversationRoutes)
// conversationRoutes






const PORT = process.env.PORT || 3000
server.listen(PORT, function () {
    console.log("Now listening to port " + PORT)
})
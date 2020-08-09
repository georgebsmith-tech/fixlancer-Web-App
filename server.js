const express = require("express")
const mongoose = require("mongoose")
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server)

const usersRoute = require("./routes/users")
const categoriesRoute = require("./routes/categories")
const pushNoticeRoute = require("./routes/pushRoutes")
const affiliatesRoute = require("./routes/affiliates")
const apiDocumentationRoutes = require("./routes/apiDocumentationRoutes")
const fixRoutes = require("./routes/fixRoutes")
const requestRoutes = require("./routes/requestsRoutes")
const salesRoutes = require("./routes/salesRoutes")
const conversationRoutes = require("./routes/conversationRoutes")

const ConversationModel = require("./models/conversationModel")

app.use(express.urlencoded({ extended: false }))
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






app.use("/uploads", express.static("uploads"))


app.use(apiDocumentationRoutes)
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
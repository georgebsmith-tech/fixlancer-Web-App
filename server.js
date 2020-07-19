const express = require("express")
const mongoose = require("mongoose")
const app = express()

const usersRoute = require("./routes/users")
const categoriesRoute = require("./routes/categories")
const pushNotice = require("./routes/pushRoutes")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/uploads", express.static("uploads"))



app.use("/api/users", usersRoute)
app.use("/api/categories", categoriesRoute)
app.use("/api/push-notice", pushNotice)

const PORT = process.env.port || 3000
app.listen(PORT, function () {
    console.log("Now listening to port " + PORT)
})
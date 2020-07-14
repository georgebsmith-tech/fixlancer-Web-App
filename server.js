const express = require("express")
const mongoose = require("mongoose")
const app = express()

const usersRoute = require("./routes/users")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/uploads", express.static("uploads"))


app.use("/users", usersRoute)

const PORT = process.env.port || 3000
app.listen(PORT, function () {
    console.log("Now listening to port " + PORT)
})
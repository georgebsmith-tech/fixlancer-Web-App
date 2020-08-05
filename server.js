const express = require("express")
const mongoose = require("mongoose")
const app = express()

const usersRoute = require("./routes/users")
const categoriesRoute = require("./routes/categories")
const pushNoticeRoute = require("./routes/pushRoutes")
const affiliatesRoute = require("./routes/affiliates")
const apiDocumentationRoutes = require("./routes/apiDocumentationRoutes")
const fixRoutes = require("./routes/fixRoutes")
const requestRoutes = require("./routes/requestsRoutes")
const salesRoutes = require("./routes/salesRoutes")

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
app.use("/uploads", express.static("uploads"))


app.use(apiDocumentationRoutes)
app.use("/api/users", usersRoute)
app.use("/api/categories", categoriesRoute)
app.use("/api/push-notice", pushNoticeRoute)
app.use("/api/affiliates", affiliatesRoute)
app.use("/api/fixes", fixRoutes)
app.use("/api/sales", salesRoutes)






const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
    console.log("Now listening to port " + PORT)
})
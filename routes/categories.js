const router = require("express").Router()
const CategoryModel = require("../models/categoryModel");

router.post("/", async (req, res) => {
    const newCategory = new CategoryModel(req.body)
    const data = await newCategory.save()
    res.status(200).json({
        message: "Recored added",
        body: data
    })

})

router.get("/", async (req, res) => {
    const data = await CategoryModel.find()
    res.status(200).json({
        data: data
    })

})

router.get("/:category", (req, res) => {
    res.status(200).send("gettingthe category: " + req.params.category)
})

router.post("/:category", (req, res) => {
    res.status(200).send("Posting to the category: " + req.params.category)
})

module.exports = router
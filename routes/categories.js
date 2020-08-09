const router = require("express").Router()
const CategoryModel = require("../models/categoryModel");

router.post("/", async (req, res) => {
    const newCategory = new CategoryModel(req.body)
    const data = await newCategory.save()
    res.status(200).json({
        message: "Recored added",
        data: data
    })

})

router.get("/", async (req, res) => {
    const data = await CategoryModel.find()
    res.status(200).json({
        data: data
    })

})


router.delete("/:id", async (req, res) => {
    const data = await CategoryModel.findByIdAndDelete(req.params.id)
    res.status(200).json({
        data: data,
        status: "Deleted"
    })

})



router.post("/:id", async (req, res) => {

    const category = await CategoryModel.findOne({
        _id: req.params.id
    })
    console.log(category)
    const sub = { name: req.body.name }
    category.subcat.push(sub)
    const data = await category.save()
    res.status(200).send(data)
})
router.get("/:category", async (req, res) => {

    const category = await CategoryModel.findOne({
        name: req.params.category
    })
    res.status(200).send(category)
})

module.exports = router
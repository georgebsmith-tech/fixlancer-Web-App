const router = require("express").Router()
const CategoryModel = require("../models/categoryModel");
const slugify = require("slugify");
slugify.extend({ '#': 'sharp', '+': "plus", "-": "minus", "*": "times", "&": "and", "/": "or" })


router.post("/", async (req, res) => {
    const newCategory = new CategoryModel(req.body)
    const data = await newCategory.save()
    res.status(200).json({
        message: "Recored added",
        data: data
    })

})

router.get("/", async (req, res) => {
    const reqString = req.query

    if (reqString.content === "slim") {
        if (reqString.subcat === "true") {
            const data = await CategoryModel.find().select("name subcat")
            return res.status(200).json({
                data: data
            })
        }
        const data = await CategoryModel.find().select("name prices")
        return res.status(200).json({
            data: data
        })

    }
    const data = await CategoryModel.find()
    return res.status(200).json({
        data: data
    })

})
router.patch("/:id/price", async (req, res) => {
    const data = await CategoryModel.findOne({ _id: req.params.id }).select("prices")
    data.prices.push(req.body.price)
    data.save()
        .then(newrecord => {
            return res.status(200).json(newrecord)
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
    const sub = {
        name: req.body.name,
        slug: slugify(req.body.name,
            {
                lower: true,
                strict: true
            })
    }
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
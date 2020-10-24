const router = require("express").Router()

const multerUpload = require("../configuration/multerConfig")
const path = require("path")



router.get("/:fileName", multerUpload.single("file"), (req, res) => {
    const fileName = req.params.fileName
    res.download(path.join(path.parse(__dirname).dir, "uploads", fileName), fileName, (err) => {
        if (err) {
            res.json(err)
        } else {
            console.log("File downloaded")
        }
    })
})

module.exports = router
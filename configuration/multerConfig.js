const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.parse(__dirname).dir, "uploads"))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


const multerUpload = multer({ storage })

module.exports = multerUpload
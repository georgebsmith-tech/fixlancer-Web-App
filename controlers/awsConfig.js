const multer = require("multer")
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const s3 = new AWS.S3()
const storage = multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "fixlancerwebapp",
    metadata: function (req, file, cb) {
        cb(null, { fieldName: "Fixlancer_Web_App" })
    },
    key: function (req, file, cb) {
        cb(null, new Date().getTime().toString() + file.originalname)
    }
})
const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1025 * 10
    }
})


module.exports = upload
const router = require("express").Router()

const multerUpload = require("../configuration/multerConfig")


const addNewRequiremnts = require("../controlers/requirements/addNewRequirement")
const upload = require("../controlers/awsConfig")

router.post("/", multerUpload.single("file"), addNewRequiremnts)


module.exports = router
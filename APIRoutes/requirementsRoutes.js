const router = require("express").Router()
const RequirementModel = require("../models/RequirementModel")

const addNewRequiremnts = require("../controlers/requirements/addNewRequirement")
const upload = require("../controlers/awsConfig")

router.post("/", upload.single("file"), addNewRequiremnts)


module.exports = router
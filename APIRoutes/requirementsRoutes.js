const router = require("express").Router()
const RequirementModel = require("../models/RequirementModel")

const addNewRequiremnts = require("../controlers/requirements/addNewRequirement")

router.post("/", addNewRequiremnts)


module.exports = router
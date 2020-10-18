const router = require("express").Router()
const getAllMilestones = require("../controlers/milestones/getAllMilestones")
const addAMilestone = require("../controlers/milestones/addAmilestone")





router.get("/", getAllMilestones)
router.post("/", addAMilestone)



module.exports = router
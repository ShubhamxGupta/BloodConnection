const express = require("express");
const router = express.Router();
const {
    registerDonor,
    getAllDonors,
    updateDonor
} = require("../controllers/donorController");

// POST /api/donate/   →  Register donor
router.post("/", registerDonor);

// GET /api/donate/all →  Get all donors
router.get("/all", getAllDonors);

// PUT /api/donate/:id →  Update a donor (optional)
router.put("/:id", updateDonor);

module.exports = router;

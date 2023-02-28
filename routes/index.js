const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Express Index Is Working. " });
})

module.exports = router;
const router = require("express").Router();

router.get("/tree", async (req, res) => {
  res.status(200).json("Woot woot");
})

router.get("/", async (req, res) => {
  res.status(404).send("Tree at /tree");
})

module.exports = router;
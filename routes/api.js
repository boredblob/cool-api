const router = require("express").Router();
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config();

router.get("/tree", async (req, res) => {
  res.status(200).json("Woot woot");
})

router.get("/", async (req, res) => {
  res.status(404).send("Tree at /tree");
})

router.post("/update", async (req, res) => {
  if (verifySignature(req.body, req.get("X-Hub-Signature"))) {
    res.send(200);
  } else {
    res.send(403);
  }  
})

function verifySignature(data, headerSignature) {
  const signature = crypto.createHmac("sha1", process.env.SECRET_TOKEN).update(data).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(headerSignature));
}

module.exports = router;
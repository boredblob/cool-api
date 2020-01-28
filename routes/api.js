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
  const key = req.headers['x-hub-signature'];
  const data = JSON.stringify(req.body);

  if (verifySignature(data, key)) {
    console.log("Accepted");
    res.status(200).send("yeet");
  } else {
    console.log("Denied");
    res.status(403).send("Access forbidden");
  }  
})

function sign(data) {
  const hmac = crypto.createHmac("sha1", process.env.SECRET_TOKEN)
    .update(data)
    .digest("hex");

  return "sha1=" + hmac;
}

function verifySignature(data, key) {
  try {
    const signature = sign(data);
    console.log(signature, key);
    return crypto.timingSafeEqual(Buffer.from(signature, "utf-8"), Buffer.from(key, "utf-8"));
  }
  catch {
    return false;
  }
}

module.exports = router;
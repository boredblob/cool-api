const router = require("express").Router();
const dotenv = require("dotenv");
const crypto = require("crypto");
const fetch = require("node-fetch");
dotenv.config();

let tree = reloadTree().then(t => {tree = t;});

router.get("/tree", async (req, res) => {
  res.status(200).json(tree);
})

router.get("/parsedTree", async (req, res) => {
  res.status(200).json(parseTree(tree));
})

router.get("/", async (req, res) => {
  res.status(404).send("Tree at /tree");
})

router.post("/update", async (req, res) => {
  const key = req.headers['x-hub-signature'];
  const data = JSON.stringify(req.body);

  if (verifySignature(data, key)) {
    console.log("Accepted");
    tree = reloadTree().then(t => {tree = t;});
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
    return crypto.timingSafeEqual(Buffer.from(signature, "utf-8"), Buffer.from(key, "utf-8"));
  }
  catch {
    return false;
  }
}

async function reloadTree() {
  const options = {
    headers: {
      "Authorisation": "token" + process.env.APP_TOKEN
    }
  };
  return new Promise(resolve => {
    fetch("https://api.github.com/repos/omerismyname/random-testing-stuff/commits/master", options)
    .then(response => response.json())
    .then(data => {
      const tree_hash = data.commit.tree.sha;
      if (tree_hash) {
        fetch("https://api.github.com/repos/omerismyname/random-testing-stuff/git/trees/" + tree_hash + "?recursive=1", options)
        .then(response => response.json())
        .then(data => {
          resolve(data.tree);
        });
      } else {
        throw new Error("No tree found");
      }
    })
    .catch(err => console.log("Error fetching data: " + err));
  });
}

function parseTree(tree) {
  const treeArray = [];
  for (const t of tree) {
    if (t.type === "tree") {
      treeArray.push("index.html?dir=" + t.path);
    }
    if (t.type === "blob") {
      treeArray.push(t.path);
    }
  }
  return treeArray;
}

module.exports = router;
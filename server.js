const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "data.json");

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return { wishes: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all wishes
app.get("/api/wishes", (_req, res) => {
  res.json(readData());
});

// Post a wish
app.post("/api/wishes", (req, res) => {
  const { name, message } = req.body;
  if (!message || message.trim().length === 0) return res.json({ ok: false });
  const data = readData();
  data.wishes.push({
    name: (name || "匿名").trim().slice(0, 20),
    message: message.trim().slice(0, 280),
    time: new Date().toISOString(),
  });
  // Keep max 200 wishes
  if (data.wishes.length > 200) {
    data.wishes = data.wishes.slice(-200);
  }
  saveData(data);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`一路向北upupup 门户已启动: http://localhost:${PORT}`);
});

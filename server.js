const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get("/movies", function (req, res) {
  res.sendFile(path.join(__dirname, "data", "movies.json"));
});

app.listen(PORT, function () {
  console.log("Server running at http://localhost:3000");
});

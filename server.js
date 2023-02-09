const express = require("express");
const cors = require("cors");
require("dotenv").config();
const apiRoutes = require("./routes/api.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

module.exports = app

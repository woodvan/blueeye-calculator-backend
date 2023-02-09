const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", () => console.error("DB Connection Error"));
db.once("open", () => console.log("Connected to MongoDB"));

module.exports = db;

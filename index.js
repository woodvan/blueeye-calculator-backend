const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./server");

mongoose
.set("strictQuery", true)
.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to database");
})
.catch((err) => {
  console.log("Error connecting to DB", err.message);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

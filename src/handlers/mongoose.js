const mongoose = require("mongoose");

if (!process.env.mongodb) {
  console.log("❌ Not Connected to mongodb");
} else {
  mongoose.connect(
    process.env?.mongodb,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    () => {
      console.log("✅ Connected to mongodb");
    }
  );
}
module.exports = mongoose;

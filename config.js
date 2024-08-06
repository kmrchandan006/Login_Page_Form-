const mongoose = require("mongoose");

const val = async () => {
  try {
    await mongoose.connect("mongodb+srv://kmrchandan006:chandan%40123@cluster0.dqtnskf.mongodb.net/project", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Database connection failed", err);
    process.exit(1);
  }
};

module.exports = val;
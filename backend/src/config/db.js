require("dotenv").config();
const mongoose = require("mongoose");

const { MONGODB_URL } = process.env;

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {});
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};

connectToDB();

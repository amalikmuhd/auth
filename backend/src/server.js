require("./config/db");
const home = require("./routes/home");
const user = require("./routes/users");
const auth = require("./routes/auth");
const OTP = require("./routes/otp");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/", home);
app.use("/api/users", user);
app.use("/api/auth", auth);
app.use("/api/open", OTP);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to PORT:${port}...`));

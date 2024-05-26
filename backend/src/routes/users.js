const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const { OTP } = require("../models/otp");
const express = require("express");
const sendMail = require("../utils/sendMail");
const generateOtp = require("../utils/generateOTP");
const apiKey = require("../middleware/api-key");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const userData = await User.findById(req.user.id).select("-password -__v -_id");
  res.status(200).send({ message: "success", data: userData });
});

router.post("/signup", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ message: "User already registered." });

    user = new User(_.pick(req.body, ["first_name", "last_name", "email", "phone_number", "password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    sendMail(user.email, user.first_name);

    return res.send({ message: "success", data: "User created" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  console.log(user, "hre");
  if (!user) return res.status(400).send({ message: "User does not exists." });

  user = new User(_.pick(req.body, ["email", "name"]));

  if (req.body.password) {
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ message: "Invalid email or password." });
  }

  // clear any old record
  await OTP.deleteOne({ email: user.email });

  const generatedOTP = await generateOtp();

  await sendMail(
    user.email,
    null,
    "Jega Abubakar OTP",
    `<head><style>body {font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0 20px;}.container {max-width: 600px;background-color: #fff;padding: 20px;border-radius: 8px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}h2 {color: #333;}p {color: #555;}.otp-code {font-size: 24px;color: #007bff;margin-bottom: 5px;}.footer {text-align: center;margin-top: 10px;color: #888;}</style></head><body><div class='container'><h2>Password Reset</h2><p>Dear ${user.name},</p><p>We have received a request to change your password. Please use the following OTP code for verification:</p>
          <div class='otp-code'>${generatedOTP}</div>
          <p>If you did not make this request, you can safely ignore this email.</p>
          <p>Thank you!</p>
          <div class="footer">
            <p>This email was sent by your application. Do not reply to this email.</p>
          </div>
        </div>
      </body>
      `
  );

  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(generatedOTP, salt);

  const newOTP = await new OTP({
    email: req.body.email,
    otp: hashedOtp,
    createdAt: Date.now(),
    expiresAt: Date.now() + 600000,
  });

  await newOTP.save();
  return res.status(200).send({ message: "success" });
});

router.post("/reset", async (req, res) => {
  try {
    let { email, otp, password } = req.body;
    if (!(email && otp && password)) return res.status(400).send({ message: "Empty credentials are not allowed." });

    let user = await User.findOne({ email });
    if (!user) return res.status(400).send({ message: "Email does not exist." });

    const matchedOTPRecord = await OTP.findOne({ email });
    if (!matchedOTPRecord) return res.status(400).send({ message: "No otp records found." });

    // const hashedOTP = await bcrypt.compare(req.body.otp, matchedOTPRecord);
    // if (!hashedOTP) return res.status(400).send({ message: 'Invalid otp code.' });

    const { expiresAt } = matchedOTPRecord;
    // checking for expired code
    if (expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      return res.status(400).send({ message: "Code has expired. Request for a new one." });
    }

    const hashedOTP = await bcrypt.compare(req.body.otp, matchedOTPRecord.otp);
    if (!hashedOTP) return res.status(400).send({ message: "Invalid otp code." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassed = await bcrypt.hash(password, salt);

    if (password.length < 8) return res.status(400).send({ message: "Passowrd is too short!" });

    await User.updateOne({ email }, { password: hashedPassed });

    await sendMail(
      user.email,
      null,
      "Jega OTP",
      `<head><style>body {font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0 20px;}.container {max-width: 600px;background-color: #fff;padding: 20px;border-radius: 8px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}h2 {color: #333;}p {color: #555;}.otp-code {font-size: 24px;color: #007bff;margin-bottom: 5px;}.footer {text-align: center;margin-top: 10px;color: #888;}</style></head><body><div class='container'><h2>Password Changed</h2><p>Dear ${user.name},</p><p>Your has been changed password successfully.</p>
            <p>If you did not make this request, you can safely ignore this email.</p>
            <p>Thank you!</p>
            <div class="footer">
              <p>This email was sent by your application. Do not reply to this email.</p>
            </div>
          </div>
        </body>`
    );
    return res.status(200).send({ message: "success", data: { hashedPassed, email } });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

module.exports = router;

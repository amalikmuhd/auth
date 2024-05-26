const bcrypt = require("bcryptjs");
const { User } = require("../models/user");
const { OTP, validate } = require("../models/otp");
const express = require("express");
const sendMail = require("../utils/sendMail");
const generateOtp = require("../utils/generateOTP");
const router = express.Router();

// request new verification otp
router.post("/otp", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ message: "Invalid email or password." });

    if (req.body.password) {
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(400).send({ message: "Invalid email or password." });
    }

    // clear any old record
    await OTP.deleteOne({ email: req.body.email });

    const generatedOTP = await generateOtp();

    await sendMail(
      req.body.email,
      null,
      "Jega OTP",
      `<head><style>body {font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 0 20px;}.container {max-width: 600px;background-color: #fff;padding: 20px;border-radius: 8px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}h2 {color: #333;}p {color: #555;}.otp-code {font-size: 24px;color: #007bff;margin-bottom: 5px;}.footer {text-align: center;margin-top: 10px;color: #888;}</style></head><body><div class='container'><h2>OTP Verification</h2><p>Dear ${user.name},</p><p>We have received a request to verify your email address. Please use the following OTP code for verification:</p>
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
    res.status(200).send({ message: "success" });
  } catch (ex) {
    res.status(400).send({ message: ex.message });
  }
});

// verify otp
router.post("/verify-otp", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ message: "Email does not exist." });

  const matchedOTPRecord = await OTP.findOne({ email: req.body.email });
  if (!matchedOTPRecord) return res.status(400).send({ message: "No otp records found." });

  const { expiresAt } = matchedOTPRecord;
  // checking for expired code
  if (expiresAt < Date.now()) {
    await OTP.deleteOne({ email: req.body.email });
    return res.status(400).send({ message: "Code has expired. Request for a new one." });
  }

  const hashedOTP = await bcrypt.compare(req.body.otp, matchedOTPRecord.otp);
  if (!hashedOTP) return res.status(400).send({ message: "Invalid otp code." });

  await OTP.deleteOne({ email: req.body.email });
  return res.status(200).send({ message: "success" });
});

module.exports = router;

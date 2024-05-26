require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = async (to, name, subject, html, text) => {
  const { AUTH_EMAIL, AUTH_PASSWORD, EMAIL_SERVICE } = process.env;

  let transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: AUTH_EMAIL,
      pass: AUTH_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"no-reply" <noreply@jega.io>',
    to: to,
    subject: subject || "Registration Success",
    html: html || `<body><h2>Hello ${name}! </h2><p>We're glad to have you on board at Jega. </p></body>`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      res.status(400).send({ message: "Error sending email", data: error });
    } else {
      res.status(200).json({ message: "Email Sent!" });
    }
  });

  //   let testAccount = await nodemailer.createTestAccount();

  //   const transporter = nodemailer.createTransport({
  //     // host: 'smtp.ethereal.email',
  //     service:"gmail",
  //     port: 587,
  //     secure: false,
  //     // auth: {
  //     //   user: testAccount.user, // Your Gmail email address
  //     //   pass: testAccount.pass, // Your Gmail email password
  //     // },
  //     auth: {
  //       user: "amalikmuhdd@gmail.com", // Your Gmail email address
  //       pass: "segfujmuzzgxngki", // Your Gmail email password
  //     },
  //   });

  //   const mailOptions = {
  //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //     to: 'amalikmuhdd@gmail.com', // list of receivers
  //     subject: 'Registration Success', // Subject line
  //     text: 'Thank you for registering! Your account has been successfully created.',
  //     html: '<b>Thank you for registering! Your account has been successfully created.</b>',
  //   };

  //   transporter.sendMail(mailOptions, (error, info) => {
  //     if (error) {
  //       console.error('Error sending email:', error);
  //       res.status(400).send({ message: 'Error sending email', data: error });
  //     } else {
  //       console.log('Email sent:', info.response);
  //       res.status(200).json({ message: 'Email Sent!', info: info.messageId, preview: nodemailer.getTestMessageUrl(info) });
  //     }
  //   });
};

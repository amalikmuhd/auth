module.exports = async function generateOTP() {
  try {
    return (otp = `${Math.floor(100000 + Math.random() * 900000)}`);
  } catch (ex) {
    throw ex;
  }
};

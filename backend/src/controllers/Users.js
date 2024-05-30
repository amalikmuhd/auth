const Signup = (req, res) => {
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
  }


  export default Signup
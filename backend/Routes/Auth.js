const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const axios = require('axios')
const jwtSecret = "HaHa"

router.post("/createuser", async (req, res) => {
  
  try {
    await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      location: req.body.location,
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});


router.post('/login', [
  body('email', "Enter a Valid Email").isEmail(),
  body('password', "Password cannot be blank").exists(),
], async (req, res) => {
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body;
  try {
      let user = await User.findOne({ email });  //{email:email} === {email}
      if (!user) {
          return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
      }

      const data = {
          user: {
              id: user.id
          }
      }
      success = true;
      console.log(data);
      return res.json({ success: true });

      

  } catch (error) {
      console.error(error.message)
      res.send("Server Error")
  }
})


module.exports = router;

// User authentication
var express = require('express');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
var router = express.Router();

router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user || user.password !== req.body.password) {
        return res.status(401).send('Invalid credentials');
      }
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).send(error);
    }
});

router.post('/register', async (req, res) => {
    try {
      const user = new User({username: "moji", password: "123456"});
      await user.save();
      res.status(201).send('User registered successfully');
    } catch (error) {
      res.status(400).send(error);
    }
});
module.exports = router;
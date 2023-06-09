const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('secret');
const User = require('../models/User');

exports.Register = async (req, res) => {
  const {name, email, phone, address, password, registerDate, userRole} =
    req.body;
  try {
    const searchRes = await User.findOne({email});
    if (searchRes) return res.send(401).json({msg: 'User already exists!'});
    const newUser = new User({
      name,
      email,
      password,
      phone,
      address,
      registerDate,
      userRole
    });
    let salt = await bcryptjs.genSalt(10);
    let hash = await bcryptjs.hash(password, salt);
    newUser.password = hash;
    await newUser.save();
    // res.status(200).json(newUser);
    const payload = {
      id: newUser._id,
    };
    let token = jwt.sign(payload, secret);
    res.send({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phoneNumber,
        address: newUser.address,
        registerDate: newUser.registerDate,
        userRole: newUser.userRole,
      },
    });
  } catch (error) {
    res.status(500).json({errors: error});
  }
};

exports.Login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) return res.status(404).json({msg: 'Wrong informations'});
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({msg: 'Wrong informations'});
    const payload = {
      id: user._id,
    };
    const token = await jwt.sign(payload, secret);
    res.send({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({errors: error.message});
  }
};

exports.getUser = (req, res) => {
  res.send(req.user);
};

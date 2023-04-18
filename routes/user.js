const express = require('express');
const {Register, Login, getUser} = require('../controllers/user.controller');
const auth = require('../middlewares/auth');
const {
  registerRules,
  validator,
  loginRules,
} = require('../middlewares/validator');
const router = express.Router();

router.post('/register', registerRules(), validator, Register);
router.post('/login', loginRules(), Login);
router.get('/get_user', auth, getUser);
module.exports = router;

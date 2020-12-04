const router = require('express').Router();
const { signup, login, adminLogin } = require('../controllers/authController');

router.route('/register').post(signup);
router.route('/login').post(login);
router.route('/adminlogin').post(adminLogin);

module.exports = router;

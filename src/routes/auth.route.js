const router = require("express").Router();
const authController = require('../controllers/auth.controller');
const authValidate = require('../middlewares/auth.validate')

router.post('/register', authValidate , authController.register); 
router.post('/login', authValidate ,authController.login);
router.post('/refresh-token', authController.refreshToken);
router.delete('/logout', authController.logout);

module.exports = router;
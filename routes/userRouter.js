const express = require('express')
const router = express.Router({ mergeParams: true })
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const reviewRouter = require('./reviewRouter')

router.use('/:userId/reviews', reviewRouter);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.tokenValidation);
router.patch('/updateMe', userController.updateMe);
router.patch('/updatePassword', userController.updatePassword);
router.get('/me', userController.getMe);
router.route('/').delete(authController.authorize('admin'), userController.deleteUser)

module.exports = router;
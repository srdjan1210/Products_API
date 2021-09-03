const express = require('express');
const router = express.Router({ mergeParams: true })
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')


router.use(authController.tokenValidation)


router.route('/')
    .post(reviewController.setAuthor, reviewController.createReview)
    .get(reviewController.getAllReviews)
    

router.route('/:id')
    .get(reviewController.getReviewById)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview)

router.route('/:userId')
    .get(reviewController.getAllReviews);


module.exports = router;
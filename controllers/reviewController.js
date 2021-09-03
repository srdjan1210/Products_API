const asyncCatch = require('../utils/asyncCatch')
const ReviewModel = require('../models/ReviewModel')
const AppError = require('../utils/appError')
const factory = require('./handlerFactory')
const APIFeatures = require('../utils/APIFeatures');

exports.setAuthor = asyncCatch( async (req, res, next) => {
    req.body.author = req.user._id;
    next();
});

exports.getReviewById = asyncCatch( async (req, res, next) => {
    let query = ReviewModel.findOne({_id: req.params.id });
    let features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .project()
        .paginate();
    let review = await features.query;

    if(!review) return new AppError('A review with this id doesnt exist. Please provide a valid one!', 400);

    res.json({
        status: 'Success',
        data: {
            review
        }
    })
});



exports.updateReview = asyncCatch( async (req, res, next) => {
    let reviewWithAuthor = await ReviewModel.exists({ _id: req.params.id, author: req.user.id });
    
    if(!reviewWithAuthor) return next(new AppError('You are not allowed to change this review!', 403));

    let review = await ReviewModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!review) return next(new AppError('No document for specified id!', 404));

    res.json({
        status: 'Success',
        data: {
            review
        }
    })
});


exports.getAllReviews = factory.getAll(ReviewModel);
exports.createReview = factory.createOne(ReviewModel);
exports.deleteReview = factory.deleteOne(ReviewModel, true);
const AppError = require('../utils/appError')
const asyncCatch = require('../utils/asyncCatch')
const APIFeatures = require('../utils/APIFeatures')


exports.createOne = Model => asyncCatch( async (req, res, next) => {
    let doc = await Model.create(req.body);

    res.status(201).json({
        status: 'Success',
        data: {
            result: doc
        }
    })
});

exports.getOne = Model => asyncCatch( async (req, res, next) => {
    
    let query = Model.findOne({ _id: req.params.id });
    let features = new APIFeatures(query, req.query)
        .filter()
        .sort()
        .project()
        .paginate();

    const doc = await features.query;
    
    
    if(!doc) return next(new AppError('No document with specified id!', 404));

    res.json({
        status: 'Success',
        data: {
            result: doc
        }
    })
});



exports.updateOne = Model => asyncCatch( async (req, res, next) => {
    let doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    });

    if(!doc) return next(new AppError('No document for specified id!', 404));

    res.json({
        status: 'Success',
        result: doc
    });
});

exports.deleteOne = (Model, isReview) => asyncCatch( async (req, res, next) => {
    let filter = { _id: req.body.id };
    if(isReview) {
        filter.author = req.user.id;
    }
    let doc = await Model.findOneAndDelete(filter);
    if(!doc) return next(new AppError('Document for provided id doesn\'t exist', 404));
    res.status(204).json({});
});


exports.getAll = Model => asyncCatch( async (req, res, next) => {
    let filter = {};
    if(req.params.userId) {
        filter = { author: req.params.userId };
    }

    let features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .project()
        .paginate();
    let docs = await features.query;

    res.status(200).json({
        status: 'Success',
        nResults: docs.length,
        data: {
            result: docs
        }
    })
});

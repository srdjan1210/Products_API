exports.rejectedPromiseHandler = (err, req, res, next) => {

    console.log(err);

    let statusCode = err.statusCode || 500;
    let message = err.message;

    if (!err.operational) {
        message = 'Something failed!'
    }


    if (err.name === 'MongoError') {
        if (err.code === 11000) {
            message = `Email ${err.message.match(/"(.*)"/)[0]} alredy exists!`
            statusCode = 400;
        } else {
            console.log('new error');
            console.log(err);
        }


    } else if (err.name === 'ValidationError') {
        message = err.message;
        statusCode = 400;
    } else if (err.name === 'JsonWebTokenError') {
        message = err.message;
        statusCode = 401;
    } else if (err.name === 'TokenExpiredError') {
        message = err.message;
        statusCode = 401;
    }

    res.status(statusCode).json({
        status: 'fail',
        error: message
    })
};


exports.wrongRouteHitHandler = (req, res, next) => {
    console.log('Wrong route hit');
    res.json({
        status: 'fail',
        error: 'Wrong route hit!'
    });
}
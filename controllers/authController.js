const AppError = require('../utils/appError')
const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { promisify } = require('util')
const asyncCatch = require('../utils/asyncCatch')
const sendEmail = require('../utils/email')
const signToken = require('../utils/signToken')
const filterOutFromObject = require('../utils/filterOutFromObject')

const createTokenAndSendAlongData = (user, statusCode, res) => {
    let token = signToken(user._id);
    let newDate = new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 );

    const cookiesOptions = {
        expires: newDate,
        httpOnly: true
    }
    if (process.env.NODE_ENV !== 'development' ) {
        cookiesOptions.secure = false;
    }
    res.cookie('jwt', token, cookiesOptions);
    user = filterOutFromObject(user, 'password', 'role', 'passwordChangedAt');
    res.status(statusCode).json({
        status: "Success",
        data: {
            user
        }
    });

}

exports.tokenValidation = asyncCatch(async (req, res, next) => {
    let authHeader = req.headers['authorization'];

    let token = "";
    if (authHeader && authHeader.startsWith('Bearer')) token = authHeader.split(' ')[1];
    
    let decoded = await promisify(jwt.verify)(token, process.env.SECRET);
    let currentUser = await UserModel.findById(decoded.id);

    if (!currentUser) return next(new AppError('User for this token does not exist anymore!', 401));
    if (currentUser.passwordChangedBefore(decoded.exp)) return next(new AppError('Token not valid anymore, because user changed password. Please log in again!'), 401);
    
    req.user = currentUser;
    next();
});


exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission for this action!', 403));
        }
        next();
    }
}


exports.forgotPassword = asyncCatch(async (req, res, next) => {
    let { email } = req.body;

    //User with given email exists?
    let user = await UserModel.findOne({ email });
    if (!user) {
        next(new AppError('No user found for given email!', 404));
    }
    //Create resetPassword token
    let resetToken = await user.createPasswordResetToken();
    await user.save({
        validateBeforeSave: false
    });
    //send to client

    const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a patch request with your new password and password confirm to the reset url: ${resetURL}.
                     If you didnt forgot your password, please ignore this email!`
    const options = {
        to: email,
        message,
        subject: 'Password reset token(Valid for 10 min)'
    };

    try {
        await sendEmail(options);
        res.json({
            status: 'Success',
            message: 'Token sent to the email!'
        });

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({
            validateBeforeSave: false
        });
        return next(new AppError('Some error happened with sending token. Please try again!', 500));
    }



});

exports.resetPassword = asyncCatch(async (req, res, next) => {
    let token = req.params.token;

    let hashedToken = crypto.createHash('sha256').update(token).digest();
    //hash token and find user with that token
    let user = await UserModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    });
    if (!user) {
        next(new AppError('Token not valid, we could not change your password!', 400));
    }
    //Set new password for user

    user.password = req.body.password;
    user.confirm_password = req.body.confirm_password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    let newToken = signToken(user._id);

    //send token back to user
    res.json({
        status: 'Success',
        data: {
            token: newToken
        }
    })
});

exports.login = asyncCatch(async (req, res, next) => {
    
    //Check if email and password exist
    let { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    let user = await UserModel.findOne({ email }).select("+password");
    if (!user || !(await user.isCorrectPassword(password, user.password))) {
        return next(new AppError('Password or email wrong!', 401));
    }

    createTokenAndSendAlongData(user._doc, 200, res);
});


exports.signup = asyncCatch(async (req, res, next) => {
    let user = await UserModel.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
        role: 'user'
    });
    createTokenAndSendAlongData(user._doc, 201, res);
});


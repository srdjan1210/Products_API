const UserModel = require('../models/UserModel')
const asyncCatch = require('../utils/asyncCatch')
const AppError = require('../utils/appError')
const filterOutFromObject = require('../utils/filterOutFromObject')
const factory = require('./handlerFactory')

exports.updateMe = asyncCatch( async (req, res, next) => {
    let data = req.body;

    if(data.password || data.confirm_password) return next(new AppError('Wrong route for updating password!', 400));
    let filteredData = filterOutFromObject(data, 'passwordChangedAt', 'role','passwordResetToken', 'passwordResetExpires')

    let user = await UserModel.findByIdAndUpdate(req.user.id, filteredData, { new: true, runValidators: true});

    if(!user) return next(new AppError('User not found!', 404));
    
    
    res.json({
        status: 'Success',
        data: {
            user
        }
    }) 
});


exports.updatePassword = asyncCatch( async (req, res, next) => {
    let { password, confirm_password } = req.body;

    if(!password || !confirm_password) return next(new AppError('Password or confirm password not provided!', 400));
    
    req.user.password = password;
    req.user.confirm_password = confirm_password;
    await req.user.save();

    res.json({
        status: 'Success',
        message: 'Password updated successfully!'
    })

});


exports.getMe = asyncCatch( async (req, res, next) => {
    let user = await UserModel.findOne({_id: req.user.id}, {select: "-passwordChangedAt"}).populate('reviews');
    res.json({
        status: 'Success',
        data: {
            user
        }
    }) 
});

exports.deleteUser = factory.deleteOne(UserModel);

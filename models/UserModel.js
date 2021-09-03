const mongoose = require('mongoose')
const hasher = require('bcrypt')
const validator = require('validator')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Username has not been specified!']
    },
    email: {
        type: String,
        required: [true, 'Email has not been specified!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Provided data is not email!']
    },
    password: {
        type: String,
        required: [true, 'Password has not been specified!'],
        minlength: [8, 'Password should be at least 8 characters long!'],
        select: false
    },
    confirm_password: {
        type: String,
        required: [true, 'You did not confirm your password!'],
        select: false,
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Passwords don\'t match!'
        }
    },
    photo: String,
    passwordChangedAt: Date,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, 
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});






userSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'author',
    localField: '_id'
});

// userSchema.pre(/^find/, (next) => {
//     this.populate({
//         path: 'reviews'
//     });
//     next();
// })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    let salt = await hasher.genSalt(10);
    this.password = await hasher.hash(this.password, salt);
    this.confirm_password = undefined;
    next();
});

userSchema.pre('save', function (next) {

    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now();
    next();
});


//Instance methods
userSchema.methods.isCorrectPassword = async function (passwordCandidate, password) {
    return await hasher.compare(passwordCandidate, password);
}


userSchema.methods.passwordChangedBefore = function (timestamp) {
    if (this.passwordChangedAt) {
        return timestamp < parseInt(this.passwordChangedAt / 1000, 10);
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest();
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
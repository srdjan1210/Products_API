let jwt = require('jsonwebtoken')
module.exports = (id) => {
    return jwt.sign({
        id
    }, process.env.SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}
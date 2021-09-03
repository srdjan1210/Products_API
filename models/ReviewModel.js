const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number, 
        required: [true, 'Rating must be specified!'],
        min: 1,
        max: 5 
    },
    content: {
        type: String, 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author must be specified!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



const ReviewModel = mongoose.model('Review', ReviewSchema);


module.exports = ReviewModel;
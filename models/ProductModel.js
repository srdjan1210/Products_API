const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    category: {
        type: 'String',
        required: [true, 'Please provide category for the product!'],
        enum: ['Graficke karte', 'Procesori', 'Memorija', 'RAM Memorija', 'Kucista', 'Napajanja']
    },
    name: {
        type: String,
        required: [true, 'Please provide name for the product!']
    },
    price: {
        type: Number,
        required: [true, 'Please provide price for the product!']
    },
    quantity: {
        type: Number, 
        required: [true, 'Please provide quantity for the product']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
});




const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;

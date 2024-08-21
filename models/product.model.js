const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    ratings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    brandName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
        required: true
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

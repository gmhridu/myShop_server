const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number
}, {timestamps: true});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
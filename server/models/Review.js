const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);

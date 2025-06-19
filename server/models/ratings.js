const { Schema, model } = require('mongoose');


const RatingSchema = new Schema( {
    username: { type: String, required: true },
    usertype: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { collection: 'ratings' });

const Rating = model('Rating', RatingSchema);

module.exports = Rating ;

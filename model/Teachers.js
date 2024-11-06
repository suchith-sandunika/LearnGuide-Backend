const mongoose = require('mongoose');

const TeachersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    course: {
        type: [String],
        required: false
    }
}, {collection: 'Teachers'}); 

module.exports = mongoose.model('Teachers', TeachersSchema);
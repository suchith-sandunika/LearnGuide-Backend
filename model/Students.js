const mongoose = require('mongoose');

const StudentsSchema = new mongoose.Schema({
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
    courses: {
        type: [String],
        required: false
    }
}, {collection: 'Students'}); 

module.exports = mongoose.model('Students', StudentsSchema);
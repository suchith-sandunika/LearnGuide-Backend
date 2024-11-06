const mongoose = require('mongoose');

const CoursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: true
    },
    prerequisites: {
        type: String,
        required: false
    },
    target_audience: {
        type: String,
        required: false
    },
    level: {
        type: String,
        required: false
    },
    fee: {
        type: Number,
        required: false
    },
    teacher: {
        type: String, // or you can reference the Teachers model: type: mongoose.Schema.Types.ObjectId, ref: 'Teachers'
        required: true // This ensures that each course is associated with a teacher
    }
}, { collection: 'Courses' }); 

module.exports = mongoose.model('Courses', CoursesSchema);
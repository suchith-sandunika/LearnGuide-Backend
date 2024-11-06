const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router(); 

const Teachers = require('../model/Teachers'); // Import your Students model
const Courses = require('../model/Courses'); // Import your Courses model
const upload = require('../util/Storage');
const authenticateToken = require('../auth/authenticateToken');

// Middleware to protect routes
// router.use(authenticateToken);

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', upload.single('image'), async (req, res) =>{
    const {name, email, password: plainTextPassword} = req.body;
    const password = await bcrypt.hash(plainTextPassword, 10); 

    try {
        // Get the path of the uploaded image from Multer
        const imagePath = req.file ? req.file.path : null; // Check if file is uploaded
        console.log(imagePath);

        const response = await Teachers.create({
            name,
            email,
            password,
            image: imagePath // Store image path in the document
        });
        console.log('User Created Successfully', response);
        res.json({status: 'ok', data: response});
    } catch(error){
        console.log(error);
    }
}); 

router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try{
        // const userData = await Users.find((user) => user.name === name);
        const teacherData = await Teachers.findOne({ name }).lean();
        console.log(teacherData);

        if(!teacherData){
            return res.json({status: 'error', error: 'User Not Found'});
        } else {
            const comparationResult = await bcrypt.compare(password, teacherData.password);
            console.log(comparationResult);
            if(comparationResult) {
                // Generte Token ...
                const token = jwt.sign({
                    id: teacherData._id,
                    name: teacherData.name,
                }, JWT_SECRET, {expiresIn: '1h'});

                // Store token and username in session
                req.session.token = token;
                req.session.username = teacherData.name;
                
                res.json({status: 'ok', message: 'User Found', data: {name: teacherData.name, token: token}});
                console.log(`${teacherData.name}, ${token}`);
            } else {
                res.json({status: 'error', error: 'Invalid Password'});
            }
        }
    } catch(error){
        console.log(error);
    }
}); 

router.post('/addCourse', upload.single('image'), async (req, res) => {
    const teacherFromSession = req.session.username; // Get the teacher's name from the session
    console.log(teacherFromSession);
    
    // Extract course details from req.body
    const { name, description, prerequisites, target_audience, level, fee } = req.body;

    try { 
        const imagePath = req.file ? req.file.path : null; // Check if file is uploaded
        console.log(imagePath);

        // Check if the teacher already has a course with this name
        const teacherAlreadyHasACourse = await Courses.findOne({ teacher: teacherFromSession, name });
        console.log(teacherAlreadyHasACourse);

        if (teacherAlreadyHasACourse) {
            return res.json({ status: 'error', error: 'Teacher Already Has A Course' });
        } else {
            // Create a new course and include the teacher's name
            const response = await Courses.create({
                name,
                description,
                prerequisites,
                target_audience,
                level,
                fee,
                image: imagePath,
                teacher: teacherFromSession // Use the teacher's name from the session
            }); 
            // If the course is successfully created, add it to the teacher's courses
            const TeachersCourses = await Teachers.updateOne({ name: teacherFromSession }, { $push: { course: response.name } });
            console.log('Teacher Courses Updated Successfully', TeachersCourses);
            console.log('Course Added Successfully', TeachersCourses);
            res.json({ status: 'ok', data: response });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', error: 'An error occurred while adding the course.' });
    }
}); 

module.exports = router;
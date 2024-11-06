const express = require('express');
const router = express.Router(); 
const Teachers = require('../model/Teachers');
const Courses = require('../model/Courses');
const Students = require('../model/Students');

// Middleware to protect routes
// router.use(authenticateToken);

router.get('/ViewAllCourses', async (req, res) => {
    const courses = await Courses.find();
    console.log("Find All Courses Result:" + courses);
    try{
        if(!courses) {
            res.json({status: 'error', message: 'Course not found'});
        } else {
            res.json({status: 'ok', data: courses});
        }
    } catch(error) {
        console.log(error);
    }
});

router.get('/ViewAllTeachers', async (req, res) => {
    const teachers = await Teachers.find();
    console.log("Find All Teachers Result:" + teachers);
    try{
        if(!teachers) {
            res.json({status: 'error', message: 'teacher not found'});
        } else {
            res.json({status: 'ok', data: teachers});
        }
    } catch(error) {
        console.log(error);
    }
}); 

router.get('/ViewAllTeachers/:name', async (req, res) => {
    const name = req.params.name;
    const teacher = await Teachers.findOne({ name }).lean();
    console.log("Find Teacher By Name Result:" + teacher);
    try {
        if(!teacher){
            res.json({status: 'error', message: 'Teacher not found'});
        } else {
            res.json({status: 'ok', data: teacher});
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/ViewAllStudents', async (req, res) => {
    const students = await Students.find();
    console.log("Find All Students Result:" + students);
    try{
        if(!students) {
            res.json({status: 'error', message: 'Student not found'});
        } else {
            res.json({status: 'ok', data: students});
        }
    } catch(error) {
        console.log(error);
    }
}); 

router.get('/ViewAllStudents/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const student = await Students.findOne({ name }).lean();
        console.log("Find Student By Name Result:" + student);
        console.log(student.name);
        if(!student){
            res.json({status: 'error', message: 'Student not found'});
        } else {
            res.json({status: 'ok', data: student});
        }
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
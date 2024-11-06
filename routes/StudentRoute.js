const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router(); 
const Students = require('../model/Students'); // Import your Students model
const upload = require('../util/Storage');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', upload.single('image'), async (req, res) =>{
    const {name, email, password: plainTextPassword} = req.body;
    const password = await bcrypt.hash(plainTextPassword, 10); 

    try {
        // Retrieve the path of the uploaded image
        const imagePath = req.file ? req.file.path : null; // This now uses your custom path
        console.log('Image Path:', imagePath);

        const response = await Students.create({
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
        const studentData = await Students.findOne({ name }).lean();
        console.log(studentData);

        if(!studentData){
            return res.json({status: 'error', error: 'User Not Found'});
        } else {
            const comparationResult = await bcrypt.compare(password, studentData.password);
            console.log(comparationResult);
            if(comparationResult) {
                // Generte Token ...
                const token = jwt.sign({
                    id: studentData._id,
                    name: studentData.name,
                }, JWT_SECRET, {expiresIn: '1h'});

                // Store token in session
                req.session.token = token;
                req.session.username = studentData.name;
                
                res.json({status: 'ok', message: 'User Found', data: {name: studentData.name, token: token}});
                console.log(`${studentData.name}, ${token}`);
            } else {
                res.json({status: 'error', error: 'Invalid Password'});
            }
        }
    } catch(error){
        console.log(error);
    }
});  

module.exports = router;
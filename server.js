const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const studentRoute = require('./routes/StudentRoute');
const teacherRoute = require('./routes/TeacherRoute');
const CommonRoute = require('./routes/CommonRoute'); 
const PaymentRoute = require('./routes/PaymentRoute');

const port = process.env.PORT || 5000;
const mongodbURL = process.env.mongodbURL;
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CLIENT_ID = process.env.PAYMENT_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYMENT_SECRET;

// Set Database Connection ...
mongoose.connect(mongodbURL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB !'))
.catch((error) => console.error('Failed to connect to MongoDB', error));

// paypal.configure({
//     mode: 'sandbox', // For testing purposes
//     client_id: CLIENT_ID, // Replace with your PayPal client ID
//     client_secret: CLIENT_SECRET // Replace with your PayPal client secret
// });

const app = express(); 

app.use(express.json()); 

// Set up session middleware
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000, httpOnly: true } // Set your desired timeout
})); 

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000',  // Change this to your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE']  // Specify allowed methods
}));

app.use(cookieParser());

// Use the routes ...
app.use('/api/students', studentRoute);
app.use('/api/teachers', teacherRoute);
app.use('/api/', CommonRoute);
app.use('/api/payments', PaymentRoute);

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});
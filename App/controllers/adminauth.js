const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import the Admin model
const Admin = require('../Modals/adminModel');
const BlacklistedToken = require('../Modals/blacklistedToken');

var secretKey = "h9RtE5wPqLsGz"


// Registration route handler
async function registerAdmin(req, res) {
    try {
        const { username, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        // Create a JWT token
        // { expiresIn: '24h' }
        const token = jwt.sign({ username }, secretKey); 

        // Create a new admin document
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            token
        });

        // Save the admin to the database
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}

// Function to log in an admin
async function loginAdmin(req, res) {
    try {
        const { username, password } = req.body 
        // Find the admin by username
        const admin = await Admin.findOne({ username });

        if (!admin) {
            res.status(500).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        // Validate password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            res.status(500).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        // Create a new JWT token
        const token = jwt.sign({ username: admin.username }, secretKey); // Replace with your own secret key

        // Update the token in the admin document
        admin.token = token;
        await admin.save();
        await BlacklistedToken.deleteMany({});
        res.status(201).json({ success: true, message: 'Login successful', admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
}

module.exports = {
    registerAdmin,
    loginAdmin
};

// Use the route handler in your Express app
// app.post('/register', registerAdmin);

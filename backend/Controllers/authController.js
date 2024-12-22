require('dotenv').config();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

// MySQL Client Setup
let client = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD
});

client.connect((err) => {
    if (err) {
        console.log(process.env.HOST, process.env.PORT, process.env.DATABASE, process.env.USER, process.env.PASSWORD);
        console.error(`Error in connection with database\nError: ${err}`);
    } else {
        console.log(`Connected to MySQL`);
    }
});

// Get User Data Controller
module.exports.getUserDataController = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const query = `SELECT * FROM users WHERE user_id = ?`;
        client.query(query, [user_id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).json({ message: 'Internal Server Error', error: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                success: true,
                data: result[0]
            });
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Update User Profile Controller
module.exports.updateUserProfileController = async (req, res) => {
    try {
        const { user_id, name, email, password } = req.body;

        // Validate that user_id is provided
        if (!user_id) {
            return res.status(400).json({ message: 'Missing required field: user_id' });
        }

        // Build dynamic query based on provided fields
        const updates = [];
        const params = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }

        if (email) {
            updates.push('email = ?');
            params.push(email);
        }

        if (password) {
            // Hash the password before updating
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            params.push(hashedPassword);
        }

        // If no fields to update, return an error
        if (updates.length === 0) {
            return res.status(400).json({ message: 'No fields to update. Please provide name, email, or password.' });
        }

        // Add user_id to parameters
        params.push(user_id);

        const query = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`;

        client.query(query, params, (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).json({ message: 'Internal Server Error', error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ 
                success: true, 
                message: 'User profile updated successfully' 
            });
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// Add New User Controller
module.exports.createUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields: name, email, or password' });
        }

        // Check if user already exists
        const checkQuery = `SELECT * FROM users WHERE email = ?`;
        client.query(checkQuery, [email], async (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
            }

            if (result.length > 0) {
                return res.status(200).json({ success: false, message: 'User already registered' }); // Conflict status code
            }

            // Hash the password
            const saltRounds = 10; // Number of salt rounds for hashing
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert new user into the database
            const insertQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
            client.query(insertQuery, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error executing query:', err.message);
                    return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
                }

                const user_id = result.insertId;
                res.status(201).json({
                    success: true, 
                    message: 'User added successfully', user_id 
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

module.exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing required fields: email or password' });
        }

        // Check if the user exists in the database
        const query = `SELECT * FROM users WHERE email = ?`;
        client.query(query, [email], async (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
            }

            if (result.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: 'User not registered',
                    registration_required: true
                });
            }

            const user = result[0];

            // Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(200).json({ 
                    success: false,
                    message: 'Invalid email or password'
                }); // Unauthorized status code
            }

            // If the password matches, send a success response (or a token if implementing authentication)
            res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email
                }
            });
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};
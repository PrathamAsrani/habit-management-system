require('dotenv').config();
const mysql = require('mysql');

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
        console.error(`Error in connection with database\nError: ${err}`);
    } else {
        console.log(`Connected to MySQL`);
    }
});

// Create a new habit
module.exports.createHabitController = async (req, res) => {
    try {
        const { user_id, habit_title, start_date, frequency, status } = req.body;

        // Check if required fields are provided
        if (!user_id || !habit_title || !start_date || !frequency || !status) {
            return res.status(400).json({ message: 'Missing required fields: user_id, habit_title, start_date, frequency, or status' });
        }

        // Check if the habit already exists for the user
        const checkQuery = `SELECT * FROM habit WHERE user_id = ? AND habit_title = ?`;
        client.query(checkQuery, [user_id, habit_title], (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).json({ message: 'Internal Server Error', error: err.message });
            }

            // If habit already exists, return a response indicating so
            if (result.length > 0) {
                return res.status(200).json({ message: 'Habit already exists for this user' });
            }

            // If habit doesn't exist, proceed with the insertion
            const insertQuery = `INSERT INTO habit (user_id, habit_title, start_date, frequency, status) VALUES (?, ?, ?, ?, ?)`;
            client.query(insertQuery, [user_id, habit_title, start_date, frequency, status], (err, result) => {
                if (err) {
                    console.error('Error executing insert query:', err.message);
                    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
                }

                res.status(201).json({ message: 'Habit created successfully', habit_id: result.insertId });
            });
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// Get all habits for the authenticated user
module.exports.getHabitsController = async (req, res) => {
    try {
        const { user_id, pages } = req.query;

        if (!user_id || !pages) {
            return res.status(400).json({ message: 'Missing required fields: user_id or pages' });
        }

        const limit = 6; // Number of habits per page
        const offset = (parseInt(pages, 10) - 1) * limit; // Calculate offset based on pages

        const query = `SELECT * FROM habit WHERE user_id = ? LIMIT ? OFFSET ?`;

        client.query(query, [user_id, limit, offset], (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).json({ message: 'Internal Server Error', error: err.message });
            }

            res.status(200).json(result);
        });

    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// Update the status or title of a habit
module.exports.updateHabitController = async (req, res) => {
    try {
        const { id } = req.params;
        const { habit_title, status } = req.body;

        if (!id || (!habit_title && !status)) {
            return res.status(400).json({ message: 'Missing required fields: id and at least one of habit_title or status' });
        }

        let query = `UPDATE habit SET `;
        const values = [];

        if (habit_title) {
            query += `habit_title = ?, `;
            values.push(habit_title);
        }

        if (status) {
            query += `status = ?, `;
            values.push(status);
        }

        query = query.slice(0, -2); // Remove trailing comma
        query += ` WHERE habit_id = ?`;
        values.push(id);

        client.query(query, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).json({ message: 'Internal Server Error', error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Habit not found' });
            }

            res.status(200).json({ message: 'Habit updated successfully' });
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Delete a specific habit
module.exports.deleteHabitController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Missing required field: id' });
        }

        const query = `DELETE FROM habit WHERE habit_id = ?`;
        client.query(query, [id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return res.status(500).json({ message: 'Internal Server Error', error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Habit not found' });
            }

            res.status(200).json({ message: 'Habit deleted successfully' });
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Update the success status of a habit
module.exports.updateSuccessController = async (req, res) => {
    const { habit_id } = req.body;
    console.log("habit_id: ", habit_id)

    try {
        await client.query("UPDATE habit SET success = success + 1 WHERE habit_id = ?", [habit_id]);
        res.status(200).send({ success: true, message: "Habit updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Failed to update habit" });
    }
};
const express = require('express');
const router = express.Router();
const {
    createHabitController,
    getHabitsController,
    updateHabitController,
    deleteHabitController,
    updateSuccessController
} = require('../Controllers/habitsController.js');

// Create a new habit
router.post(`/create`, createHabitController);

// Get a list of habits for the authenticated user
router.get(`/get`, getHabitsController);

// Update the status or title of a specific habit by habit_id
router.put(`/update:id`, updateHabitController);

// Delete a specific habit by habit_id
router.delete(`/remove:id`, deleteHabitController);

// update progress bar
router.post("/update-success", updateSuccessController);

module.exports = router;

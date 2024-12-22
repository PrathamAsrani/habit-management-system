import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';  // Adjust import according to your file structure
import '../styles/addHabit.css';
import Layout from '../layout/Layout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddHabit = () => {
    const navigate = useNavigate();
    const [habitData, setHabitData] = useState({
        habit_title: '',
        start_date: '',
        frequency: '',
        status: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [userId, setUserId] = useState('');

    const [auth] = useAuth();  // Assuming `auth` is provided through context

    useEffect(() => {
        // Set user_id from auth context when the component mounts
        if (auth?.user_id) {
            setUserId(auth.user_id);
        } else {
            toast('User not authenticated.');
            navigate('/');
        }
    }, [auth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHabitData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { habit_title, start_date, frequency, status } = habitData;

        if (!habit_title || !start_date || !frequency || !status) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        // Map "Active" to '1' and "Inactive" to '0'
        const mappedStatus = status === "Active" ? "1" : "0";

        try {
            // Send the mapped status value
            const { data } = await axios.post('/api/habits/create', {
                user_id: userId, // Send the user_id from state
                habit_title,
                start_date,
                frequency,
                status: mappedStatus, // Send the mapped status
            });

            setSuccessMessage(data?.message);
            setErrorMessage('');
            setHabitData({
                habit_title: '',
                start_date: '',
                frequency: '',
                status: '',
            });
            toast.success(data?.message);
        } catch (error) {
            setErrorMessage('Failed to add habit. Please try again.');
            setSuccessMessage('');
        }
    };


    return (
        <Layout title='Registration'>
            <div className="add-habit-container">
                <h2>Add New Habit</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <form onSubmit={handleSubmit} className="habit-form">
                    <div className="form-group">
                        <label htmlFor="habit_title">Habit Title</label>
                        <input
                            type="text"
                            id="habit_title"
                            name="habit_title"
                            value={habitData.habit_title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="start_date">Start Date</label>
                        <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={habitData.start_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="frequency">Frequency</label>
                        <select
                            id="frequency"
                            name="frequency"
                            value={habitData.frequency}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Frequency</option>
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={habitData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">
                        Add Habit
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default AddHabit;

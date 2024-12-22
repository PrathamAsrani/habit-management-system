
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/authContext.js";
import Layout from "../layout/Layout.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const [userHabits, setUserHabits] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState({});
    const [showLoadMore, setShowLoadMore] = useState(false);

    const getHabits = useCallback(async () => {
        try {
            const { data } = await axios.get(`/api/habits/get?user_id=${auth?.user_id}&pages=${auth?.pages}`);
            setUserHabits((prevHabits) => {
                const habitIds = prevHabits.map((habit) => habit.habit_id);
                const newHabits = data.filter((habit) => !habitIds.includes(habit.habit_id));
                return [...prevHabits, ...newHabits];
            });
            if (data.length >= 6) {
                setShowLoadMore(true); // Set the button visibility based on data length
            } else {
                setShowLoadMore(false); // No more habits to load
            }

            // Update button disabled state
            const initialButtonState = {};
            data.forEach((habit) => {
                const storedState = localStorage.getItem(`habit_${habit.habit_id}`);
                const isDisabled = storedState ? JSON.parse(storedState).isDisabled : false;
                initialButtonState[habit.habit_id] = isDisabled;
            });
            setButtonDisabled((prev) => ({ ...prev, ...initialButtonState }));
        } catch (error) {
            toast.error("Failed to fetch habits. Please try again later.");
            console.error(error);
        }
    }, [auth?.user_id, auth?.pages]);


    const handleLoadMore = () => {
        if (showLoadMore) {
            setAuth({
                ...auth,
                pages: auth?.pages + 1
            })
            getHabits(); // Fetch the new habits
        }
    };


    const calculateResetTime = (frequency) => {
        const now = new Date();
        let resetTime;

        if (frequency === "daily") {
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            resetTime = midnight - now;
        } else if (frequency === "weekly") {
            const nextWeekStart = new Date();
            const dayOfWeek = now.getDay();
            nextWeekStart.setDate(now.getDate() + (7 - dayOfWeek));
            nextWeekStart.setHours(0, 0, 0, 0);
            resetTime = nextWeekStart - now;
        } else if (frequency === "monthly") {
            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            nextMonth.setHours(0, 0, 0, 0);
            resetTime = nextMonth - now;
        }
        return resetTime;
    };

    const handleDoneClick = async (habit_id, frequency) => {
        try {
            const { data } = await axios.post(`/api/habits/update-success`, { habit_id });
            if (data?.success === true) {
                toast.success("🎉 Great work! Keep it up...");

                const resetTime = calculateResetTime(frequency);

                setButtonDisabled((prev) => ({
                    ...prev,
                    [habit_id]: true,
                }));
                localStorage.setItem(
                    `habit_${habit_id}`,
                    JSON.stringify({ isDisabled: true, resetTime: Date.now() + resetTime })
                );

                setTimeout(() => {
                    setButtonDisabled((prev) => ({
                        ...prev,
                        [habit_id]: false,
                    }));
                    localStorage.removeItem(`habit_${habit_id}`);
                }, resetTime);

                getHabits();
            } else {
                toast.error(data?.message);
            }
        } catch (err) {
            toast.error("Failed to update habit. Please try again later.");
            console.error(err);
        }
    };

    const handleFailureUpdate = async (habit_id) => {
        try {
            const { data } = await axios.post(`/api/habits/update-failure`, { habit_id });
            if (data?.success === true) {
                toast.info("Failure recorded. Better luck next time!");
            } else {
                toast.error(data?.message);
            }
        } catch (err) {
            toast.error("Failed to update failure count. Please try again later.");
            console.error(err);
        }
    };

    useEffect(() => {
        if (auth?.user_id) {
            getHabits();
        }
    }, [auth?.user_id, auth?.pages, getHabits]);


    useEffect(() => {
        userHabits.forEach((habit) => {
            const storedState = localStorage.getItem(`habit_${habit.habit_id}`);
            if (storedState) {
                const { isDisabled, resetTime } = JSON.parse(storedState);
                if (isDisabled && Date.now() < resetTime) {
                    setButtonDisabled((prev) => ({
                        ...prev,
                        [habit.habit_id]: true,
                    }));
                } else if (Date.now() >= resetTime && !isDisabled) {
                    handleFailureUpdate(habit.habit_id);
                    localStorage.removeItem(`habit_${habit.habit_id}`);
                } else {
                    localStorage.removeItem(`habit_${habit.habit_id}`);
                }
            }
        });
    }, [userHabits]);

    return (
        <Layout title="Dashboard">
            <div className="dashboard">
                <h3 className="dashboard-title">My Habits</h3>
                <button className="add-habit-button" onClick={() => navigate('/add-habit')}>
                    Add Habit
                </button>
                <button className="recommend-habit-button" onClick={() => navigate('/recommend-habit')}>
                    Recommend
                </button>
                <div className="habit-header">
                    <p className="header-item">Habit Title</p>
                    <p className="header-item">Frequency</p>
                    <p className="header-item">Status</p>
                    <p className="header-item">Progress</p>
                    <p className="header-item">Action</p>
                </div>
                <div className="habit-list">
                    {userHabits.length > 0 ? (
                        userHabits.map((habit) => (
                            <div className="habit-card" key={habit.habit_id}>
                                <p className="habit-title">{habit.habit_title}</p>
                                <p className="habit-frequency">{habit.frequency}</p>
                                <p
                                    className={`habit-status ${habit.status === "1" ? "status-active" : "status-inactive"
                                        }`}
                                >
                                    {habit.status === "1" ? "Active" : "Inactive"}
                                </p>
                                {habit.status === "1" ? (
                                    <div className="habit-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-filled"
                                                style={{
                                                    width: `${(habit.success / (habit.success + habit.failure)) * 100}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span className="progress-percentage">
                                            {(
                                                (habit.success / (habit.success + habit.failure)) *
                                                100
                                            ).toFixed(1)}
                                            %
                                        </span>
                                    </div>
                                ) : <div className="habit-progress"></div>}
                                <button
                                    className="done-button"
                                    onClick={() =>
                                        handleDoneClick(habit.habit_id, habit.frequency)
                                    }
                                    disabled={buttonDisabled[habit.habit_id]}
                                >
                                    Done
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-habits-message">No habits found. Start tracking your habits!</p>
                    )}
                </div>

                {showLoadMore && (
                    <button className="load-more-button" onClick={handleLoadMore}>
                        Load More
                    </button>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;

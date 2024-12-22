import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './context/authContext.js';
import axios from 'axios';
import NotFound from './pages/NotFound.jsx';
import HomePage from './pages/HomePage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Signup from './pages/Signup.jsx';
import AddHabit from './pages/AddHabit.jsx';
import RecommendHabit from './pages/RecommendHabit.jsx';
import EditUser from './pages/EditUser.jsx';

function App() {
  const [auth] = useAuth();
  const [currentHabits, setCurrentHabits] = useState([]);
  const [loading, setLoading] = useState(false); // Add a loading state

  useEffect(() => {
    const getHabits = async () => {
      setLoading(true); // Set loading to true before the API call
      try {
        const { data } = await axios.get(
          `/api/habits/get?user_id=${auth?.user_id}&pages=${auth?.pages}`
        );
        let habits = [];
        data.forEach((habit) => {
          habits.push(habit.habit_title);
        })
        setCurrentHabits(habits)
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally {
        setLoading(false); // Set loading to false after the API call
      }
    };

    if (auth?.user_id) {
      getHabits();
    }
  }, [auth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-habit" element={<AddHabit />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route
          path="/recommend-habit"
          element={
            <RecommendHabit
              currentHabits={currentHabits}
              loading={loading} // Pass loading state as a prop
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

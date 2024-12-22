import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext.js';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import '../styles/homepage.css';
import Layout from '../layout/Layout.jsx';

const HomePage = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [auth, setAuth] = useAuth();

    const handleSignUp = () => {
        navigate('/signup');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`/api/auth/login`, loginData);
            if (data?.success === true) {
                const newAuthState = {
                    user_id: data?.user?.user_id,
                    pages: 1
                };
                setAuth(newAuthState); // Update the auth state
                localStorage.setItem('auth', JSON.stringify(newAuthState)); // Store in localStorage
                toast.success(data?.message);
            } else if (data?.registration_required === true) {
                toast.error('User not found!');
                navigate('/signup');
            } else {
                console.log(data?.message);
                toast.error(data?.message);
            }
        } catch (err) {
            console.error(`Error in login\nError: ${err}`);
            toast.error(err);
        }
    };

    // Use useEffect to handle the navigation after setting the auth state
    useEffect(() => {
        if (auth?.user_id) {
            navigate('/dashboard');
        }
    }, [auth, navigate]); // Ensure navigation only happens after auth state is updated

    return (
        <Layout title="Habit Management Dashboard">
            <div id="webpage">
                <div className="homepage-left">
                    <h1>Habit Management System</h1>
                    <h3>AI automated -- track your habits</h3>
                    <div className="social-icons">
                        <a href="https://www.linkedin.com/in/pratham-asrani-9897b0225/" target="_blank" rel="noreferrer">
                            <FaLinkedin className="icon" />
                        </a>
                        <a href="mailto:prathamasrani.cs@gmail.com" target="_blank" rel="noreferrer">
                            <FaEnvelope className="icon" />
                        </a>
                    </div>
                </div>
                <div className="homepage-right">
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({
                                    ...loginData,
                                    email: e.target.value
                                })}
                                placeholder="e.g. prathamasrani.cs@gmail.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({
                                    ...loginData,
                                    password: e.target.value
                                })}
                                placeholder="e.g. password"
                                required
                            />
                        </div>
                        <div className="button-group">
                            <button type="submit">Sign In</button>
                            <button type="button" onClick={handleSignUp}>Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import '../styles/signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`/api/auth/createUser`, signupData);
            if (data?.success === true) {
                toast.success(data?.message);
                navigate('/');
            } else {
                toast.error(data?.message);
            }
        } catch (err) {
            console.error(`Error in signup\nError: ${err}`);
            toast.error('Error in signup. Please try again.');
        }
    };

    return (
        <div id="webpage">
            <div className="signup-left">
                <h1>Registration -- Habit Management System</h1>
                <h3>Track and manage your habits effortlessly!</h3>
                <div className="social-icons">
                    <a href="https://www.linkedin.com/in/pratham-asrani-9897b0225/" target='_blank' rel='noreferrer'>
                        <FaLinkedin className='icon' />
                    </a>
                    <a href="mailto:prathamasrani.cs@gmail.com" target='_blank' rel='noreferrer'>
                        <FaEnvelope className='icon' />
                    </a>
                </div>
            </div>
            <div className="signup-right">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor='name'>Full Name:</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={signupData.name}
                            onChange={(e) => setSignupData({
                                ...signupData,
                                name: e.target.value
                            })}
                            placeholder='Enter your full name'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={signupData.email}
                            onChange={(e) => setSignupData({
                                ...signupData,
                                email: e.target.value
                            })}
                            placeholder='e.g. prathamasrani.cs@gmail.com'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Password:</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            value={signupData.password}
                            onChange={(e) => setSignupData({
                                ...signupData,
                                password: e.target.value
                            })}
                            placeholder='Enter a password'
                            required
                        />
                    </div>
                    <button type='submit'>Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;

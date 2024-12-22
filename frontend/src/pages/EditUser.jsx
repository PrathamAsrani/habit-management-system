import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import Layout from '../layout/Layout';

const EditUser = () => {
    const [auth] = useAuth();
    const [userData, setUserData] = useState({
        user_id: auth?.user_id,
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const { data } = await axios.put('/api/auth/updateUser', userData);
            console.log(data)

            if (data?.success === true) {
                toast.success(data?.message);
            }
        } catch (error) {
            toast.error('Failed to update user profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title='Edit-User'>
            <div id="webpage" style={{ display: 'flex', height: '100vh' }}>
            <div className="signup-left">
                <h1>Edit Profile</h1>
                <h3>Update your details below</h3>
            </div>

            <div className="signup-right">
                <h2>Edit Your Profile</h2>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div
                            style={{
                                padding: '10px',
                                backgroundColor: '#f8d7da',
                                color: '#721c24',
                                marginBottom: '15px',
                                borderRadius: '5px',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div
                            style={{
                                padding: '10px',
                                backgroundColor: '#d4edda',
                                color: '#155724',
                                marginBottom: '15px',
                                borderRadius: '5px',
                            }}
                        >
                            {successMessage}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
        </Layout>
    );
};

export default EditUser;

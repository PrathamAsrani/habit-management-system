# Habit Management System

## Demonstration Video: https://drive.google.com/file/d/1h-XYhINUZ26ZU8JiaXeQy5LYLwoJrHAz/view?usp=sharing

## Project Overview

The **Habit Management System** is a web application designed to help users track and manage their daily, weekly, and monthly habits. It allows users to create new habits, track their progress, receive personalized habit suggestions powered by AI, and manage their user profiles. This project is built using a full-stack approach with React for the frontend, Node.js and Express for the backend, MySQL for the database, and Flask for AI-powered habit recommendations.

## Features

### 1. Habit Tracking System
- **Create New Habit**: Users can add habits such as "Drink Water", "Read a Book", etc.
- **Track Habits**: Mark habits as done or not done for each day, week, or month.
- **View Progress**: Progress is displayed using a progress bar or calendar view.
- **Habit Status**: Each habit shows its status (Active, Inactive, Completed).

### 2. AI-Powered Habit Suggestions
- **Personalized Suggestions**: AI recommends new habits based on the user’s existing habits.
- **Example Suggestion**: "Drink more water" if the user has health-related habits.
- **API Endpoint**: `/generate-habit-suggestions` provides 3 new habit recommendations.

### 3. User Account System
- **User Registration/Login**: Implemented using JWT for authentication.
- **User Dashboard**: Displays habits, progress, and suggested habits.
- **Profile Section**: Users can view their progress, edit their name, and change their password.

## Technical Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **AI Service**: Flask, Scikit-learn, Pandas, Numpy
- **Authentication**: JWT-based user authentication

## API Endpoints

### Habit-related Endpoints
- **POST /api/habits**: Create a new habit.
- **GET /api/habits**: Retrieve all habits for the authenticated user.
- **PUT /api/habits/:id**: Update the status of a habit (mark as done, edit title, etc.).
- **DELETE /api/habits/:id**: Delete a specific habit.

### User-related Endpoints
- **GET /api/user**: Get user profile information (name, email).
- **PUT /api/user**: Update user profile details.

### AI Recommendation Endpoint
- **GET /generate-habit-suggestions**: Returns 3 personalized habit suggestions.

## Database Schema

### Users Table
- `user_id`: INT (Primary Key)
- `name`: VARCHAR
- `email`: VARCHAR
- `password`: VARCHAR

### Habits Table
- `habit_id`: INT (Primary Key)
- `user_id`: INT (Foreign Key to Users table)
- `habit_title`: VARCHAR
- `start_date`: DATE
- `frequency`: ENUM (Daily, Weekly, Monthly)
- `status`: ENUM (Active, Inactive, Completed)


## Setup Instructions

### Backend:
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Run the backend server:
   - With `nodemon` (for development):
     ```bash
     npm test
     ```
   - Or using `node`:
     ```bash
     node Server.js
     ```
   - Or start with npm:
     ```bash
     npm start
     ```

### Frontend:
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm start
   ```

## Low-Level Design

The system is designed in a three-tier architecture:

### Level 1: Database

**Technologies**: MySQL

### Level 2: Backend

**Technologies**: Node.js, Express.js

- The backend is a REST API created using Express.js.
- It follows SOLID principles for flexibility and ease of adding new routes or modifying existing functionality.
- Routes for user and contact management are defined in separate controller files, ensuring modularity and clarity.

### Level 3: Frontend

**Technologies**: React.js, ContextAPI, localStorage

- **React.js**: For building the user interface.
- **ContextAPI**: Used for global state management, storing user data (like `user_id`) and page data (like how many records to fetch).
- **localStorage**: Used to store authentication tokens, ensuring the user remains signed in even after page reloads.

## Functionality

### User:
1. Sign up
2. Sign in
3. Delete user
4. Edit User

### habit:
1. Add 
2. Progess bar
3. Summary

### AI:
1. Recommendation on habits

## Features
1. **Readable**: The code is written in a clean and well-structured format.
2. **Understandable**: Comments are provided for better clarity.
3. **Resource Sharing**: CORS is enabled, allowing resource sharing with other websites.
4. **Maintainable**: Follows the single responsibility principle to make maintenance easier.
5. **Extensible**: Adheres to the open-closed principle for easy extension of functionality.
6. **Secure**: Provides protection against DDoS attacks, with additional security features enabled using `helmet` in Node.js.

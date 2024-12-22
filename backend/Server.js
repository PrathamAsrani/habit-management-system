const express = require('express')
const app = express();
const dotenv = require('dotenv')
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes.js')
const habitManagementRoutes = require('./Routes/habitManagementRoutes.js')

// backend configuration
dotenv.config()
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true
}));
app.use(express.json())

// backend routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitManagementRoutes);

// landing page of backend
app.get("/", (req, res) => {
    res.status(200).send({
        message: `Rest Server is running`
    })
})

app.listen((process.env.CONNECTION_PORT || 5000), () => {
    console.log(`Server running on ${process.env.CONNECTION_PORT || 5000}\n`);
})
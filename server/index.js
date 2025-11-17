// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const clientOrigin = process.env.CLIENT_ORIGIN;
app.use(cors({
  origin: clientOrigin, // Use the variable
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
 // Add this


const projectsRouter = require('./routes/ProjectRoutes');
const experienceRouter = require('./routes/ExperienceRoutes');
const userRouter = require('./routes/UserRoutes'); // Add this
const reviewRouter = require('./routes/ReviewRoutes');
const mediumRouter = require('./routes/MediumRoutes');
const JobRoutes = require("./routes/JobRoutes");
const StudentRoutes = require('./routes/StudentRoutes');
const adminAuth = require('./middleware/adminAuth_jobs');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminApiRoutes = require('./routes/adminApiRoutes');












// Connect to MongoDB
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Basic test route
app.get('/', (req, res) => {
  res.send('Digital Blueprint API is running!');
});

app.use('/api/projects', projectsRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/medium', mediumRouter);
app.use('/api/student', StudentRoutes);
app.use("/api/jobs", JobRoutes);
app.use("/api/admin/auth", adminAuthRoutes); // <-- Login/Logout (NOT protected)
app.use("/api/admin", adminAuth, adminApiRoutes);


// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });
module.exports = app;
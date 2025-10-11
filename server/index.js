// index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
 // Add this


const projectsRouter = require('./routes/ProjectRoutes');
const experienceRouter = require('./routes/ExperienceRoutes');
const userRouter = require('./routes/UserRoutes'); // Add this
const reviewRouter = require('./routes/ReviewRoutes');
const mediumRouter = require('./routes/MediumRoutes');






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


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
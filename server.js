const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const songsRoute = require('./routes/songs');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/songs', songsRoute);

app.listen(PORT, () => console.log(`🎵 Server running on port ${PORT}`));
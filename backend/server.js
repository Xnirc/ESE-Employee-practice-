const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("No MONGO_URI");
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB Atlas Connected');
  } catch (err) {
    console.log('Atlas connection failed. Starting In-Memory MongoDB for fast testing...');
    const mongoServer = await MongoMemoryServer.create();
    const mockUri = mongoServer.getUri();
    await mongoose.connect(mockUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('In-Memory MongoDB Connected Successfully!');
  }
};

connectDB();

app.get('/', (req, res) => {
  res.json({ message: "backend run properly" });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

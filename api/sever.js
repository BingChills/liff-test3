const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
const uri = "mongodb+srv://linkz:linkz2024@linkz.79c2i.mongodb.net/?retryWrites=true&w=majority&appName=Linkz";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a User model
const User = mongoose.model('User', new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
}));

// Route to handle ID token
app.post('/api/auth', (req, res) => {
  const { idToken } = req.body;
  const decodedToken = jwt.decode(idToken);

  if (!decodedToken) {
    return res.status(400).send('Invalid token');
  }

  const { sub: userId, name, email } = decodedToken;

  // Find or create user
  User.findOneAndUpdate({ userId }, { name, email }, { upsert: true, new: true }, (err, user) => {
    if (err) return res.status(500).send(err);
    res.send(user);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
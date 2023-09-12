const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'your-secret-key'; // Replace with a strong secret key

app.use(bodyParser.json());

// Define an array to store registered users
const registeredUsers = [];

// Sample user for initial testing
const sampleUser = {
  username: 'user',
  password: '$2b$10$K3lOs8rBrRqPt6DSlXKIkO41bzFssF.Ca1uRFD/U5l3zq3QokvP1y', // Password: password
};

// Dummy in-memory token storage
const tokens = [];

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Serve static files from the "public" directory
app.use(express.static('public'));

// User Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Username and password are required.');

  // Check if the username already exists
  if (registeredUsers.some((user) => user.username === username)) {
    return res.status(409).send('Username already exists.');
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the user in the registeredUsers array
  registeredUsers.push({ username, password: hashedPassword });

  res.sendStatus(201);
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).send('Username and password are required.');

  console.log('Sample User Password Hash:', sampleUser.password); // Log hashed password
  console.log('Sample User Password Hash:', password); // Log hashed password

  // Check if the provided username and password match the sampleUser
  const sampleUserMatch = await bcrypt.compare(password, sampleUser.password);

  if (sampleUser.username === username && sampleUserMatch) {
    const accessToken = jwt.sign({ username: sampleUser.username }, secretKey);
    tokens.push(accessToken);
    return res.json({ accessToken });
  }

  // If the user is not found or the password doesn't match, return an error
  return res.status(401).send('User not found or invalid password.');
});



// Protected Route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

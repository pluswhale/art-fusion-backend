const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const bcrypt = require('bcrypt');
const models = require('./models');
const cors = require('cors');
const { where } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(express.json());

const allowedOrigins = ['http://localhost:3000', 'https://anotherdomain.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  }
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/user/:userId/items', async (req, res) => {
  const { userId } = req.params;
  const { itemId, title, description, imageUrl } = req.body;

  try {
    const newItem = await models.UserItem.create({
      userId,
      itemId,
      title,
      description,
      imageUrl
    });

    res.json(newItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users', async (req, res) => {
  try {
    const allUsers = await models.User.findAll(); // Use Sequelize's findAll method
    res.json(allUsers);
  } catch (error) {
    res.status(400).send(error.message); // It's helpful to send the error message back for debugging
  }
});

// Registration Route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const isExists = models.User.findOne({ where: { email } });
        
        if (isExists) return res.status(400).send({ message: 'User already exists' });
        
        // Create new user
        const newUser = await models.User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({
        id: newUser.id,
        email: newUser.email
        });
  } catch (error) {
        res.status(400).send(error.message);
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await models.User.findOne({ where: { email } });
    if (!user) return res.status(400).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    // Create and assign a token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.header('auth-token', token).send(token);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next(); // move on to the next middleware
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

// Example of a protected route
app.get('/user-profile', verifyToken, async (req, res) => {
  try {
    // Assuming a method to find user by ID exists
    const user = await models.User.findByPk(req.user.id);
    // Exclude password and other sensitive info from the result
    res.json({ email: user.email, id: user.id });
  } catch (error) {
    res.status(400).send(error.message);
  }
});


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


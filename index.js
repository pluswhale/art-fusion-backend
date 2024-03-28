const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;
const bcrypt = require('bcrypt');
const models = require('./models');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { where } = require('sequelize');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const hostBackendUrl = 'https://nft-marketplace-three-mu.vercel.app'
const localBackendUrl = 'http://localhost:3000'

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your_session_secret', // Use a secret key for your session
  resave: false, // Avoid resaving sessions that haven't changed
  saveUninitialized: true, // Save uninitialized sessions (sessions with no data)
  cookie: {
    secure: false, // Set to true if using https
    maxAge: 1000 * 60 * 60 * 24, // Set cookie expiry, e.g., 24 hours
  },
};

app.use(session(sessionConfig));


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  accessType: 'offline', 
  prompt: 'consent' 
},
  async (accessToken, refreshToken, profile, cb) => {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
  try {
    
    const [user, created] = await models.User.findOrCreate({
      where: { googleId: profile.id },
      defaults: {
        // Add other fields you want to populate by default on creation
        email: profile.emails[0].value,
        // Any other default fields...
      }
    });

    if (refreshToken) {
      // Here, save or update the refreshToken in your DB associated with the user
      // For example:
      await models.User.update({ refreshToken: refreshToken }, {
        where: { googleId: profile.id }
      });
    }

    // Assuming `user` is the user instance from your DB and has an `id`
    // Generate a JWT token for the user
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });

    // Attach the token to the user object
    // Make sure to not override the entire user object, just add the token property
    user.dataValues.token = token;

    return cb(null, user);
  } catch (error) {
    return cb(error, null);
  }
}));


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session()); // This enables login session support

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Find the user by ID and call done with it
  models.User.findByPk(id).then((user) => {
    done(null, user);
  });
});

const allowedOrigins = ['http://localhost:3000', 'https://nft-marketplace-three-mu.vercel.app', 'https://nft-marketplace-bje3e6i89-pluswhale.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  }
}));


app.get('/user/:userId/items', async (req, res) => {
  const { userId } = req.params;

  console.log(userId, 'userId');

  try {
    const userItems = await models.UserNFT.findAll({
      where: {
        userId: userId 
      }
    });

    if (!userItems || userItems.length === 0) {
      return res.status(404).send({ message: 'User has no items.' });
    }
   
    res.json({userItems}); 
  } catch (error) {
    console.error("Failed to fetch user items:", error);
    res.status(500).send({ message: "An error occurred while fetching user items." });
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
        const isExists = await models.User.findOne({ where: { email } });

        if (isExists) {
        // If a user is found, send a response immediately and stop further execution
        return res.status(400).send({ message: 'User already exists' });
        }

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
      
    if (!user) return res.status(400).send({message: 'User not found'});

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send({message: 'The bad credentials, try again.'});

    // Create and assign a token
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
    res.header('auth-token', token).send({token, user});
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
app.post('/me', async (req, res) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Validate the email is provided
    if (!email) {
      return res.status(400).send('Email is required');
    }

    // Find the user by email
    const user = await models.User.findOne({ where: { email: email } });

    // If no user found, return an appropriate response
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json({ user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/store/user-art', async (req, res) => {
  const { userId, itemId, name, description, cid, minted } = req.body;
  
  try {
    const newUserNFT = await models.UserNFT.create({
      userId,
      itemId,
      name,
      description,
      cid,
      minted
    });
    res.json(newUserNFT);
  } catch (error) {
    console.error('Error creating UserNFT:', error);
    res.status(500).send(error.message);
  }
});

app.delete('/destroy/user-art/:cid', async (req, res) => {
  const { cid } = req.params;
  
  try {
    const result = await models.UserNFT.destroy({
      where: { cid }
    });
    
    if (result === 0) {
      return res.status(404).send('No UserNFT found with the specified CID.');
    }
    
    res.send({message: 'UserNFT deleted successfully.'});
  } catch (error) {
    console.error('Error deleting UserNFT by CID:', error);
    res.status(500).send(error.message);
  }
});


// Google authorization
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
     res.redirect(`${process.env.NODE_ENV === 'development' ? localBackendUrl : hostBackendUrl}/auth-success?token=${req.user.dataValues.token}`);
  });

app.post('/token/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh Token is required' });

  // Verify refresh token, find associated user, and issue a new access token
  // This is a simplified example. You'll need to implement token verification and lookup logic
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


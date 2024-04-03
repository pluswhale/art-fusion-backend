const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const session = require('express-session');

const { allowedOrigins } = require('./constants')

// Routes
const userRoutes = require('./routes/userRoutes');
const authorizationRoutes = require('./routes/authorizationRoutes');
const userNFTRoutes = require('./routes/userNFTRoutes');

// Configs
const passport = require('./configs/passportConfig');
const sessionConfig = require('./configs/sessionConfig');


app.use(session(sessionConfig));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  }
}));

app.use([
  userRoutes,
  authorizationRoutes,
  userNFTRoutes
])

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


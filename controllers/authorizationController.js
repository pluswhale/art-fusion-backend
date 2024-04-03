const models = require('../models'); 
const bcrypt = require('bcrypt');
const passport = require('../configs/passportConfig');
const { hostBackendUrl, localBackendUrl, JWT_SECRET } = require('../constants');


async function registerUser(req, res) {
       const { email, password } = req.body;
    
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
}

async function loginUser(req, res) {
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
}

async function me(req, res) {
    try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send('Email is required');
    }

    const user = await models.User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json({ user });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

function authenticateGoogle() {
    return passport.authenticate('google', { scope: ['profile', 'email'] })
}

function authenticateGoogleCb(req,res) {
    passport.authenticate('google', { failureRedirect: '/login' });

    res.redirect(`${process.env.NODE_ENV === 'development' ? localBackendUrl : hostBackendUrl}/auth-success?token=${req.user.dataValues.token}`);

}

module.exports = {registerUser, loginUser, me, authenticateGoogle, authenticateGoogleCb}
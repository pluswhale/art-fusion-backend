const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const models = require('./models');


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


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});


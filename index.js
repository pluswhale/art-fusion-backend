const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const models = require('./models');


app.use(express.json());

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


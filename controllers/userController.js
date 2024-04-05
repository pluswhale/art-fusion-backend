const models = require('../models'); 

async function getUserItems(req, res) {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  

  try {
    const offset = (page - 1) * pageSize;
    const { count, rows } = await models.UserNFT.findAndCountAll({
      where: { userId },
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']]
    });

    if (!rows || rows.length === 0) {
      return res.status(404).send({ message: 'User has no items.' });
    }

    const totalPages = Math.ceil(count / pageSize);
    res.json({ totalPages, currentPage: page, pageSize, totalCount: count, items: rows });
  } catch (error) {
    console.error("Failed to fetch user items:", error);
    res.status(500).send({ message: "An error occurred while fetching user items." });
  }
}

async function getUsers (req, res)  {
  try {
    const allUsers = await models.User.findAll(); 
    res.json(allUsers);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = { getUserItems, getUsers };
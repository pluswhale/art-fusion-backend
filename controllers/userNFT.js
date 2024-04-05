const models = require('../models'); 

async function storeUserArt(req, res) {
    const {
        userId,
        itemId, name,
        description,
        cid,
        minted,
        resolution,
        collectionThemeId,
        imageUrl,
        metadataUrl
    } = req.body;
  
  try {
    const newUserNFT = await models.UserNFT.create({
      userId,
      itemId,
      name,
      description,
      cid,
      minted,
      resolution,
      themeId: collectionThemeId,
      imageUrl,
      metadataUrl
    });
    res.json(newUserNFT);
  } catch (error) {
    console.error('Error creating UserNFT:', error);
    res.status(500).send(error.message);
  }
}

async function createCollectionTheme(req, res) {
 const { name } = req.body;
  const theme = await models.CollectionTheme.findOrCreate({
    where: { name },
  });
  
  if (!theme) {
     res.status(400).send({message: 'Cant create collection theme'});
  }
  
  return res.status(200).send({collectionTheme: theme})
}

async function fetchCollectionTheme(req, res) {
  const { id } = req.params;

  if (!id) {
     res.status(400).send({message: 'Cant create collection theme'});
  }

  const theme = await models.CollectionTheme.findOne({
    where: { id }, 
  });
    
  return res.status(200).send({collectionTheme: theme})
}

async function deleteUserArt(req, res) {
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
}

module.exports = {
    storeUserArt,
    createCollectionTheme,
    fetchCollectionTheme,
    deleteUserArt
}
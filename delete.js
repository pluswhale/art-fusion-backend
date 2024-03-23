const { User } = require('./models'); // Adjust the path according to your project structure

async function deleteAllUsers() {
  try {
    await User.destroy({
      where: {},
      truncate: true // Use truncate for resetting IDs if that's desired
    });
    console.log('All users have been deleted.');
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}

deleteAllUsers();

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    }
  });

  return User;
};

module.exports = (sequelize, DataTypes) =>
  sequelize.define('Category', {
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'Category name is required.' }, len: { args: [2, 60], msg: 'Category name must be 2-60 characters.' } },
    },
    description: { type: DataTypes.STRING(255), allowNull: true },
  });

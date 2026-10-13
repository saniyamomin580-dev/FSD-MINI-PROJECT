'use strict';
// Creates all four tables. Run: npm run db:migrate
const STATUSES = ['Pending', 'Preparing', 'Ready', 'Completed'];

module.exports = {
  async up(queryInterface, Sequelize) {
    const timestamps = {
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    };

    await queryInterface.createTable('Categories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(60), allowNull: false, unique: true },
      description: { type: Sequelize.STRING(255) },
      ...timestamps,
    });

    await queryInterface.createTable('MenuItems', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.STRING(255) },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      imageUrl: { type: Sequelize.STRING(255) },
      isVegetarian: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      isAvailable: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      categoryId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'Categories', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      ...timestamps,
    });

    await queryInterface.createTable('Orders', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      customerName: { type: Sequelize.STRING(80), allowNull: false },
      tableNumber: { type: Sequelize.INTEGER, allowNull: false },
      notes: { type: Sequelize.STRING(255) },
      totalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.ENUM(...STATUSES), allowNull: false, defaultValue: 'Pending' },
      ...timestamps,
    });

    await queryInterface.createTable('OrderItems', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      orderId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'Orders', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      menuItemId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'MenuItems', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      unitPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      ...timestamps,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('OrderItems');
    await queryInterface.dropTable('Orders');
    await queryInterface.dropTable('MenuItems');
    await queryInterface.dropTable('Categories');
  },
};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = require('./Category')(sequelize, DataTypes);
const MenuItem = require('./MenuItem')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);

// ---- Associations ----
// One-to-many: Category -> MenuItems (a category cannot be deleted while it has items)
Category.hasMany(MenuItem, { foreignKey: { name: 'categoryId', allowNull: false }, as: 'items', onDelete: 'RESTRICT' });
MenuItem.belongsTo(Category, { foreignKey: { name: 'categoryId', allowNull: false }, as: 'category' });

// One-to-many: Order -> OrderItems (deleting an order deletes its lines)
Order.hasMany(OrderItem, { foreignKey: { name: 'orderId', allowNull: false }, as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: { name: 'orderId', allowNull: false }, as: 'order' });

// One-to-many: MenuItem -> OrderItems (a menu item that was ordered cannot be deleted)
MenuItem.hasMany(OrderItem, { foreignKey: { name: 'menuItemId', allowNull: false }, as: 'orderItems', onDelete: 'RESTRICT' });
OrderItem.belongsTo(MenuItem, { foreignKey: { name: 'menuItemId', allowNull: false }, as: 'menuItem' });

// Many-to-many: Order <-> MenuItem through OrderItem
Order.belongsToMany(MenuItem, { through: OrderItem, foreignKey: 'orderId', otherKey: 'menuItemId', as: 'menuItems' });
MenuItem.belongsToMany(Order, { through: OrderItem, foreignKey: 'menuItemId', otherKey: 'orderId', as: 'orders' });

module.exports = { sequelize, Category, MenuItem, Order, OrderItem };

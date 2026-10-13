const { Sequelize } = require('sequelize');
const configs = require('./config');

const cfg = configs[process.env.NODE_ENV || 'development'];

// One shared Sequelize connection for the whole app.
const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);

module.exports = sequelize;

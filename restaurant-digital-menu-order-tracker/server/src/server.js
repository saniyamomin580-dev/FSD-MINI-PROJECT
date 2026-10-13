require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection OK.');
    app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}/api`));
  } catch (err) {
    console.error('Cannot connect to MySQL:', err.message);
    console.error('Is MySQL running? Are DB_USER / DB_PASSWORD / DB_NAME in server/.env correct? Did you run "npm run db:setup"?');
    process.exit(1);
  }
})();

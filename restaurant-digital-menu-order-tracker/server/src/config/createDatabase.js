// Creates the MySQL database if it does not exist. Run: npm run db:create
const mysql = require('mysql2/promise');
const configs = require('./config');

(async () => {
  const cfg = configs[process.env.NODE_ENV || 'development'];
  try {
    const conn = await mysql.createConnection({
      host: cfg.host,
      port: cfg.port,
      user: cfg.username,
      password: cfg.password || undefined,
    });
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`Database "${cfg.database}" is ready.`);
    await conn.end();
  } catch (err) {
    console.error('Could not create the database:', err.message);
    console.error('Check DB_HOST, DB_USER and DB_PASSWORD in server/.env and make sure MySQL is running.');
    process.exit(1);
  }
})();

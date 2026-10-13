const { QueryTypes, fn, col, where: sqlWhere } = require('sequelize');
const { sequelize, Order, MenuItem, Category } = require('../models');
const HttpError = require('../utils/HttpError');
const { asyncHandler } = require('../middleware/errorHandler');
const { isValidDateString, todayString } = require('../utils/orderUtils');

// GET /api/dashboard/stats
exports.getStats = asyncHandler(async (req, res) => {
  const today = todayString();
  const [totalOrders, pendingOrders, preparingOrders, readyOrders, completedOrders, totalMenuItems, availableMenuItems, totalCategories, todaySales] =
    await Promise.all([
      Order.count(),
      Order.count({ where: { status: 'Pending' } }),
      Order.count({ where: { status: 'Preparing' } }),
      Order.count({ where: { status: 'Ready' } }),
      Order.count({ where: { status: 'Completed' } }),
      MenuItem.count(),
      MenuItem.count({ where: { isAvailable: true } }),
      Category.count(),
      Order.sum('totalAmount', { where: sqlWhere(fn('DATE', col('createdAt')), today) }),
    ]);
  res.status(200).json({
    totalOrders, pendingOrders, preparingOrders, readyOrders, completedOrders,
    totalMenuItems, availableMenuItems, totalCategories, todaySales: Number(todaySales || 0),
  });
});

// GET /api/reports/daily-sales?date=2026-10-12
// Uses PARAMETERIZED raw SQL (":date" is replaced safely by Sequelize - no SQL injection).
exports.getDailySales = asyncHandler(async (req, res) => {
  const date = req.query.date || todayString();
  if (!isValidDateString(date)) throw new HttpError(400, 'date must be in YYYY-MM-DD format.');
  const opts = { replacements: { date }, type: QueryTypes.SELECT };

  const [summary] = await sequelize.query(
    `SELECT COUNT(*) AS totalOrders,
            COALESCE(SUM(totalAmount), 0) AS totalSales,
            COALESCE(SUM(status = 'Completed'), 0) AS completedOrders
       FROM Orders
      WHERE DATE(createdAt) = :date`,
    opts
  );
  const byStatus = await sequelize.query(
    `SELECT status, COUNT(*) AS orders, COALESCE(SUM(totalAmount), 0) AS sales
       FROM Orders
      WHERE DATE(createdAt) = :date
      GROUP BY status`,
    opts
  );
  const topItems = await sequelize.query(
    `SELECT m.name, SUM(oi.quantity) AS quantitySold, SUM(oi.subtotal) AS revenue
       FROM OrderItems oi
       JOIN Orders o     ON o.id = oi.orderId
       JOIN MenuItems m  ON m.id = oi.menuItemId
      WHERE DATE(o.createdAt) = :date
      GROUP BY m.id, m.name
      ORDER BY quantitySold DESC
      LIMIT 5`,
    opts
  );
  const lastSevenDays = await sequelize.query(
    `SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') AS saleDate, COUNT(*) AS orders, SUM(totalAmount) AS sales
       FROM Orders
      WHERE DATE(createdAt) BETWEEN DATE_SUB(:date, INTERVAL 6 DAY) AND :date
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d')
      ORDER BY saleDate`,
    opts
  );

  res.status(200).json({
    date,
    totalOrders: Number(summary.totalOrders),
    totalSales: Number(summary.totalSales),
    completedOrders: Number(summary.completedOrders),
    byStatus: byStatus.map((r) => ({ status: r.status, orders: Number(r.orders), sales: Number(r.sales) })),
    topItems: topItems.map((r) => ({ name: r.name, quantitySold: Number(r.quantitySold), revenue: Number(r.revenue) })),
    lastSevenDays: lastSevenDays.map((r) => ({ saleDate: r.saleDate, orders: Number(r.orders), sales: Number(r.sales) })),
  });
});

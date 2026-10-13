const { Op, fn, col, where: sqlWhere } = require('sequelize');
const { sequelize, Order, OrderItem, MenuItem } = require('../models');
const HttpError = require('../utils/HttpError');
const { asyncHandler } = require('../middleware/errorHandler');
const { ORDER_STATUSES, isValidDateString, validateOrderInput, findItemProblems, calculateOrder } = require('../utils/orderUtils');

const withItems = [
  { model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem', attributes: ['id', 'name', 'isVegetarian'] }] },
];

// POST /api/orders  - the total is ALWAYS calculated here from database prices.
exports.create = asyncHandler(async (req, res) => {
  const { errors, data } = validateOrderInput(req.body);
  if (errors.length) throw new HttpError(400, 'Validation failed', errors);

  const orderId = await sequelize.transaction(async (t) => {
    const menuItems = await MenuItem.findAll({ where: { id: data.items.map((i) => i.menuItemId) }, transaction: t });
    const menuMap = new Map(menuItems.map((m) => [m.id, m]));

    const problems = findItemProblems(data.items, menuMap);
    if (problems.length) throw new HttpError(400, 'Some items cannot be ordered', problems);

    const { lines, total } = calculateOrder(data.items, menuMap);
    const order = await Order.create(
      { customerName: data.customerName, tableNumber: data.tableNumber, notes: data.notes, totalAmount: total, status: 'Pending' },
      { transaction: t }
    );
    await OrderItem.bulkCreate(lines.map((l) => ({ ...l, orderId: order.id })), { transaction: t, validate: true });
    return order.id; // if anything above throws, the whole order is rolled back
  });

  const order = await Order.findByPk(orderId, { include: withItems });
  res.status(201).json({ message: 'Order placed successfully.', data: order });
});

// GET /api/orders?status=Pending&date=2026-10-12&q=rahul
exports.getAll = asyncHandler(async (req, res) => {
  const { status, date, q } = req.query;
  const conditions = [];

  if (status) {
    if (!ORDER_STATUSES.includes(status)) throw new HttpError(400, `status must be one of: ${ORDER_STATUSES.join(', ')}.`);
    conditions.push({ status });
  }
  if (date) {
    if (!isValidDateString(date)) throw new HttpError(400, 'date must be in YYYY-MM-DD format.');
    conditions.push(sqlWhere(fn('DATE', col('createdAt')), date));
  }
  if (q && String(q).trim()) {
    const text = String(q).trim();
    const or = [{ customerName: { [Op.like]: `%${text}%` } }];
    if (/^\d+$/.test(text)) or.push({ id: Number(text) });
    conditions.push({ [Op.or]: or });
  }

  const orders = await Order.findAll({ where: { [Op.and]: conditions }, order: [['createdAt', 'DESC'], ['id', 'DESC']] });
  res.status(200).json(orders);
});

exports.getOne = asyncHandler(async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) throw new HttpError(400, 'Order ID must be a number.');
  const order = await Order.findByPk(req.params.id, { include: withItems });
  if (!order) throw new HttpError(404, 'Order not found.');
  res.status(200).json(order);
});

// PATCH /api/orders/:id/status   body: { "status": "Preparing" }
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!ORDER_STATUSES.includes(status)) throw new HttpError(400, `status must be one of: ${ORDER_STATUSES.join(', ')}.`);
  const order = await Order.findByPk(req.params.id);
  if (!order) throw new HttpError(404, 'Order not found.');
  await order.update({ status });
  res.status(200).json({ message: `Order #${order.id} is now ${status}.`, data: order });
});

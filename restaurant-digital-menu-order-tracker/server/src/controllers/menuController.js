const { Op } = require('sequelize');
const { Category, MenuItem, OrderItem } = require('../models');
const HttpError = require('../utils/HttpError');
const { asyncHandler } = require('../middleware/errorHandler');

const withCategory = [{ model: Category, as: 'category', attributes: ['id', 'name'] }];

// Only copy the fields a client is allowed to set.
const pick = (b) => ({
  name: b.name,
  description: b.description,
  price: b.price,
  imageUrl: b.imageUrl || null,
  isVegetarian: b.isVegetarian,
  isAvailable: b.isAvailable,
  categoryId: b.categoryId,
});

const toBool = (v) => (v === 'true' || v === true ? true : v === 'false' || v === false ? false : undefined);

// GET /api/menu?q=paneer&categoryId=1&available=true&vegetarian=true
exports.getAll = asyncHandler(async (req, res) => {
  const { q, categoryId, available, vegetarian } = req.query;
  const where = {};
  if (q && String(q).trim()) where.name = { [Op.like]: `%${String(q).trim()}%` };
  if (categoryId) {
    if (!Number.isInteger(Number(categoryId))) throw new HttpError(400, 'categoryId must be a number.');
    where.categoryId = Number(categoryId);
  }
  if (toBool(available) !== undefined) where.isAvailable = toBool(available);
  if (toBool(vegetarian) !== undefined) where.isVegetarian = toBool(vegetarian);

  const items = await MenuItem.findAll({ where, include: withCategory, order: [['categoryId', 'ASC'], ['name', 'ASC']] });
  res.status(200).json(items);
});

exports.getOne = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id, { include: withCategory });
  if (!item) throw new HttpError(404, 'Menu item not found.');
  res.status(200).json(item);
});

async function assertCategoryExists(categoryId) {
  const category = categoryId ? await Category.findByPk(categoryId) : null;
  if (!category) throw new HttpError(400, 'A valid categoryId is required.');
}

exports.create = asyncHandler(async (req, res) => {
  await assertCategoryExists(req.body.categoryId);
  const item = await MenuItem.create(pick(req.body));
  res.status(201).json({ message: 'Menu item created.', data: await MenuItem.findByPk(item.id, { include: withCategory }) });
});

exports.update = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) throw new HttpError(404, 'Menu item not found.');
  if (req.body.categoryId !== undefined) await assertCategoryExists(req.body.categoryId);

  const changes = pick(req.body);
  Object.keys(changes).forEach((k) => changes[k] === undefined && delete changes[k]); // allows partial updates (e.g. only isAvailable)
  await item.update(changes);
  res.status(200).json({ message: 'Menu item updated.', data: await MenuItem.findByPk(item.id, { include: withCategory }) });
});

exports.remove = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByPk(req.params.id);
  if (!item) throw new HttpError(404, 'Menu item not found.');
  const used = await OrderItem.count({ where: { menuItemId: item.id } });
  if (used > 0) throw new HttpError(409, 'This item appears in past orders and cannot be deleted. Mark it as unavailable instead.');
  await item.destroy();
  res.status(200).json({ message: 'Menu item deleted.' });
});

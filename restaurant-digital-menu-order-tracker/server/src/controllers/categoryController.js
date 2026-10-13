const { Category, MenuItem } = require('../models');
const HttpError = require('../utils/HttpError');
const { asyncHandler } = require('../middleware/errorHandler');

const pick = (body) => ({ name: body.name, description: body.description });

exports.getAll = asyncHandler(async (req, res) => {
  const categories = await Category.findAll({ order: [['id', 'ASC']] });
  res.status(200).json(categories);
});

exports.getOne = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id, { include: [{ model: MenuItem, as: 'items' }] });
  if (!category) throw new HttpError(404, 'Category not found.');
  res.status(200).json(category);
});

exports.create = asyncHandler(async (req, res) => {
  const category = await Category.create(pick(req.body));
  res.status(201).json({ message: 'Category created.', data: category });
});

exports.update = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) throw new HttpError(404, 'Category not found.');
  await category.update(pick(req.body));
  res.status(200).json({ message: 'Category updated.', data: category });
});

exports.remove = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) throw new HttpError(404, 'Category not found.');
  const count = await MenuItem.count({ where: { categoryId: category.id } });
  if (count > 0) throw new HttpError(409, `Cannot delete: this category still has ${count} menu item(s). Move or delete them first.`);
  await category.destroy();
  res.status(200).json({ message: 'Category deleted.' });
});

'use strict';
// Inserts sample categories, menu items and orders. Run: npm run db:seed
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const t = (extra = {}) => ({ createdAt: now, updatedAt: now, ...extra });
    const img = (slug) => `/images/${slug}.svg`;

    await queryInterface.bulkInsert('Categories', [
      t({ id: 1, name: 'Starters', description: 'Small bites to begin your meal' }),
      t({ id: 2, name: 'Main Course', description: 'Hearty curries, rice and more' }),
      t({ id: 3, name: 'Desserts', description: 'Something sweet to finish' }),
      t({ id: 4, name: 'Beverages', description: 'Hot and cold drinks' }),
    ]);

    const item = (id, categoryId, name, description, price, slug, isVegetarian, isAvailable = true) =>
      t({ id, categoryId, name, description, price, imageUrl: img(slug), isVegetarian, isAvailable });

    await queryInterface.bulkInsert('MenuItems', [
      item(1, 1, 'Paneer Tikka', 'Char-grilled cottage cheese marinated in spices', 220, 'paneer-tikka', true),
      item(2, 1, 'Chicken 65', 'Crispy spicy fried chicken with curry leaves', 250, 'chicken-65', false),
      item(3, 1, 'Veg Spring Rolls', 'Crunchy rolls stuffed with vegetables', 160, 'spring-rolls', true),
      item(4, 2, 'Butter Chicken', 'Chicken in a creamy tomato-butter gravy', 340, 'butter-chicken', false),
      item(5, 2, 'Veg Biryani', 'Fragrant basmati rice cooked with vegetables', 260, 'veg-biryani', true),
      item(6, 2, 'Dal Tadka', 'Yellow lentils tempered with garlic and ghee', 180, 'dal-tadka', true),
      item(7, 2, 'Goan Fish Curry', 'Coconut-based fish curry (out of stock today)', 360, 'fish-curry', false, false),
      item(8, 3, 'Gulab Jamun', 'Warm milk dumplings in sugar syrup', 90, 'gulab-jamun', true),
      item(9, 3, 'Chocolate Brownie', 'Fudgy brownie with chocolate sauce', 120, 'brownie', true),
      item(10, 4, 'Masala Chai', 'Indian spiced milk tea', 40, 'masala-chai', true),
      item(11, 4, 'Fresh Lime Soda', 'Sweet or salted lime soda', 70, 'lime-soda', true),
      item(12, 4, 'Mango Lassi', 'Thick yogurt drink blended with mango', 90, 'mango-lassi', true),
    ]);

    await queryInterface.bulkInsert('Orders', [
      { id: 1, customerName: 'Rahul', tableNumber: 4, notes: null, totalAmount: 300, status: 'Pending', createdAt: now, updatedAt: now },
      { id: 2, customerName: 'Anita', tableNumber: 7, notes: 'Less spicy please', totalAmount: 600, status: 'Preparing', createdAt: now, updatedAt: now },
      { id: 3, customerName: 'Sam', tableNumber: 2, notes: null, totalAmount: 540, status: 'Completed', createdAt: yesterday, updatedAt: yesterday },
    ]);

    await queryInterface.bulkInsert('OrderItems', [
      t({ orderId: 1, menuItemId: 1, quantity: 1, unitPrice: 220, subtotal: 220 }),
      t({ orderId: 1, menuItemId: 10, quantity: 2, unitPrice: 40, subtotal: 80 }),
      t({ orderId: 2, menuItemId: 4, quantity: 1, unitPrice: 340, subtotal: 340 }),
      t({ orderId: 2, menuItemId: 5, quantity: 1, unitPrice: 260, subtotal: 260 }),
      { orderId: 3, menuItemId: 6, quantity: 2, unitPrice: 180, subtotal: 360, createdAt: yesterday, updatedAt: yesterday },
      { orderId: 3, menuItemId: 12, quantity: 2, unitPrice: 90, subtotal: 180, createdAt: yesterday, updatedAt: yesterday },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('MenuItems', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
  },
};

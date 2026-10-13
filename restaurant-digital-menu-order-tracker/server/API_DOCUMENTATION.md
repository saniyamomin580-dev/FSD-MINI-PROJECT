# REST API Documentation

Base URL: `http://localhost:5000/api` — all bodies are JSON.

**Admin routes** need the header `x-admin-key: <ADMIN_KEY from server/.env>`. Without it the API returns `401`.

**Status codes:** `200` OK · `201` Created · `400` Validation error · `401` Not logged in as admin · `404` Not found · `409` Conflict (duplicate, or record is in use) · `500` Server error.

**Error format:** `{ "message": "Validation failed", "errors": ["Price must be greater than 0."] }`
**Create/Update success format:** `{ "message": "...", "data": { ... } }`

## Auth
| Method | Route | Admin | Body | Responses |
|---|---|---|---|---|
| POST | `/auth/login` | no | `{ "password": "..." }` | 200 `{message}` · 401 wrong password |

## Categories
| Method | Route | Admin | Description |
|---|---|---|---|
| GET | `/categories` | no | List all → 200 array |
| GET | `/categories/:id` | no | One category with its menu items → 200 / 404 |
| POST | `/categories` | yes | Body `{ "name": "Soups", "description": "Hot soups" }` → 201 / 400 / 409 (duplicate name) |
| PUT | `/categories/:id` | yes | Same body → 200 / 404 / 400 |
| DELETE | `/categories/:id` | yes | 200 / 404 / 409 (category still has items) |

## Menu
| Method | Route | Admin | Description |
|---|---|---|---|
| GET | `/menu` | no | List. Query: `q` (name search), `categoryId`, `available` (true/false), `vegetarian` (true/false) |
| GET | `/menu/:id` | no | One item → 200 / 404 |
| POST | `/menu` | yes | Create → 201 / 400 |
| PUT | `/menu/:id` | yes | Update (partial allowed, e.g. `{ "isAvailable": false }`) → 200 / 404 / 400 |
| DELETE | `/menu/:id` | yes | 200 / 404 / 409 (item exists in past orders — mark unavailable instead) |

Create body:
```json
{ "name": "Veg Soup", "description": "Hot soup", "price": 120, "categoryId": 1,
  "imageUrl": "/images/placeholder.svg", "isVegetarian": true, "isAvailable": true }
```
Example `GET /api/menu?q=chicken&available=true` →
```json
[{ "id": 2, "name": "Chicken 65", "price": "250.00", "isVegetarian": false, "isAvailable": true,
   "categoryId": 1, "category": { "id": 1, "name": "Starters" } }]
```

## Orders
| Method | Route | Admin | Description |
|---|---|---|---|
| POST | `/orders` | no | Place an order (transaction). 201 / 400 |
| GET | `/orders` | yes | List. Query: `status` (Pending/Preparing/Ready/Completed), `date` (YYYY-MM-DD), `q` (customer name or order ID) |
| GET | `/orders/:id` | no | Order with items (used for tracking) → 200 / 400 / 404 |
| PATCH | `/orders/:id/status` | yes | Body `{ "status": "Preparing" }` → 200 / 400 / 404 |

Place order request (**no prices or totals** — the server uses database prices):
```json
{ "customerName": "Rahul", "tableNumber": 4, "notes": "No onions",
  "items": [ { "menuItemId": 1, "quantity": 2 }, { "menuItemId": 10, "quantity": 1 } ] }
```
Response `201`:
```json
{ "message": "Order placed successfully.",
  "data": { "id": 4, "customerName": "Rahul", "tableNumber": 4, "totalAmount": "480.00", "status": "Pending",
            "items": [ { "menuItemId": 1, "quantity": 2, "unitPrice": "220.00", "subtotal": "440.00",
                         "menuItem": { "id": 1, "name": "Paneer Tikka" } } ] } }
```
Rejected with `400` when: name < 2 chars, table not 1–100, empty items, quantity ≤ 0 / decimal / > 50, menu item missing or unavailable. If any step fails, nothing is saved (rollback).

## Dashboard & Reports (admin)
`GET /dashboard/stats` → 200
```json
{ "totalOrders": 3, "pendingOrders": 1, "preparingOrders": 1, "readyOrders": 0, "completedOrders": 1,
  "totalMenuItems": 12, "availableMenuItems": 11, "totalCategories": 4, "todaySales": 900 }
```
`GET /reports/daily-sales?date=2026-10-13` (date optional, default today; bad format → 400)
```json
{ "date": "2026-10-13", "totalOrders": 2, "totalSales": 900, "completedOrders": 0,
  "byStatus": [ { "status": "Pending", "orders": 1, "sales": 300 } ],
  "topItems": [ { "name": "Masala Chai", "quantitySold": 2, "revenue": 80 } ],
  "lastSevenDays": [ { "saleDate": "2026-10-12", "orders": 1, "sales": 540 } ] }
```
### How the report query works
It uses **parameterized raw SQL** through `sequelize.query()` with `replacements: { date }` and `QueryTypes.SELECT`. The `:date` placeholder is escaped by Sequelize, so SQL injection is not possible. Four queries run: (1) `COUNT`/`SUM` totals for the day, (2) `GROUP BY status`, (3) a 3-table `JOIN` (OrderItems → Orders → MenuItems) with `GROUP BY` and `ORDER BY ... LIMIT 5` for top-selling items, (4) a 7-day trend using `DATE_SUB` and `BETWEEN`.

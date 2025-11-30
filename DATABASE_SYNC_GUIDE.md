# Kimchuyy Agrivet - Database Sync Guide

## Database Name
**`kimchuyy_agrivet`**

## Current Configuration
- **Host**: 127.0.0.1 (localhost)
- **Port**: 3306
- **User**: root
- **Password**: (empty)
- **Database**: kimchuyy_agrivet

## Complete Schema Files

All schema files are located in: `scripts/001-database-schema.sql`

## Tables Created

### Core Tables
1. **users** - System users (admin/staff)
2. **categories** - Product categories
3. **products** - Inventory items with stock management
4. **customers** - Customer records
5. **sales** - Order header records
6. **sale_items** - Individual items in orders

### Support Tables
7. **suppliers** - Supplier information
8. **deliveries** - Supplier delivery records
9. **delivery_items** - Items in deliveries
10. **audit_logs** - Transaction audit trail

## Stored Procedures
1. **add_stock_in** - Increase product stock
2. **process_sale** - Record sale transaction
3. **deduct_stock** - Reduce product stock after sale

## Functions
1. **compute_subtotal** - Calculate line item subtotal
2. **compute_vat** - Calculate 12% VAT

## Triggers
1. **log_product_update** - Auto-log product changes

## Views
1. **low_stock_products** - Products below minimum stock
2. **expiring_products** - Products expiring within 30 days
3. **daily_sales_summary** - Daily sales aggregation

## Default Data
- **Categories**: Feeds, Medicine, Vitamins, Accessories, Others (5 categories)
- **Admin User**: 
  - Username: `admin`
  - Password Hash: `$2b$10$rQZ8K5Y5Y5Y5Y5Y5Y5Y5YuJ5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y`
  - Full Name: System Administrator
  - Role: admin

## Setup Instructions

### 1. Import Schema (phpMyAdmin or MySQL CLI)

**Option A: Using phpMyAdmin**
1. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
2. Go to "SQL" tab
3. Open file: `scripts/001-database-schema.sql`
4. Execute all queries

**Option B: Using MySQL CLI**
```bash
mysql -h 127.0.0.1 -u root < scripts/001-database-schema.sql
```

### 2. Verify Installation
Check that all tables exist:
```sql
USE kimchuyy_agrivet;
SHOW TABLES;
```

Expected tables (10):
- audit_logs
- categories
- customers
- deliveries
- delivery_items
- products
- sale_items
- sales
- suppliers
- users

### 3. Verify Default Data
```sql
SELECT * FROM users;           -- Should show 1 admin user
SELECT * FROM categories;      -- Should show 5 categories
```

## API Integration

All API endpoints sync with this database:

### Sales API
- `GET /api/sales` - List all sales
- `POST /api/sales` - Record new sale
- `GET /api/sales/[id]` - Get sale details
- `DELETE /api/sales/[id]` - Void sale

### Products API
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Archive product (soft delete)

### Customers API
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer details
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

## Real-Time Sync Features

### Sales Page
- Auto-refreshes every 5 seconds
- Shows new sales in real-time
- Search by customer, cashier, reference

### Inventory
- Stock updated automatically on sale
- View live inventory levels
- Track low-stock items via view

### Audit Trail
- All transactions logged with user_id, action, timestamp
- Historical record of all changes
- Accessible via audit_logs table

## Troubleshooting

### Issue: "Database does not exist"
**Solution**: Run `scripts/001-database-schema.sql` to create database

### Issue: "Table doesn't exist"
**Solution**: Check schema file was fully executed. Re-run CREATE TABLE statements for missing tables.

### Issue: "Column not found in field list"
**Solution**: Ensure all ALTER TABLE statements executed. Check audit_logs table has correct schema.

### Issue: Sales not appearing in API
**Solution**: 
1. Check sales table has data: `SELECT COUNT(*) FROM sales;`
2. Check for errors in console
3. Verify user_id exists: `SELECT * FROM users;`

## Performance Notes

- **Connection Pool**: 10 connections max (configurable in `/lib/db.ts`)
- **Query Timeout**: Default MySQL timeout applies
- **Real-Time Sync**: 5-second interval polling (can be adjusted in `/app/sales/page.tsx`)

## Security Considerations

- ⚠️ **Admin password**: Replace the default admin password hash in production
- 🔒 Use environment variables for database credentials (already in `.env`)
- 📝 Audit logs track all changes for compliance

## Next Steps

1. ✅ Import schema file into MySQL
2. ✅ Verify database connection working
3. ✅ Run dev server: `npm run dev`
4. ✅ Test POS checkout: should record to database
5. ✅ Verify sales appear in /sales page automatically

---
**Database Version**: 1.0.0  
**Last Updated**: November 30, 2025

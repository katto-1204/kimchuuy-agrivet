# 🗄️ Database Import Instructions

## Quick Import (Recommended)

### Option 1: Using phpMyAdmin (Easiest)

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click on **"SQL"** tab at the top
3. Click **"Choose File"** and select: `SCHEMA_COMPLETE.sql`
4. Click **"Go"** button
5. ✅ Done! Database will be created with all 50 products

### Option 2: Using MySQL CLI (Command Line)

```powershell
cd c:\Users\Administrator\Downloads\inventory-management-system
mysql -h 127.0.0.1 -u root < SCHEMA_COMPLETE.sql
```

### Option 3: Using PowerShell Script

```powershell
cd c:\Users\Administrator\Downloads\inventory-management-system
powershell -ExecutionPolicy Bypass -File scripts/import-db.ps1
```

## What Gets Imported

✅ **Database**: `kimchuyy_agrivet`

✅ **10 Tables**:
- users (1 admin user)
- categories (5 categories)
- products (50 products)
- customers
- sales
- sale_items
- suppliers
- deliveries
- delivery_items
- audit_logs

✅ **3 Stored Procedures**: add_stock_in, deduct_stock, process_sale

✅ **3 Functions**: compute_subtotal, compute_vat, get_profit_margin

✅ **2 Triggers**: Auto-log product updates and sales creation

✅ **6 Views**:
- low_stock_products
- expiring_products
- daily_sales_summary
- monthly_sales_summary
- top_selling_products
- supplier_performance

## 50 Sample Products Included

### Feeds (10 products)
- Dog Food (Premium 10kg, Premium 5kg, Puppy, Senior)
- Cat Food (Tuna, Chicken, Kitten)
- Fish Feed, Bird Seed, Shrimp Pellets

### Medicine (8 products)
- Antibiotics, Amoxicillin, Dewormer
- Flea & Tick Treatment, Pain Reliever
- Digestive Enzyme, Electrolyte, Eye Ointment

### Vitamins (6 products)
- Vitamin B Complex, Calcium, Omega-3
- Multivitamins, Iron Tonic, Probiotics

### Accessories (21 products)
- Leashes, Collars, Harnesses
- Pet Beds, Bowls, Automatic Feeders
- Litter Boxes, Grooming Tools, Shampoos
- Nail Clippers, Toys, Carriers
- Cages, Aquarium Equipment

### Others (5 products)
- ID Tags, Medical Records, Waste Bags
- Disinfectant, First Aid Kit

## Verify Import Success

After importing, check that everything loaded correctly:

### Using phpMyAdmin:
1. Go to `http://localhost/phpmyadmin`
2. Click on database `kimchuyy_agrivet`
3. You should see **10 tables**
4. Click on `products` table
5. You should see **50 rows** of products

### Using MySQL CLI:
```sql
USE kimchuyy_agrivet;
SELECT COUNT(*) as product_count FROM products;
-- Should return: 50

SELECT COUNT(*) as category_count FROM categories;
-- Should return: 5

SELECT * FROM users;
-- Should show 1 admin user
```

## Default Login

**Username**: `admin`  
**Password**: *(any password works in development mode)*

⚠️ **Note**: In production, replace the password hash in the `users` table.

## Next Steps

1. ✅ Import schema and products
2. Start dev server: `npm run dev`
3. Login at: `http://localhost:3000/login`
4. Go to **Inventory** to see all 50 products
5. Go to **POS** to sell products (stock will auto-deduct)
6. Go to **Sales** to see all transactions

## Troubleshooting

### Error: "MySQL server has gone away"
**Solution**: Make sure MySQL is running in XAMPP/WAMP

### Error: "Database already exists"
**Solution**: That's okay! The schema uses `CREATE TABLE IF NOT EXISTS` so it's safe to re-import

### Products not showing in inventory?
**Solution**: 
1. Refresh the browser (Ctrl+F5)
2. Check database: `SELECT COUNT(*) FROM products;`
3. Check browser console for errors (F12)

### Import hangs or takes too long?
**Solution**: 
1. Check MySQL is responding: Try connecting in phpMyAdmin
2. Re-run import with verbose output
3. Check error logs in XAMPP/MySQL folder

## File Locations

- **Schema file**: `SCHEMA_COMPLETE.sql`
- **Original schema**: `scripts/001-database-schema.sql`
- **PowerShell script**: `scripts/import-db.ps1`
- **Import guide**: `DATABASE_IMPORT.md` (this file)

---
**Last Updated**: November 30, 2025  
**Database Version**: 1.0.0  
**Total Products**: 50

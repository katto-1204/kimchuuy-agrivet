-- =====================================================
-- KIMCHUYY AGRIVET SUPPLY - COMPLETE DATABASE SCHEMA
-- Database: kimchuyy_agrivet
-- Version: 1.0.0
-- Last Updated: 2025-11-30
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS kimchuyy_agrivet;
USE kimchuyy_agrivet;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users Table (System Access Control)
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL COMMENT 'Login username',
  password_hash VARCHAR(255) NOT NULL COMMENT 'Hashed password',
  full_name VARCHAR(255) NOT NULL COMMENT 'User full name',
  role ENUM('admin','staff') NOT NULL DEFAULT 'staff' COMMENT 'User role/permission level',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Account status',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table (Product Classification)
CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Category name (Feeds, Medicine, etc)',
  description TEXT COMMENT 'Category description',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table (Inventory Items)
CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL COMMENT 'Reference to category',
  name VARCHAR(255) NOT NULL COMMENT 'Product name',
  description TEXT COMMENT 'Product description/details',
  sku VARCHAR(50) UNIQUE COMMENT 'Stock Keeping Unit code',
  price DECIMAL(10,2) NOT NULL COMMENT 'Selling price',
  cost_price DECIMAL(10,2) COMMENT 'Cost/purchase price',
  stock INT DEFAULT 0 COMMENT 'Current quantity on hand',
  min_stock INT DEFAULT 10 COMMENT 'Minimum stock threshold',
  expiry_date DATE COMMENT 'Product expiration date',
  is_archived BOOLEAN DEFAULT FALSE COMMENT 'Soft delete flag',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
  INDEX idx_sku (sku),
  INDEX idx_name (name),
  INDEX idx_stock (stock),
  INDEX idx_archived (is_archived),
  INDEX idx_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customers Table (Client Records)
CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'Customer name',
  phone VARCHAR(50) COMMENT 'Contact phone number',
  email VARCHAR(255) COMMENT 'Email address',
  address TEXT COMMENT 'Physical address',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_email (email),
  FULLTEXT INDEX ft_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sales Table (Order Header Records)
CREATE TABLE sales (
  sale_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT 'Reference to cashier/user',
  customer_id INT COMMENT 'Reference to customer (nullable for walk-in)',
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Transaction timestamp',
  subtotal DECIMAL(10,2) COMMENT 'Sum of all items before discount',
  discount DECIMAL(10,2) DEFAULT 0 COMMENT 'Discount amount applied',
  vat DECIMAL(10,2) DEFAULT 0 COMMENT 'Value Added Tax (12%)',
  total DECIMAL(10,2) COMMENT 'Final total after discount and VAT',
  amount_paid DECIMAL(10,2) COMMENT 'Cash/payment received',
  change_amount DECIMAL(10,2) COMMENT 'Change to give customer',
  payment_method ENUM('Cash','GCash','Maya','Bank Transfer') DEFAULT 'Cash' COMMENT 'Payment method used',
  reference_number VARCHAR(100) COMMENT 'Reference ID (e.g., GCash txn ID)',
  is_voided BOOLEAN DEFAULT FALSE COMMENT 'Void/cancel status',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_customer (customer_id),
  INDEX idx_sale_date (sale_date),
  INDEX idx_voided (is_voided),
  INDEX idx_payment_method (payment_method)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sale Items Table (Order Line Items)
CREATE TABLE sale_items (
  sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL COMMENT 'Reference to sales header',
  product_id INT NOT NULL COMMENT 'Reference to product',
  quantity INT NOT NULL COMMENT 'Quantity purchased',
  unit_price DECIMAL(10,2) COMMENT 'Price per unit at time of sale',
  subtotal DECIMAL(10,2) COMMENT 'Line item total (quantity × unit_price)',
  FOREIGN KEY (sale_id) REFERENCES sales(sale_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
  INDEX idx_sale (sale_id),
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SUPPLY CHAIN TABLES
-- =====================================================

-- Suppliers Table (Vendor/Supplier Information)
CREATE TABLE suppliers (
  supplier_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT 'Supplier company name',
  contact_person VARCHAR(255) COMMENT 'Contact person name',
  phone VARCHAR(50) COMMENT 'Contact phone',
  email VARCHAR(255) COMMENT 'Contact email',
  address TEXT COMMENT 'Supplier address',
  is_active BOOLEAN DEFAULT TRUE COMMENT 'Active supplier status',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Deliveries Table (Purchase Order/Delivery Records)
CREATE TABLE deliveries (
  delivery_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL COMMENT 'Reference to supplier',
  user_id INT NOT NULL COMMENT 'Reference to staff member',
  delivery_date DATE NOT NULL COMMENT 'Date of delivery received',
  reference_number VARCHAR(100) COMMENT 'PO or invoice number',
  notes TEXT COMMENT 'Delivery notes/comments',
  total_amount DECIMAL(10,2) COMMENT 'Total delivery cost',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
  INDEX idx_supplier (supplier_id),
  INDEX idx_delivery_date (delivery_date),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Delivery Items Table (Items in Each Delivery)
CREATE TABLE delivery_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  delivery_id INT NOT NULL COMMENT 'Reference to delivery',
  product_id INT NOT NULL COMMENT 'Reference to product',
  quantity INT NOT NULL COMMENT 'Quantity received',
  unit_cost DECIMAL(10,2) COMMENT 'Cost per unit',
  FOREIGN KEY (delivery_id) REFERENCES deliveries(delivery_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
  INDEX idx_delivery (delivery_id),
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AUDIT & COMPLIANCE TABLE
-- =====================================================

-- Audit Logs Table (Transaction Audit Trail)
CREATE TABLE audit_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT 'User who performed action',
  action VARCHAR(100) NOT NULL COMMENT 'Action performed (CREATE, UPDATE, DELETE)',
  table_name VARCHAR(100) COMMENT 'Table affected',
  record_id INT COMMENT 'ID of affected record',
  old_values JSON COMMENT 'Previous values (for updates)',
  new_values JSON COMMENT 'New values (for updates)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_table (table_name),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure: Add Stock (Increase Inventory)
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS add_stock_in (
  IN p_product_id INT,
  IN p_quantity INT
)
COMMENT 'Increase product stock (for deliveries, returns, etc)'
BEGIN
  START TRANSACTION;
  UPDATE products
  SET stock = stock + p_quantity,
      updated_at = CURRENT_TIMESTAMP
  WHERE product_id = p_product_id;
  COMMIT;
END $$
DELIMITER ;

-- Procedure: Deduct Stock (Decrease Inventory)
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS deduct_stock (
  IN p_product_id INT,
  IN p_quantity INT
)
COMMENT 'Decrease product stock (for sales)'
BEGIN
  START TRANSACTION;
  UPDATE products
  SET stock = stock - p_quantity,
      updated_at = CURRENT_TIMESTAMP
  WHERE product_id = p_product_id
    AND stock >= p_quantity;
  COMMIT;
END $$
DELIMITER ;

-- Procedure: Process Sale
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS process_sale (
  IN p_user_id INT,
  IN p_customer_id INT,
  IN p_subtotal DECIMAL(10,2),
  IN p_discount DECIMAL(10,2),
  IN p_vat DECIMAL(10,2),
  IN p_total DECIMAL(10,2),
  IN p_amount_paid DECIMAL(10,2),
  IN p_payment_method VARCHAR(50),
  OUT p_sale_id INT
)
COMMENT 'Process and record a complete sale transaction'
BEGIN
  START TRANSACTION;
  
  INSERT INTO sales (
    user_id, customer_id, subtotal, discount, vat, total, 
    amount_paid, change_amount, payment_method
  )
  VALUES (
    p_user_id, p_customer_id, p_subtotal, p_discount, p_vat, 
    p_total, p_amount_paid, p_amount_paid - p_total, p_payment_method
  );
  
  SET p_sale_id = LAST_INSERT_ID();
  COMMIT;
END $$
DELIMITER ;

-- =====================================================
-- STORED FUNCTIONS
-- =====================================================

-- Function: Compute Subtotal
DELIMITER $$
CREATE FUNCTION IF NOT EXISTS compute_subtotal (
  p_price DECIMAL(10,2), 
  p_qty INT
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
COMMENT 'Calculate line item subtotal'
BEGIN
  RETURN p_price * p_qty;
END $$
DELIMITER ;

-- Function: Compute VAT (12% for Philippines)
DELIMITER $$
CREATE FUNCTION IF NOT EXISTS compute_vat (
  p_amount DECIMAL(10,2)
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
COMMENT 'Calculate 12% VAT'
BEGIN
  RETURN p_amount * 0.12;
END $$
DELIMITER ;

-- Function: Get Product Profit Margin
DELIMITER $$
CREATE FUNCTION IF NOT EXISTS get_profit_margin (
  p_product_id INT
)
RETURNS DECIMAL(5,2)
DETERMINISTIC
READS SQL DATA
COMMENT 'Calculate profit margin percentage for a product'
BEGIN
  DECLARE v_price DECIMAL(10,2);
  DECLARE v_cost DECIMAL(10,2);
  DECLARE v_margin DECIMAL(5,2);
  
  SELECT price, cost_price INTO v_price, v_cost
  FROM products WHERE product_id = p_product_id;
  
  IF v_cost IS NULL OR v_cost = 0 THEN
    SET v_margin = 0;
  ELSE
    SET v_margin = ((v_price - v_cost) / v_price) * 100;
  END IF;
  
  RETURN v_margin;
END $$
DELIMITER ;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Log Product Updates
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS log_product_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
  IF OLD.stock <> NEW.stock OR OLD.price <> NEW.price THEN
    INSERT INTO audit_logs (
      user_id, action, table_name, record_id, 
      old_values, new_values
    )
    VALUES (
      1, 'UPDATE', 'products', NEW.product_id,
      JSON_OBJECT(
        'stock', OLD.stock, 
        'price', OLD.price,
        'updated_at', OLD.updated_at
      ),
      JSON_OBJECT(
        'stock', NEW.stock, 
        'price', NEW.price,
        'updated_at', NEW.updated_at
      )
    );
  END IF;
END $$
DELIMITER ;

-- Trigger: Log Sales Creation
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS log_sales_create
AFTER INSERT ON sales
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (
    user_id, action, table_name, record_id, new_values
  )
  VALUES (
    NEW.user_id, 'CREATE', 'sales', NEW.sale_id,
    JSON_OBJECT(
      'total', NEW.total,
      'payment_method', NEW.payment_method,
      'sale_date', NEW.sale_date
    )
  );
END $$
DELIMITER ;

-- =====================================================
-- VIEWS
-- =====================================================

-- View: Low Stock Products
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
  p.product_id,
  p.name,
  p.sku,
  p.stock,
  p.min_stock,
  (p.min_stock - p.stock) as shortage,
  c.name as category_name,
  p.price
FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE p.stock <= p.min_stock 
  AND p.is_archived = FALSE
ORDER BY shortage DESC;

-- View: Expiring Products (within 30 days)
CREATE OR REPLACE VIEW expiring_products AS
SELECT 
  p.product_id,
  p.name,
  p.sku,
  p.expiry_date,
  DATEDIFF(p.expiry_date, CURDATE()) as days_until_expiry,
  c.name as category_name,
  p.stock
FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE p.expiry_date IS NOT NULL 
  AND p.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
  AND p.is_archived = FALSE
ORDER BY p.expiry_date ASC;

-- View: Daily Sales Summary
CREATE OR REPLACE VIEW daily_sales_summary AS
SELECT 
  DATE(sale_date) as sale_day,
  COUNT(*) as total_transactions,
  SUM(total) as total_sales,
  SUM(discount) as total_discounts,
  SUM(vat) as total_vat,
  COUNT(DISTINCT customer_id) as unique_customers
FROM sales
WHERE is_voided = FALSE
GROUP BY DATE(sale_date)
ORDER BY sale_day DESC;

-- View: Monthly Sales Summary
CREATE OR REPLACE VIEW monthly_sales_summary AS
SELECT 
  DATE_FORMAT(sale_date, '%Y-%m') as sale_month,
  COUNT(*) as total_transactions,
  SUM(total) as total_sales,
  AVG(total) as avg_transaction,
  COUNT(DISTINCT customer_id) as unique_customers
FROM sales
WHERE is_voided = FALSE
GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
ORDER BY sale_month DESC;

-- View: Top Selling Products
CREATE OR REPLACE VIEW top_selling_products AS
SELECT 
  p.product_id,
  p.name,
  p.sku,
  SUM(si.quantity) as total_qty_sold,
  SUM(si.subtotal) as total_revenue,
  COUNT(DISTINCT si.sale_id) as num_transactions,
  ROUND(SUM(si.subtotal) / SUM(si.quantity), 2) as avg_price
FROM products p
JOIN sale_items si ON p.product_id = si.product_id
JOIN sales s ON si.sale_id = s.sale_id
WHERE s.is_voided = FALSE
  AND si.quantity > 0
GROUP BY p.product_id
ORDER BY total_revenue DESC
LIMIT 50;

-- View: Supplier Performance
CREATE OR REPLACE VIEW supplier_performance AS
SELECT 
  s.supplier_id,
  s.name,
  COUNT(d.delivery_id) as total_deliveries,
  COUNT(DISTINCT di.product_id) as product_variety,
  SUM(di.quantity) as total_items_received,
  SUM(d.total_amount) as total_spent,
  AVG(d.total_amount) as avg_delivery_amount
FROM suppliers s
LEFT JOIN deliveries d ON s.supplier_id = d.supplier_id
LEFT JOIN delivery_items di ON d.delivery_id = di.delivery_id
WHERE s.is_active = TRUE
GROUP BY s.supplier_id
ORDER BY total_spent DESC;

-- =====================================================
-- DEFAULT DATA
-- =====================================================

-- Insert Default Categories
INSERT IGNORE INTO categories (category_id, name, description) VALUES
(1, 'Feeds', 'Animal feeds and food products'),
(2, 'Medicine', 'Veterinary medicines and treatments'),
(3, 'Vitamins', 'Supplements and vitamins'),
(4, 'Accessories', 'Pet and farm accessories'),
(5, 'Others', 'Miscellaneous items');

-- Insert Default Admin User
-- Username: admin
-- Password Hash: $2b$10$rQZ8K5Y5Y5Y5Y5Y5Y5Y5YuJ5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y (replace in production)
INSERT IGNORE INTO users (user_id, username, password_hash, full_name, role, is_active) VALUES
(1, 'admin', '$2b$10$rQZ8K5Y5Y5Y5Y5Y5Y5Y5YuJ5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', 'System Administrator', 'admin', TRUE);

-- =====================================================
-- INSERT SAMPLE PRODUCTS
-- =====================================================

INSERT IGNORE INTO products (product_id, category_id, name, description, sku, price, cost_price, stock, min_stock, expiry_date, is_archived) VALUES
-- Feeds (Category 1)
(1, 1, 'Premium Dog Food 10kg', 'High-quality complete dog food for all ages', 'DF-PREM-10', 1250.00, 800.00, 45, 10, DATE_ADD(CURDATE(), INTERVAL 365 DAY), FALSE),
(2, 1, 'Premium Dog Food 5kg', 'High-quality complete dog food for all ages', 'DF-PREM-5', 680.00, 420.00, 78, 15, DATE_ADD(CURDATE(), INTERVAL 365 DAY), FALSE),
(3, 1, 'Puppy Formula 5kg', 'Specially formulated for growing puppies', 'DF-PUP-5', 750.00, 450.00, 32, 8, DATE_ADD(CURDATE(), INTERVAL 365 DAY), FALSE),
(4, 1, 'Senior Dog Food 5kg', 'Low-fat formula for senior dogs', 'DF-SEN-5', 800.00, 500.00, 25, 5, DATE_ADD(CURDATE(), INTERVAL 365 DAY), FALSE),
(5, 1, 'Cat Food Tuna 5kg', 'Premium cat food with tuna flavor', 'CF-TUN-5', 620.00, 380.00, 52, 12, DATE_ADD(CURDATE(), INTERVAL 365 DAY), FALSE),
(6, 1, 'Cat Food Chicken 5kg', 'Premium cat food with chicken flavor', 'CF-CHK-5', 620.00, 380.00, 48, 10, DATE_ADD(CURDATE(), INTERVAL 365 DAY), FALSE),
(7, 1, 'Kitten Formula 2kg', 'Specially formulated for kittens', 'CF-KIT-2', 450.00, 280.00, 35, 8, DATE_ADD(CURDATE(), INTERVAL 365 DAY), FALSE),
(8, 1, 'Fish Feed Premium 1kg', 'Complete nutrition for ornamental fish', 'FF-PREM-1', 280.00, 150.00, 60, 15, DATE_ADD(CURDATE(), INTERVAL 180 DAY), FALSE),
(9, 1, 'Bird Seed Mix 2kg', 'Mixed seed for various bird species', 'BS-MIX-2', 320.00, 180.00, 42, 10, DATE_ADD(CURDATE(), INTERVAL 180 DAY), FALSE),
(10, 1, 'Pet Shrimp Pellets 500g', 'High-protein pellets for shrimp', 'SH-PELL-500', 350.00, 200.00, 28, 5, DATE_ADD(CURDATE(), INTERVAL 180 DAY), FALSE),

-- Medicine (Category 2)
(11, 2, 'Antibiotic Injectable 50ml', 'Broad-spectrum antibiotic', 'MED-ANT-50', 850.00, 500.00, 15, 3, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(12, 2, 'Amoxicillin Powder 250g', 'Amoxicillin powder for oral use', 'MED-AMX-250', 450.00, 250.00, 22, 5, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(13, 2, 'Dewormer Tablets 100ct', 'Effective dewormer for pets', 'MED-DEW-100', 380.00, 200.00, 38, 8, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(14, 2, 'Flea & Tick Treatment 100ml', 'Topical treatment for fleas and ticks', 'MED-FLT-100', 950.00, 600.00, 25, 5, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(15, 2, 'Pain Reliever Injection 20ml', 'Injectable pain relief for animals', 'MED-PAIN-20', 520.00, 300.00, 18, 3, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(16, 2, 'Digestive Enzyme Powder 200g', 'Aids digestion in pets', 'MED-DIG-200', 680.00, 400.00, 12, 2, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(17, 2, 'Electrolyte Solution 500ml', 'Rehydration solution for sick animals', 'MED-ELEC-500', 420.00, 250.00, 30, 5, DATE_ADD(CURDATE(), INTERVAL 365 DAY), FALSE),
(18, 2, 'Eye Ointment 10g', 'Antibiotic eye ointment for pets', 'MED-EYE-10', 280.00, 150.00, 24, 3, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),

-- Vitamins (Category 3)
(19, 3, 'Vitamin B Complex 250ml', 'Essential B vitamins for pet health', 'VIT-B-250', 520.00, 300.00, 35, 8, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(20, 3, 'Calcium Supplement 500g', 'Bone and teeth development', 'VIT-CAL-500', 680.00, 400.00, 28, 5, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(21, 3, 'Omega-3 Supplement 200ml', 'Heart and skin health supplement', 'VIT-OMG-200', 850.00, 500.00, 22, 4, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(22, 3, 'Multivitamin Tablets 100ct', 'Complete vitamin formula', 'VIT-MULT-100', 420.00, 250.00, 45, 10, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(23, 3, 'Iron Tonic 250ml', 'Iron supplement for anemic pets', 'VIT-IRN-250', 580.00, 350.00, 18, 3, DATE_ADD(CURDATE(), INTERVAL 730 DAY), FALSE),
(24, 3, 'Probiotic Powder 100g', 'Beneficial bacteria for gut health', 'VIT-PROB-100', 750.00, 450.00, 15, 2, DATE_ADD(CURDATE(), INTERVAL 365 DAY), FALSE),

-- Accessories (Category 4)
(25, 4, 'Dog Leash 2m Standard', 'Durable nylon dog leash', 'ACC-LEASH-2', 180.00, 100.00, 120, 20, NULL, FALSE),
(26, 4, 'Dog Collar M size', 'Adjustable nylon dog collar', 'ACC-COLL-M', 150.00, 80.00, 95, 15, NULL, FALSE),
(27, 4, 'Dog Collar L size', 'Adjustable nylon dog collar large', 'ACC-COLL-L', 180.00, 100.00, 75, 10, NULL, FALSE),
(28, 4, 'Cat Harness Small', 'Soft cat harness with strap', 'ACC-HARN-S', 220.00, 120.00, 42, 8, NULL, FALSE),
(29, 4, 'Pet Bed Comfort 80x60cm', 'Orthopedic pet bed', 'ACC-BED-80', 1200.00, 700.00, 18, 3, NULL, FALSE),
(30, 4, 'Pet Water Bowl Stainless 2L', 'Non-slip water bowl', 'ACC-BOWL-2', 280.00, 150.00, 85, 15, NULL, FALSE),
(31, 4, 'Pet Food Bowl Stainless 3L', 'Heavy-duty food bowl', 'ACC-FBOWL-3', 320.00, 180.00, 72, 10, NULL, FALSE),
(32, 4, 'Pet Feeder Automatic 3kg', 'Automatic timed pet feeder', 'ACC-FEED-3', 2500.00, 1500.00, 12, 2, NULL, FALSE),
(33, 4, 'Litter Box Large', 'Covered litter box for cats', 'ACC-LITTER-L', 680.00, 400.00, 28, 5, NULL, FALSE),
(34, 4, 'Litter Sand 10kg', 'Premium clumping litter', 'ACC-LIT-10', 380.00, 200.00, 52, 10, NULL, FALSE),
(35, 4, 'Poop Scoop with Bag Dispenser', 'Portable poop scoop', 'ACC-SCOOP', 120.00, 60.00, 145, 20, NULL, FALSE),
(36, 4, 'Pet Grooming Brush Medium', 'Soft grooming brush', 'ACC-BRUSH-M', 280.00, 150.00, 68, 10, NULL, FALSE),
(37, 4, 'Pet Shampoo Dog 500ml', 'Gentle dog shampoo', 'ACC-SHAMP-D', 380.00, 200.00, 55, 10, NULL, FALSE),
(38, 4, 'Pet Shampoo Cat 500ml', 'Gentle cat shampoo', 'ACC-SHAMP-C', 420.00, 250.00, 42, 8, NULL, FALSE),
(39, 4, 'Pet Nail Clipper Stainless', 'Professional nail clipper', 'ACC-NAIL', 280.00, 150.00, 35, 5, NULL, FALSE),
(40, 4, 'Toy Ball Set 5pc', 'Colorful ball toys for pets', 'ACC-TOY-BALL', 180.00, 100.00, 110, 15, NULL, FALSE),
(41, 4, 'Rope Toy Chew', 'Durable rope chew toy', 'ACC-TOY-ROPE', 140.00, 75.00, 95, 15, NULL, FALSE),
(42, 4, 'Pet Carrier Soft 50x30x30', 'Portable pet carrier', 'ACC-CARRIER', 950.00, 550.00, 22, 3, NULL, FALSE),
(43, 4, 'Pet Cage Wire 120x60x60', 'Large wire cage for birds/rabbits', 'ACC-CAGE-120', 1800.00, 1000.00, 8, 1, NULL, FALSE),
(44, 4, 'Aquarium Filter 50L', 'Internal filter for aquarium', 'ACC-FILTER-50', 580.00, 350.00, 15, 2, NULL, FALSE),
(45, 4, 'Aquarium Heater 200W', 'Submersible aquarium heater', 'ACC-HEAT-200', 420.00, 250.00, 18, 3, NULL, FALSE),

-- Others (Category 5)
(46, 5, 'Pet ID Tag Brass', 'Personalized pet ID tag', 'OTH-ID-BRASS', 80.00, 40.00, 200, 30, NULL, FALSE),
(47, 5, 'Pet Medical Record Book', 'Vaccination and health record book', 'OTH-MED-REC', 120.00, 60.00, 85, 15, NULL, FALSE),
(48, 5, 'Pet Waste Bags 100ct', 'Degradable waste bags', 'OTH-BAGS-100', 95.00, 50.00, 320, 50, NULL, FALSE),
(49, 5, 'Disinfectant Spray 500ml', 'Pet-safe disinfectant', 'OTH-DISINFECT', 280.00, 150.00, 42, 8, NULL, FALSE),
(50, 5, 'First Aid Kit Pet', 'Complete pet first aid kit', 'OTH-FIRSTAID', 680.00, 400.00, 12, 2, NULL, FALSE);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Create composite indexes for common queries
ALTER TABLE sales ADD INDEX idx_user_date (user_id, sale_date);
ALTER TABLE sales ADD INDEX idx_payment_date (payment_method, sale_date);
ALTER TABLE sale_items ADD INDEX idx_sale_product (sale_id, product_id);
ALTER TABLE products ADD INDEX idx_category_archived (category_id, is_archived);
ALTER TABLE audit_logs ADD INDEX idx_user_action_date (user_id, action, created_at);

-- =====================================================
-- DATABASE COMPLETE
-- =====================================================

-- Summary Statistics
SELECT 'Database Setup Complete!' as status;
SELECT 
  'Database: ' || DATABASE() as info,
  COUNT(*) as total_tables
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE();

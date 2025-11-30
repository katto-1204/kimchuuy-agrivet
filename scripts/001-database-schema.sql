-- Kimchuyy Agrivet Supply - Database Schema
-- Run this in phpMyAdmin (XAMPP)

CREATE DATABASE IF NOT EXISTS kimchuyy_agrivet;
USE kimchuyy_agrivet;

-- Users Table
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin','staff') NOT NULL DEFAULT 'staff',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sku VARCHAR(50) UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  stock INT DEFAULT 0,
  min_stock INT DEFAULT 10,
  expiry_date DATE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Suppliers Table
CREATE TABLE suppliers (
  supplier_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deliveries Table
CREATE TABLE deliveries (
  delivery_id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  user_id INT NOT NULL,
  delivery_date DATE NOT NULL,
  reference_number VARCHAR(100),
  notes TEXT,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Delivery Items Table
CREATE TABLE delivery_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  delivery_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_cost DECIMAL(10,2),
  FOREIGN KEY (delivery_id) REFERENCES deliveries(delivery_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Customers Table
CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Table
CREATE TABLE sales (
  sale_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  customer_id INT,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subtotal DECIMAL(10,2),
  discount DECIMAL(10,2) DEFAULT 0,
  vat DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2),
  amount_paid DECIMAL(10,2),
  change_amount DECIMAL(10,2),
  payment_method ENUM('Cash','GCash','Maya','Bank Transfer') DEFAULT 'Cash',
  reference_number VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Sale Items Table
CREATE TABLE sale_items (
  sale_item_id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2),
  subtotal DECIMAL(10,2),
  FOREIGN KEY (sale_id) REFERENCES sales(sale_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id INT,
  old_values JSON,
  new_values JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Insert Default Categories
INSERT INTO categories (name, description) VALUES
('Feeds', 'Animal feeds and food products'),
('Medicine', 'Veterinary medicines and treatments'),
('Vitamins', 'Supplements and vitamins'),
('Accessories', 'Pet and farm accessories'),
('Others', 'Miscellaneous items');

-- Insert Default Admin User (password: admin123)
INSERT INTO users (username, password_hash, full_name, role) VALUES
('admin', '$2b$10$rQZ8K5Y5Y5Y5Y5Y5Y5Y5YuJ5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', 'System Administrator', 'admin');

-- Stored Procedure: Add Stock
DELIMITER $$
CREATE PROCEDURE add_stock_in (
  IN p_product_id INT,
  IN p_quantity INT
)
BEGIN
  START TRANSACTION;
  UPDATE products
  SET stock = stock + p_quantity,
      updated_at = CURRENT_TIMESTAMP
  WHERE product_id = p_product_id;
  COMMIT;
END $$
DELIMITER ;

-- Stored Procedure: Process Sale
DELIMITER $$
CREATE PROCEDURE process_sale (
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
BEGIN
  START TRANSACTION;
  INSERT INTO sales (user_id, customer_id, subtotal, discount, vat, total, amount_paid, change_amount, payment_method)
  VALUES (p_user_id, p_customer_id, p_subtotal, p_discount, p_vat, p_total, p_amount_paid, p_amount_paid - p_total, p_payment_method);
  SET p_sale_id = LAST_INSERT_ID();
  COMMIT;
END $$
DELIMITER ;

-- Stored Procedure: Deduct Stock After Sale
DELIMITER $$
CREATE PROCEDURE deduct_stock (
  IN p_product_id INT,
  IN p_quantity INT
)
BEGIN
  START TRANSACTION;
  UPDATE products
  SET stock = stock - p_quantity,
      updated_at = CURRENT_TIMESTAMP
  WHERE product_id = p_product_id;
  COMMIT;
END $$
DELIMITER ;

-- Function: Compute Subtotal
DELIMITER $$
CREATE FUNCTION compute_subtotal (p_price DECIMAL(10,2), p_qty INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  RETURN p_price * p_qty;
END $$
DELIMITER ;

-- Function: Compute VAT (12%)
DELIMITER $$
CREATE FUNCTION compute_vat (p_amount DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  RETURN p_amount * 0.12;
END $$
DELIMITER ;

-- Trigger: Log Product Changes
DELIMITER $$
CREATE TRIGGER log_product_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (1, 'UPDATE', 'products', NEW.product_id, 
    JSON_OBJECT('stock', OLD.stock, 'price', OLD.price),
    JSON_OBJECT('stock', NEW.stock, 'price', NEW.price));
END $$
DELIMITER ;

-- View: Low Stock Products
CREATE VIEW low_stock_products AS
SELECT p.*, c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE p.stock <= p.min_stock AND p.is_archived = FALSE;

-- View: Expiring Products (within 30 days)
CREATE VIEW expiring_products AS
SELECT p.*, c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE p.expiry_date IS NOT NULL 
  AND p.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
  AND p.is_archived = FALSE;

-- View: Daily Sales Summary
CREATE VIEW daily_sales_summary AS
SELECT 
  DATE(sale_date) as sale_day,
  COUNT(*) as total_transactions,
  SUM(total) as total_sales,
  SUM(discount) as total_discounts
FROM sales
GROUP BY DATE(sale_date)
ORDER BY sale_day DESC;

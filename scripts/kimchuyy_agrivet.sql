-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2025 at 05:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kimchuyy_agrivet`
--
CREATE DATABASE IF NOT EXISTS `kimchuyy_agrivet` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `kimchuyy_agrivet`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `add_stock_in`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_stock_in` (IN `p_product_id` INT, IN `p_quantity` INT)   BEGIN
  START TRANSACTION;
  UPDATE products
  SET stock = stock + p_quantity,
      updated_at = CURRENT_TIMESTAMP
  WHERE product_id = p_product_id;
  COMMIT;
END$$

DROP PROCEDURE IF EXISTS `deduct_stock`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `deduct_stock` (IN `p_product_id` INT, IN `p_quantity` INT)   BEGIN
  START TRANSACTION;
  UPDATE products
  SET stock = stock - p_quantity,
      updated_at = CURRENT_TIMESTAMP
  WHERE product_id = p_product_id;
  COMMIT;
END$$

DROP PROCEDURE IF EXISTS `process_sale`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `process_sale` (IN `p_user_id` INT, IN `p_customer_id` INT, IN `p_subtotal` DECIMAL(10,2), IN `p_discount` DECIMAL(10,2), IN `p_vat` DECIMAL(10,2), IN `p_total` DECIMAL(10,2), IN `p_amount_paid` DECIMAL(10,2), IN `p_payment_method` VARCHAR(50), OUT `p_sale_id` INT)   BEGIN
  START TRANSACTION;
  INSERT INTO sales (user_id, customer_id, subtotal, discount, vat, total, amount_paid, change_amount, payment_method)
  VALUES (p_user_id, p_customer_id, p_subtotal, p_discount, p_vat, p_total, p_amount_paid, p_amount_paid - p_total, p_payment_method);
  SET p_sale_id = LAST_INSERT_ID();
  COMMIT;
END$$

--
-- Functions
--
DROP FUNCTION IF EXISTS `compute_subtotal`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `compute_subtotal` (`p_price` DECIMAL(10,2), `p_qty` INT) RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN
  RETURN p_price * p_qty;
END$$

DROP FUNCTION IF EXISTS `compute_vat`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `compute_vat` (`p_amount` DECIMAL(10,2)) RETURNS DECIMAL(10,2) DETERMINISTIC BEGIN
  RETURN p_amount * 0.12;
END$$

DROP FUNCTION IF EXISTS `get_profit_margin`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `get_profit_margin` (`p_product_id` INT) RETURNS DECIMAL(5,2) DETERMINISTIC READS SQL DATA COMMENT 'Calculate profit margin percentage for a product' BEGIN
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
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`log_id`, `user_id`, `action`, `table_name`, `record_id`, `old_values`, `new_values`, `created_at`) VALUES
(1, 1, 'CREATE', 'sales', 1, NULL, '{\"total\": 1960.00, \"payment_method\": \"Cash\", \"sale_date\": \"2025-11-30 21:47:54\"}', '2025-11-30 13:47:54'),
(2, 1, 'UPDATE', 'products', 24, '{\"stock\": 15, \"price\": 750.00}', '{\"stock\": 14, \"price\": 750.00}', '2025-11-30 13:47:54'),
(3, 1, 'UPDATE', 'products', 23, '{\"stock\": 18, \"price\": 580.00}', '{\"stock\": 17, \"price\": 580.00}', '2025-11-30 13:47:54'),
(4, 1, 'UPDATE', 'products', 22, '{\"stock\": 45, \"price\": 420.00}', '{\"stock\": 44, \"price\": 420.00}', '2025-11-30 13:47:54'),
(14, 1, 'CREATE', 'sales', 3, NULL, '{\"total\": 3684.80, \"payment_method\": \"GCash\", \"sale_date\": \"2025-11-30 21:57:45\"}', '2025-11-30 13:57:45'),
(15, 1, 'UPDATE', 'products', 50, '{\"stock\": 12, \"price\": 680.00}', '{\"stock\": 11, \"price\": 680.00}', '2025-11-30 13:57:45'),
(16, 1, 'UPDATE', 'products', 47, '{\"stock\": 85, \"price\": 120.00}', '{\"stock\": 84, \"price\": 120.00}', '2025-11-30 13:57:45'),
(17, 1, 'UPDATE', 'products', 46, '{\"stock\": 200, \"price\": 80.00}', '{\"stock\": 199, \"price\": 80.00}', '2025-11-30 13:57:45'),
(18, 1, 'UPDATE', 'products', 42, '{\"stock\": 22, \"price\": 950.00}', '{\"stock\": 21, \"price\": 950.00}', '2025-11-30 13:57:45'),
(19, 1, 'UPDATE', 'products', 44, '{\"stock\": 15, \"price\": 580.00}', '{\"stock\": 14, \"price\": 580.00}', '2025-11-30 13:57:45'),
(20, 1, 'UPDATE', 'products', 45, '{\"stock\": 18, \"price\": 420.00}', '{\"stock\": 17, \"price\": 420.00}', '2025-11-30 13:57:45'),
(21, 1, 'UPDATE', 'products', 40, '{\"stock\": 110, \"price\": 180.00}', '{\"stock\": 109, \"price\": 180.00}', '2025-11-30 13:57:45'),
(22, 1, 'UPDATE', 'products', 39, '{\"stock\": 35, \"price\": 280.00}', '{\"stock\": 34, \"price\": 280.00}', '2025-11-30 13:57:45'),
(23, 1, 'CREATE', 'sales', 3, NULL, NULL, '2025-11-30 13:57:45'),
(24, 1, 'CREATE', 'sales', 4, NULL, '{\"total\": 1416.80, \"payment_method\": \"Maya\", \"sale_date\": \"2025-11-30 22:19:54\"}', '2025-11-30 14:19:54'),
(25, 1, 'UPDATE', 'products', 48, '{\"stock\": 320, \"price\": 95.00}', '{\"stock\": 319, \"price\": 95.00}', '2025-11-30 14:19:54'),
(26, 1, 'UPDATE', 'products', 46, '{\"stock\": 199, \"price\": 80.00}', '{\"stock\": 198, \"price\": 80.00}', '2025-11-30 14:19:54'),
(27, 1, 'UPDATE', 'products', 42, '{\"stock\": 21, \"price\": 950.00}', '{\"stock\": 20, \"price\": 950.00}', '2025-11-30 14:19:54'),
(28, 1, 'UPDATE', 'products', 41, '{\"stock\": 95, \"price\": 140.00}', '{\"stock\": 94, \"price\": 140.00}', '2025-11-30 14:19:54'),
(29, 1, 'CREATE', 'sales', 4, NULL, NULL, '2025-11-30 14:19:54'),
(30, 1, 'UPDATE', 'products', 50, '{\"stock\": 11, \"price\": 680.00}', '{\"stock\": 0, \"price\": 6999.00}', '2025-11-30 14:22:01'),
(31, 1, 'UPDATE', 'products', 50, '{\"stock\": 0, \"price\": 6999.00}', '{\"stock\": 0, \"price\": 6999.00}', '2025-11-30 14:22:28'),
(32, 1, 'CREATE', 'sales', 5, NULL, '{\"total\": 644.00, \"payment_method\": \"Cash\", \"sale_date\": \"2025-11-30 23:50:16\"}', '2025-11-30 15:50:16'),
(33, 1, 'UPDATE', 'products', 46, '{\"stock\": 198, \"price\": 80.00}', '{\"stock\": 197, \"price\": 80.00}', '2025-11-30 15:50:16'),
(34, 1, 'UPDATE', 'products', 47, '{\"stock\": 84, \"price\": 120.00}', '{\"stock\": 83, \"price\": 120.00}', '2025-11-30 15:50:16'),
(35, 1, 'UPDATE', 'products', 48, '{\"stock\": 319, \"price\": 95.00}', '{\"stock\": 318, \"price\": 95.00}', '2025-11-30 15:50:16'),
(36, 1, 'UPDATE', 'products', 49, '{\"stock\": 42, \"price\": 280.00}', '{\"stock\": 41, \"price\": 280.00}', '2025-11-30 15:50:16'),
(37, 1, 'CREATE', 'sales', 5, NULL, NULL, '2025-11-30 15:50:16');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`, `created_at`) VALUES
(1, 'Feeds', 'Animal feeds and food products', '2025-11-30 11:07:40'),
(2, 'Medicine', 'Veterinary medicines and treatments', '2025-11-30 11:07:40'),
(3, 'Vitamins', 'Supplements and vitamins', '2025-11-30 11:07:40'),
(4, 'Accessories', 'Pet and farm accessories', '2025-11-30 11:07:40'),
(5, 'Others', 'Miscellaneous items', '2025-11-30 11:07:40');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `daily_sales_summary`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `daily_sales_summary`;
CREATE TABLE `daily_sales_summary` (
`sale_day` date
,`total_transactions` bigint(21)
,`total_sales` decimal(32,2)
,`total_discounts` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
CREATE TABLE `deliveries` (
  `delivery_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `delivery_date` date NOT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_items`
--

DROP TABLE IF EXISTS `delivery_items`;
CREATE TABLE `delivery_items` (
  `item_id` int(11) NOT NULL,
  `delivery_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_cost` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `expiring_products`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `expiring_products`;
CREATE TABLE `expiring_products` (
`product_id` int(11)
,`name` varchar(255)
,`sku` varchar(50)
,`expiry_date` date
,`days_until_expiry` int(7)
,`category_name` varchar(100)
,`stock` int(11)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `low_stock_products`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `low_stock_products`;
CREATE TABLE `low_stock_products` (
`product_id` int(11)
,`name` varchar(255)
,`sku` varchar(50)
,`stock` int(11)
,`min_stock` int(11)
,`shortage` bigint(12)
,`category_name` varchar(100)
,`price` decimal(10,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `min_stock` int(11) DEFAULT 10,
  `expiry_date` date DEFAULT NULL,
  `is_archived` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `name`, `description`, `sku`, `price`, `cost_price`, `stock`, `min_stock`, `expiry_date`, `is_archived`, `created_at`, `updated_at`) VALUES
(1, 1, 'Premium Dog Food 10kg', 'High-quality complete dog food for all ages', 'DF-PREM-10', 1250.00, 800.00, 45, 10, '2026-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(2, 1, 'Premium Dog Food 5kg', 'High-quality complete dog food for all ages', 'DF-PREM-5', 680.00, 420.00, 78, 15, '2026-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(3, 1, 'Puppy Formula 5kg', 'Specially formulated for growing puppies', 'DF-PUP-5', 750.00, 450.00, 32, 8, '2026-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(4, 1, 'Senior Dog Food 5kg', 'Low-fat formula for senior dogs', 'DF-SEN-5', 800.00, 500.00, 25, 5, '2026-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(5, 1, 'Cat Food Tuna 5kg', 'Premium cat food with tuna flavor', 'CF-TUN-5', 620.00, 380.00, 52, 12, '2026-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(6, 1, 'Cat Food Chicken 5kg', 'Premium cat food with chicken flavor', 'CF-CHK-5', 620.00, 380.00, 48, 10, '2026-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(7, 1, 'Kitten Formula 2kg', 'Specially formulated for kittens', 'CF-KIT-2', 450.00, 280.00, 35, 8, '2026-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(8, 1, 'Fish Feed Premium 1kg', 'Complete nutrition for ornamental fish', 'FF-PREM-1', 280.00, 150.00, 60, 15, '2026-05-29', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(9, 1, 'Bird Seed Mix 2kg', 'Mixed seed for various bird species', 'BS-MIX-2', 320.00, 180.00, 42, 10, '2026-05-29', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(10, 1, 'Pet Shrimp Pellets 500g', 'High-protein pellets for shrimp', 'SH-PELL-500', 350.00, 200.00, 28, 5, '2026-05-29', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(11, 2, 'Antibiotic Injectable 50ml', 'Broad-spectrum antibiotic', 'MED-ANT-50', 850.00, 500.00, 15, 3, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(12, 2, 'Amoxicillin Powder 250g', 'Amoxicillin powder for oral use', 'MED-AMX-250', 450.00, 250.00, 22, 5, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(13, 2, 'Dewormer Tablets 100ct', 'Effective dewormer for pets', 'MED-DEW-100', 380.00, 200.00, 38, 8, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(14, 2, 'Flea & Tick Treatment 100ml', 'Topical treatment for fleas and ticks', 'MED-FLT-100', 950.00, 600.00, 25, 5, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(15, 2, 'Pain Reliever Injection 20ml', 'Injectable pain relief for animals', 'MED-PAIN-20', 520.00, 300.00, 18, 3, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(16, 2, 'Digestive Enzyme Powder 200g', 'Aids digestion in pets', 'MED-DIG-200', 680.00, 400.00, 12, 2, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(17, 2, 'Electrolyte Solution 500ml', 'Rehydration solution for sick animals', 'MED-ELEC-500', 420.00, 250.00, 30, 5, '2026-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(18, 2, 'Eye Ointment 10g', 'Antibiotic eye ointment for pets', 'MED-EYE-10', 280.00, 150.00, 24, 3, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(19, 3, 'Vitamin B Complex 250ml', 'Essential B vitamins for pet health', 'VIT-B-250', 520.00, 300.00, 35, 8, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(20, 3, 'Calcium Supplement 500g', 'Bone and teeth development', 'VIT-CAL-500', 680.00, 400.00, 28, 5, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(21, 3, 'Omega-3 Supplement 200ml', 'Heart and skin health supplement', 'VIT-OMG-200', 850.00, 500.00, 22, 4, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(22, 3, 'Multivitamin Tablets 100ct', 'Complete vitamin formula', 'VIT-MULT-100', 420.00, 250.00, 44, 10, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:47:54'),
(23, 3, 'Iron Tonic 250ml', 'Iron supplement for anemic pets', 'VIT-IRN-250', 580.00, 350.00, 17, 3, '2027-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:47:54'),
(24, 3, 'Probiotic Powder 100g', 'Beneficial bacteria for gut health', 'VIT-PROB-100', 750.00, 450.00, 14, 2, '2026-11-30', 0, '2025-11-30 13:45:16', '2025-11-30 13:47:54'),
(25, 4, 'Dog Leash 2m Standard', 'Durable nylon dog leash', 'ACC-LEASH-2', 180.00, 100.00, 120, 20, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(26, 4, 'Dog Collar M size', 'Adjustable nylon dog collar', 'ACC-COLL-M', 150.00, 80.00, 95, 15, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(27, 4, 'Dog Collar L size', 'Adjustable nylon dog collar large', 'ACC-COLL-L', 180.00, 100.00, 75, 10, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(28, 4, 'Cat Harness Small', 'Soft cat harness with strap', 'ACC-HARN-S', 220.00, 120.00, 42, 8, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(29, 4, 'Pet Bed Comfort 80x60cm', 'Orthopedic pet bed', 'ACC-BED-80', 1200.00, 700.00, 18, 3, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(30, 4, 'Pet Water Bowl Stainless 2L', 'Non-slip water bowl', 'ACC-BOWL-2', 280.00, 150.00, 85, 15, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(31, 4, 'Pet Food Bowl Stainless 3L', 'Heavy-duty food bowl', 'ACC-FBOWL-3', 320.00, 180.00, 72, 10, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(32, 4, 'Pet Feeder Automatic 3kg', 'Automatic timed pet feeder', 'ACC-FEED-3', 2500.00, 1500.00, 12, 2, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(33, 4, 'Litter Box Large', 'Covered litter box for cats', 'ACC-LITTER-L', 680.00, 400.00, 28, 5, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(34, 4, 'Litter Sand 10kg', 'Premium clumping litter', 'ACC-LIT-10', 380.00, 200.00, 52, 10, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(35, 4, 'Poop Scoop with Bag Dispenser', 'Portable poop scoop', 'ACC-SCOOP', 120.00, 60.00, 145, 20, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(36, 4, 'Pet Grooming Brush Medium', 'Soft grooming brush', 'ACC-BRUSH-M', 280.00, 150.00, 68, 10, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(37, 4, 'Pet Shampoo Dog 500ml', 'Gentle dog shampoo', 'ACC-SHAMP-D', 380.00, 200.00, 55, 10, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(38, 4, 'Pet Shampoo Cat 500ml', 'Gentle cat shampoo', 'ACC-SHAMP-C', 420.00, 250.00, 42, 8, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(39, 4, 'Pet Nail Clipper Stainless', 'Professional nail clipper', 'ACC-NAIL', 280.00, 150.00, 34, 5, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:57:45'),
(40, 4, 'Toy Ball Set 5pc', 'Colorful ball toys for pets', 'ACC-TOY-BALL', 180.00, 100.00, 109, 15, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:57:45'),
(41, 4, 'Rope Toy Chew', 'Durable rope chew toy', 'ACC-TOY-ROPE', 140.00, 75.00, 94, 15, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 14:19:54'),
(42, 4, 'Pet Carrier Soft 50x30x30', 'Portable pet carrier', 'ACC-CARRIER', 950.00, 550.00, 20, 3, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 14:19:54'),
(43, 4, 'Pet Cage Wire 120x60x60', 'Large wire cage for birds/rabbits', 'ACC-CAGE-120', 1800.00, 1000.00, 8, 1, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:45:16'),
(44, 4, 'Aquarium Filter 50L', 'Internal filter for aquarium', 'ACC-FILTER-50', 580.00, 350.00, 14, 2, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:57:45'),
(45, 4, 'Aquarium Heater 200W', 'Submersible aquarium heater', 'ACC-HEAT-200', 420.00, 250.00, 17, 3, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 13:57:45'),
(46, 5, 'Pet ID Tag Brass', 'Personalized pet ID tag', 'OTH-ID-BRASS', 80.00, 40.00, 197, 30, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 15:50:16'),
(47, 5, 'Pet Medical Record Book', 'Vaccination and health record book', 'OTH-MED-REC', 120.00, 60.00, 83, 15, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 15:50:16'),
(48, 5, 'Pet Waste Bags 100ct', 'Degradable waste bags', 'OTH-BAGS-100', 95.00, 50.00, 318, 50, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 15:50:16'),
(49, 5, 'Disinfectant Spray 500ml', 'Pet-safe disinfectant', 'OTH-DISINFECT', 280.00, 150.00, 41, 8, NULL, 0, '2025-11-30 13:45:16', '2025-11-30 15:50:16'),
(50, 2, 'TEST', 'Complete pet first aid kit', 'OTH-FIRSTAID', 6999.00, 400.00, 0, 15, '2025-10-26', 0, '2025-11-30 13:45:16', '2025-11-30 14:22:28'),
(51, 5, 'Gard Shampoo', NULL, 'GRDSHM1', 800.00, 5000.00, 50, 10, '2028-12-30', 0, '2025-11-30 15:53:52', '2025-11-30 15:53:52');

--
-- Triggers `products`
--
DROP TRIGGER IF EXISTS `log_product_update`;
DELIMITER $$
CREATE TRIGGER `log_product_update` AFTER UPDATE ON `products` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (1, 'UPDATE', 'products', NEW.product_id, 
    JSON_OBJECT('stock', OLD.stock, 'price', OLD.price),
    JSON_OBJECT('stock', NEW.stock, 'price', NEW.price));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
  `sale_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `sale_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT 0.00,
  `vat` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `change_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` enum('Cash','GCash','Maya','Bank Transfer') DEFAULT 'Cash',
  `reference_number` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`sale_id`, `user_id`, `customer_id`, `sale_date`, `subtotal`, `discount`, `vat`, `total`, `amount_paid`, `change_amount`, `payment_method`, `reference_number`) VALUES
(1, 1, NULL, '2025-11-30 13:47:54', 1750.00, 0.00, 210.00, 1960.00, 20000.00, 18040.00, 'Cash', NULL),
(3, 1, NULL, '2025-11-30 13:57:45', 3290.00, 0.00, 394.80, 3684.80, 3684.80, -3684.80, 'GCash', '1212121212'),
(4, 1, NULL, '2025-11-30 14:19:54', 1265.00, 0.00, 151.80, 1416.80, 1416.80, -1416.80, 'Maya', '1212121212'),
(5, 1, NULL, '2025-11-30 15:50:16', 575.00, 0.00, 69.00, 644.00, 7899.00, 7255.00, 'Cash', NULL);

--
-- Triggers `sales`
--
DROP TRIGGER IF EXISTS `log_sales_create`;
DELIMITER $$
CREATE TRIGGER `log_sales_create` AFTER INSERT ON `sales` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

DROP TABLE IF EXISTS `sale_items`;
CREATE TABLE `sale_items` (
  `sale_item_id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`sale_item_id`, `sale_id`, `product_id`, `quantity`, `unit_price`, `subtotal`) VALUES
(1, 1, 24, 1, 750.00, 750.00),
(2, 1, 23, 1, 580.00, 580.00),
(3, 1, 22, 1, 420.00, 420.00),
(12, 3, 50, 1, 680.00, 680.00),
(13, 3, 47, 1, 120.00, 120.00),
(14, 3, 46, 1, 80.00, 80.00),
(15, 3, 42, 1, 950.00, 950.00),
(16, 3, 44, 1, 580.00, 580.00),
(17, 3, 45, 1, 420.00, 420.00),
(18, 3, 40, 1, 180.00, 180.00),
(19, 3, 39, 1, 280.00, 280.00),
(20, 4, 48, 1, 95.00, 95.00),
(21, 4, 46, 1, 80.00, 80.00),
(22, 4, 42, 1, 950.00, 950.00),
(23, 4, 41, 1, 140.00, 140.00),
(24, 5, 46, 1, 80.00, 80.00),
(25, 5, 47, 1, 120.00, 120.00),
(26, 5, 48, 1, 95.00, 95.00),
(27, 5, 49, 1, 280.00, 280.00);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
  `supplier_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `role` enum('admin','staff') NOT NULL DEFAULT 'staff',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `full_name`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$rQZ8K5Y5Y5Y5Y5Y5Y5Y5YuJ5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', 'System Administrator', 'admin', 1, '2025-11-30 11:07:40', '2025-11-30 11:07:40');

-- --------------------------------------------------------

--
-- Structure for view `daily_sales_summary`
--
DROP TABLE IF EXISTS `daily_sales_summary`;

DROP VIEW IF EXISTS `daily_sales_summary`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `daily_sales_summary`  AS SELECT cast(`sales`.`sale_date` as date) AS `sale_day`, count(0) AS `total_transactions`, sum(`sales`.`total`) AS `total_sales`, sum(`sales`.`discount`) AS `total_discounts` FROM `sales` GROUP BY cast(`sales`.`sale_date` as date) ORDER BY cast(`sales`.`sale_date` as date) DESC ;

-- --------------------------------------------------------

--
-- Structure for view `expiring_products`
--
DROP TABLE IF EXISTS `expiring_products`;

DROP VIEW IF EXISTS `expiring_products`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `expiring_products`  AS SELECT `p`.`product_id` AS `product_id`, `p`.`name` AS `name`, `p`.`sku` AS `sku`, `p`.`expiry_date` AS `expiry_date`, to_days(`p`.`expiry_date`) - to_days(curdate()) AS `days_until_expiry`, `c`.`name` AS `category_name`, `p`.`stock` AS `stock` FROM (`products` `p` join `categories` `c` on(`p`.`category_id` = `c`.`category_id`)) WHERE `p`.`expiry_date` is not null AND `p`.`expiry_date` <= curdate() + interval 30 day AND `p`.`is_archived` = 0 ORDER BY `p`.`expiry_date` ASC ;

-- --------------------------------------------------------

--
-- Structure for view `low_stock_products`
--
DROP TABLE IF EXISTS `low_stock_products`;

DROP VIEW IF EXISTS `low_stock_products`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `low_stock_products`  AS SELECT `p`.`product_id` AS `product_id`, `p`.`name` AS `name`, `p`.`sku` AS `sku`, `p`.`stock` AS `stock`, `p`.`min_stock` AS `min_stock`, `p`.`min_stock`- `p`.`stock` AS `shortage`, `c`.`name` AS `category_name`, `p`.`price` AS `price` FROM (`products` `p` join `categories` `c` on(`p`.`category_id` = `c`.`category_id`)) WHERE `p`.`stock` <= `p`.`min_stock` AND `p`.`is_archived` = 0 ORDER BY `p`.`min_stock`- `p`.`stock` DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_user_action_date` (`user_id`,`action`,`created_at`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`delivery_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `delivery_items`
--
ALTER TABLE `delivery_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `delivery_id` (`delivery_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_category_archived` (`category_id`,`is_archived`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sale_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `idx_user_date` (`user_id`,`sale_date`),
  ADD KEY `idx_payment_date` (`payment_method`,`sale_date`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`sale_item_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_sale_product` (`sale_id`,`product_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `delivery_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_items`
--
ALTER TABLE `delivery_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `sale_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `sale_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `supplier_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`),
  ADD CONSTRAINT `deliveries_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `delivery_items`
--
ALTER TABLE `delivery_items`
  ADD CONSTRAINT `delivery_items_ibfk_1` FOREIGN KEY (`delivery_id`) REFERENCES `deliveries` (`delivery_id`),
  ADD CONSTRAINT `delivery_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`);

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`sale_id`),
  ADD CONSTRAINT `sale_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

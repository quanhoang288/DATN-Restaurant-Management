-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: restaurant_management
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attribute_values`
--

DROP TABLE IF EXISTS `attribute_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attribute_values` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `attribute_id` bigint unsigned DEFAULT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attribute_id` (`attribute_id`),
  CONSTRAINT `attribute_values_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `good_attributes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute_values`
--

LOCK TABLES `attribute_values` WRITE;
/*!40000 ALTER TABLE `attribute_values` DISABLE KEYS */;
/*!40000 ALTER TABLE `attribute_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_items`
--

DROP TABLE IF EXISTS `category_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned DEFAULT NULL,
  `good_id` bigint unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `good_id` (`good_id`),
  CONSTRAINT `category_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`),
  CONSTRAINT `category_items_ibfk_2` FOREIGN KEY (`good_id`) REFERENCES `goods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_items`
--

LOCK TABLES `category_items` WRITE;
/*!40000 ALTER TABLE `category_items` DISABLE KEYS */;
INSERT INTO `category_items` VALUES (1,1,1,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(2,2,2,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(3,1,3,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(4,3,6,'2022-06-28 06:08:44','2022-06-28 06:08:44',NULL),(5,7,1,'2022-07-05 18:33:38','2022-07-05 18:33:38',NULL),(6,7,2,'2022-07-05 18:33:38','2022-07-05 18:33:38',NULL),(7,8,3,'2022-07-05 18:33:38','2022-07-05 18:33:38',NULL),(8,8,4,'2022-07-05 18:33:38','2022-07-05 18:33:38',NULL),(9,8,5,'2022-07-05 19:15:00','2022-07-05 19:15:00',NULL);
/*!40000 ALTER TABLE `category_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date_of_birth` datetime DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_infos`
--

DROP TABLE IF EXISTS `delivery_infos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_infos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint unsigned DEFAULT NULL,
  `delivery_address` varchar(255) NOT NULL,
  `is_default` tinyint DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `delivery_infos_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `discounts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_infos`
--

LOCK TABLES `delivery_infos` WRITE;
/*!40000 ALTER TABLE `delivery_infos` DISABLE KEYS */;
/*!40000 ALTER TABLE `delivery_infos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_constraint_goods`
--

DROP TABLE IF EXISTS `discount_constraint_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_constraint_goods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `discount_constraint_id` bigint unsigned DEFAULT NULL,
  `good_id` bigint unsigned DEFAULT NULL,
  `is_discount_item` tinyint DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `discount_constraint_id` (`discount_constraint_id`),
  KEY `good_id` (`good_id`),
  CONSTRAINT `discount_constraint_goods_ibfk_1` FOREIGN KEY (`discount_constraint_id`) REFERENCES `discount_constraints` (`id`),
  CONSTRAINT `discount_constraint_goods_ibfk_2` FOREIGN KEY (`good_id`) REFERENCES `goods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_constraint_goods`
--

LOCK TABLES `discount_constraint_goods` WRITE;
/*!40000 ALTER TABLE `discount_constraint_goods` DISABLE KEYS */;
INSERT INTO `discount_constraint_goods` VALUES (1,4,1,1,'2022-07-12 09:25:11','2022-07-12 09:25:11',NULL),(2,6,9,0,'2022-07-16 19:58:19','2022-07-16 19:58:19',NULL),(3,6,4,0,'2022-07-16 19:58:19','2022-07-16 19:58:19',NULL),(4,6,6,1,'2022-07-16 19:58:19','2022-07-16 19:58:19',NULL);
/*!40000 ALTER TABLE `discount_constraint_goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_constraints`
--

DROP TABLE IF EXISTS `discount_constraints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_constraints` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `discount_id` bigint unsigned NOT NULL,
  `min_invoice_value` int DEFAULT NULL,
  `discount_amount` int DEFAULT NULL,
  `discount_unit` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `order_item_quantity` int DEFAULT NULL,
  `discount_item_quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `discount_id` (`discount_id`),
  CONSTRAINT `discount_constraints_ibfk_1` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_constraints`
--

LOCK TABLES `discount_constraints` WRITE;
/*!40000 ALTER TABLE `discount_constraints` DISABLE KEYS */;
INSERT INTO `discount_constraints` VALUES (1,1,50000,9000,'cash','2022-07-06 09:18:44','2022-07-06 09:18:44',NULL,NULL,NULL),(2,1,75000,15000,'cash','2022-07-06 09:18:44','2022-07-06 09:18:44',NULL,NULL,NULL),(3,1,120000,35000,'cash','2022-07-06 09:18:44','2022-07-06 09:18:44',NULL,NULL,NULL),(4,2,120000,NULL,NULL,'2022-07-12 09:25:11','2022-07-12 09:25:11',NULL,NULL,1),(6,5,NULL,100,'percent','2022-07-16 19:58:19','2022-07-16 19:58:19',NULL,3,2);
/*!40000 ALTER TABLE `discount_constraints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `start_day` int DEFAULT NULL,
  `end_day` int DEFAULT NULL,
  `start_hour` time DEFAULT NULL,
  `end_hour` time DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `is_applied_to_all_customers` tinyint(1) DEFAULT '0',
  `is_auto_applied` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
INSERT INTO `discounts` VALUES (1,'new program','invoice','2022-07-06 00:00:00','2022-07-09 00:00:00',NULL,NULL,NULL,NULL,'invoice-discount',1,0,'2022-07-06 09:18:44','2022-07-06 09:18:44',NULL),(2,'new discount 2','invoice','2022-07-12 00:00:00','2022-07-16 00:00:00',NULL,NULL,NULL,NULL,'invoice-giveaway',1,0,'2022-07-12 09:25:11','2022-07-12 09:25:11',NULL),(5,'333','good','2022-07-17 00:00:00','2022-07-20 00:00:00',NULL,NULL,NULL,NULL,'good-giveaway',1,0,'2022-07-16 19:58:19','2022-07-16 19:58:19',NULL);
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `good_attributes`
--

DROP TABLE IF EXISTS `good_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `good_attributes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `good_id` bigint unsigned DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `good_id` (`good_id`),
  CONSTRAINT `good_attributes_ibfk_1` FOREIGN KEY (`good_id`) REFERENCES `goods` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `good_attributes`
--

LOCK TABLES `good_attributes` WRITE;
/*!40000 ALTER TABLE `good_attributes` DISABLE KEYS */;
/*!40000 ALTER TABLE `good_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `good_components`
--

DROP TABLE IF EXISTS `good_components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `good_components` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `good_id` bigint unsigned DEFAULT NULL,
  `component_id` bigint unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `good_id` (`good_id`),
  KEY `component_id` (`component_id`),
  CONSTRAINT `good_components_ibfk_1` FOREIGN KEY (`good_id`) REFERENCES `goods` (`id`),
  CONSTRAINT `good_components_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `goods` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `good_components`
--

LOCK TABLES `good_components` WRITE;
/*!40000 ALTER TABLE `good_components` DISABLE KEYS */;
/*!40000 ALTER TABLE `good_components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `good_groups`
--

DROP TABLE IF EXISTS `good_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `good_groups` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `good_groups`
--

LOCK TABLES `good_groups` WRITE;
/*!40000 ALTER TABLE `good_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `good_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `good_units`
--

DROP TABLE IF EXISTS `good_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `good_units` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `good_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `multiplier` float NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `good_id` (`good_id`),
  CONSTRAINT `good_units_ibfk_1` FOREIGN KEY (`good_id`) REFERENCES `goods` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `good_units`
--

LOCK TABLES `good_units` WRITE;
/*!40000 ALTER TABLE `good_units` DISABLE KEYS */;
/*!40000 ALTER TABLE `good_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods`
--

DROP TABLE IF EXISTS `goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `import_price` bigint unsigned DEFAULT NULL,
  `sale_price` bigint unsigned DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `min_quantity_threshold` int DEFAULT NULL,
  `max_quantity_threshold` int DEFAULT NULL,
  `manufacture_date` datetime DEFAULT NULL,
  `expires_in_days` int DEFAULT NULL,
  `expires_at` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES (1,'Bò xào nấm',NULL,NULL,50000,70000,NULL,NULL,NULL,NULL,NULL,NULL,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(2,'Nấm xào',NULL,NULL,50000,70000,NULL,NULL,NULL,NULL,NULL,NULL,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(3,'Gà chiên mắm',NULL,NULL,50000,70000,NULL,NULL,NULL,NULL,NULL,NULL,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(4,'Gà hầm','Gà thơm ngon, không công nghiệp','ready_served',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-06-28 04:12:03','2022-06-28 04:12:03',NULL),(5,'Bê xào xả ớt',NULL,'fresh_served',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-06-28 06:04:33','2022-06-28 06:04:33',NULL),(6,'Coca',NULL,'ready_served',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-06-28 06:05:58','2022-06-28 06:05:58',NULL),(7,'Bò xào nấm',NULL,NULL,50000,70000,NULL,NULL,NULL,NULL,NULL,NULL,'2022-07-13 16:14:45','2022-07-13 16:14:45',NULL),(8,'Nấm xào',NULL,NULL,50000,70000,NULL,NULL,NULL,NULL,NULL,NULL,'2022-07-13 16:14:45','2022-07-13 16:14:45',NULL),(9,'Gà chiên mắm',NULL,NULL,50000,70000,NULL,NULL,NULL,NULL,NULL,NULL,'2022-07-13 16:14:45','2022-07-13 16:14:45',NULL);
/*!40000 ALTER TABLE `goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `other_fee` int DEFAULT NULL,
  `discount_amount` int DEFAULT NULL,
  `paid_amount` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_invoices_1_idx` (`order_id`),
  CONSTRAINT `fk_invoices_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kitchens`
--

DROP TABLE IF EXISTS `kitchens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kitchens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `floor_num` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kitchens`
--

LOCK TABLES `kitchens` WRITE;
/*!40000 ALTER TABLE `kitchens` DISABLE KEYS */;
INSERT INTO `kitchens` VALUES (1,'Bếp 1','food',1,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(2,'Quầy pha chế 1','beverage',1,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(3,'Bếp 2','food',1,'2022-06-28 06:06:58','2022-06-28 06:06:58',NULL),(4,'Quầy pha chế 2','food',1,'2022-06-28 06:07:10','2022-06-28 06:07:10',NULL);
/*!40000 ALTER TABLE `kitchens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_categories`
--

DROP TABLE IF EXISTS `menu_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `menu_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `order` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `menu_categories_ibfk_1` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_categories`
--

LOCK TABLES `menu_categories` WRITE;
/*!40000 ALTER TABLE `menu_categories` DISABLE KEYS */;
INSERT INTO `menu_categories` VALUES (1,1,'Đồ ăn xào/ nướng',1,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(2,1,'Đồ ăn chay',2,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(3,2,'Nước giải khát',NULL,'2022-06-28 06:08:44','2022-06-28 06:08:44',NULL),(7,3,'A',NULL,'2022-07-05 18:33:38','2022-07-05 18:33:38',NULL),(8,3,'B update',NULL,'2022-07-05 18:33:38','2022-07-05 19:14:35',NULL);
/*!40000 ALTER TABLE `menu_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (1,'Đồ ăn 1','food','active','2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(2,'Đô uống 1','beverage','active','2022-06-28 06:08:44','2022-06-28 06:08:44',NULL),(3,'New menu','food','active','2022-07-05 18:33:38','2022-07-05 18:33:38',NULL);
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES ('20220419130410-create-users-table.js'),('20220505085439-create-settings-table.js'),('20220505085510-create-roles-table.js'),('20220505085530-create-permissions-table.js'),('20220505085926-create-tables-table.js'),('20220505090115-create-kitchens-table.js'),('20220505090304-create-discounts-table.js'),('20220505090405-create-discount-constraints-table.js'),('20220505090610-create-customers-table.js'),('20220505090618-create-staff-table.js'),('20220505090635-create-groups-table.js'),('20220505090643-create-customer-groups-table.js'),('20220505090658-create-staff-roles-table.js'),('20220505090709-create-role-permissions-table.js'),('20220505090753-create-good-groups-table.js'),('20220505090807-create-goods-table.js'),('20220505090820-create-good-attributes-table.js'),('20220505090829-create-attribute-values-table.js'),('20220505090843-create-good-components-table.js'),('20220505090936-create-good-units-table.js'),('20220505090940-create-delivery-infos-table.js'),('20220505090957-create-reservations-table.js'),('20220505091006-create-reservation-tables-table.js'),('20220505091010-create-invoices-table.js'),('20220505091013-create-orders-table.js'),('20220505091111-create-kitchen-goods-table.js'),('20220505091133-create-menus-table.js'),('20220505091143-create-menu-categories-table.js'),('20220505091156-create-category-items-table.js'),('20220505091221-create-order-details-table.js'),('20220505091226-create-order-discounts-table.js'),('20220505091242-create-discount-constraint-goods-table.js'),('20220505091256-create-discount-constraint-good-groups-table.js'),('20220505091323-create-discount-customer-groups-table.js'),('20220505091453-create-notifications-table.js'),('20220505091516-create-notification-orders-table.js'),('20220505091524-create-notification-order-goods-table.js'),('20220612151703-create-kitchen-order-table.js'),('20220629171153-create-branches-table.js'),('20220713190020-create-notification-templates-table.js'),('20220713190030-create-notifications-table.js'),('20220713190046-create-notification-role-table.js'),('20220713190112-create-notification-user-table.js'),('20220717184609-create-order-discount-good-table.js');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_user`
--

DROP TABLE IF EXISTS `notification_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `notification_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `read_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notification_user_1_idx` (`notification_id`),
  CONSTRAINT `fk_notification_user_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_user`
--

LOCK TABLES `notification_user` WRITE;
/*!40000 ALTER TABLE `notification_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `order_id` bigint unsigned DEFAULT NULL,
  `order_item_id` bigint unsigned DEFAULT NULL,
  `reservation_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_notifications_1_idx` (`order_id`),
  KEY `fk_notifications_3_idx` (`reservation_id`),
  CONSTRAINT `fk_notifications_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_notifications_2` FOREIGN KEY (`order_id`) REFERENCES `order_details` (`id`),
  CONSTRAINT `fk_notifications_3` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned DEFAULT NULL,
  `good_id` bigint unsigned DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `finished_quantity` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `good_id` (`good_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`good_id`) REFERENCES `goods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,1,1,1,'ready_to_serve','2022-06-22 18:01:03','2022-07-01 17:51:17','2022-07-10 19:19:27',0),(2,1,3,3,'rejected','2022-06-22 18:01:03','2022-07-01 18:22:47','2022-07-10 19:19:27',0),(5,1,1,1,NULL,'2022-07-10 19:19:27','2022-07-10 19:19:27','2022-07-11 09:50:43',0),(6,1,3,4,NULL,'2022-07-10 19:19:27','2022-07-10 19:19:27','2022-07-11 09:50:43',0),(13,7,1,2,'in_progress','2022-07-11 14:21:55','2022-07-11 14:51:17','2022-07-11 14:52:21',0),(14,7,1,2,'in_progress','2022-07-11 14:52:21','2022-07-11 14:53:58','2022-07-11 14:54:29',0),(15,7,3,1,'pending','2022-07-11 14:52:21','2022-07-11 14:52:21','2022-07-11 14:54:29',0),(16,7,1,2,'in_progress','2022-07-11 14:54:29','2022-07-11 15:05:35','2022-07-11 15:13:16',0),(17,7,3,2,'pending','2022-07-11 14:54:29','2022-07-11 14:54:29','2022-07-11 15:13:16',0),(18,7,1,2,'done','2022-07-11 15:13:16','2022-07-18 17:12:23',NULL,2),(19,7,3,2,'pending','2022-07-11 15:13:16','2022-07-11 16:06:43','2022-07-11 16:08:33',0),(20,7,3,2,'in_progress','2022-07-11 16:08:43','2022-07-12 16:56:49',NULL,0);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_discount_goods`
--

DROP TABLE IF EXISTS `order_discount_goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_discount_goods` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_discount_id` bigint unsigned NOT NULL,
  `good_id` bigint unsigned DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `order_discount_id` (`order_discount_id`),
  KEY `good_id` (`good_id`),
  CONSTRAINT `order_discount_goods_ibfk_1` FOREIGN KEY (`order_discount_id`) REFERENCES `order_discounts` (`id`),
  CONSTRAINT `order_discount_goods_ibfk_2` FOREIGN KEY (`good_id`) REFERENCES `goods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_discount_goods`
--

LOCK TABLES `order_discount_goods` WRITE;
/*!40000 ALTER TABLE `order_discount_goods` DISABLE KEYS */;
INSERT INTO `order_discount_goods` VALUES (1,2,1,1,'2022-07-18 18:42:17','2022-07-18 18:42:17','2022-07-18 18:48:52','pending'),(2,3,1,1,'2022-07-18 18:49:08','2022-07-18 18:49:08',NULL,'pending');
/*!40000 ALTER TABLE `order_discount_goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_discounts`
--

DROP TABLE IF EXISTS `order_discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_discounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned DEFAULT NULL,
  `discount_constraint_id` bigint unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `order_discounts_ibfk_2_idx` (`discount_constraint_id`),
  CONSTRAINT `order_discounts_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_discounts_ibfk_2` FOREIGN KEY (`discount_constraint_id`) REFERENCES `discount_constraints` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_discounts`
--

LOCK TABLES `order_discounts` WRITE;
/*!40000 ALTER TABLE `order_discounts` DISABLE KEYS */;
INSERT INTO `order_discounts` VALUES (1,7,3,'2022-07-12 16:56:49','2022-07-12 16:56:49',NULL),(2,7,4,'2022-07-18 18:42:17','2022-07-18 18:42:17','2022-07-18 18:48:52'),(3,7,4,'2022-07-18 18:49:08','2022-07-18 18:49:08',NULL);
/*!40000 ALTER TABLE `order_discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reservation_table_id` bigint unsigned DEFAULT NULL,
  `customer_id` bigint unsigned DEFAULT NULL,
  `delivery_info_id` bigint unsigned DEFAULT NULL,
  `shipper_id` bigint unsigned DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone_number` varchar(255) DEFAULT NULL,
  `delivery_address` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'dine-in',
  `prepare_status` varchar(255) NOT NULL DEFAULT 'pending',
  `payment_status` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_table_id` (`reservation_table_id`),
  KEY `customer_id` (`customer_id`),
  KEY `delivery_info_id` (`delivery_info_id`),
  KEY `shipper_id` (`shipper_id`),
  KEY `orders_ibfk_6_idx` (`parent_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`reservation_table_id`) REFERENCES `reservation_tables` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`delivery_info_id`) REFERENCES `delivery_infos` (`id`),
  CONSTRAINT `orders_ibfk_5` FOREIGN KEY (`shipper_id`) REFERENCES `staff` (`id`),
  CONSTRAINT `orders_ibfk_6` FOREIGN KEY (`parent_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dine-in','in_progress','done','','2022-06-22 18:01:03','2022-07-11 09:50:43',NULL),(2,2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dine-in','in_progress',NULL,'new note','2022-06-28 07:17:57','2022-07-11 09:50:51',NULL),(7,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'dine-in','in_progress',NULL,'','2022-07-11 14:21:55','2022-07-11 14:48:54',NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation_tables`
--

DROP TABLE IF EXISTS `reservation_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation_tables` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reservation_id` bigint unsigned DEFAULT NULL,
  `table_id` bigint unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_id` (`reservation_id`),
  KEY `table_id` (`table_id`),
  CONSTRAINT `reservation_tables_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`),
  CONSTRAINT `reservation_tables_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation_tables`
--

LOCK TABLES `reservation_tables` WRITE;
/*!40000 ALTER TABLE `reservation_tables` DISABLE KEYS */;
INSERT INTO `reservation_tables` VALUES (1,1,1,'2022-06-22 17:52:35','2022-06-22 17:52:35','2022-07-10 10:29:01'),(2,1,2,'2022-06-22 17:52:35','2022-06-22 17:52:35','2022-07-10 10:29:01'),(3,3,4,'2022-06-28 06:14:36','2022-06-28 06:14:36','2022-07-11 10:24:40'),(4,3,5,'2022-06-28 06:14:36','2022-06-28 06:14:36','2022-07-11 10:24:40'),(5,4,4,'2022-06-28 06:14:41','2022-06-28 06:14:41','2022-06-28 06:14:49'),(6,4,5,'2022-06-28 06:14:41','2022-06-28 06:14:41','2022-06-28 06:14:49'),(7,5,3,'2022-06-28 06:15:26','2022-06-28 06:15:26','2022-07-11 10:25:56'),(8,8,1,'2022-07-11 10:32:53','2022-07-11 10:32:53',NULL),(9,9,2,'2022-07-11 10:43:05','2022-07-11 10:43:05',NULL);
/*!40000 ALTER TABLE `reservation_tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` bigint unsigned DEFAULT NULL,
  `arrive_time` datetime NOT NULL,
  `num_people` int NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone_number` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,NULL,'2022-06-23 10:51:00',3,NULL,'0384426529','note','serving','2022-06-22 17:51:32','2022-07-11 10:15:40','2022-07-11 10:15:40'),(2,NULL,'2022-06-23 10:51:00',3,NULL,'0384426529','note','serving','2022-06-22 17:51:37','2022-06-22 17:51:46','2022-06-22 17:51:46'),(3,NULL,'2022-06-28 10:13:00',3,NULL,'0329329920','View gần cửa sổ','pending','2022-06-28 06:14:36','2022-07-11 10:24:40','2022-07-11 10:24:40'),(4,NULL,'2022-06-28 10:13:00',3,NULL,'0329329920','View gần cửa sổ','pending','2022-06-28 06:14:41','2022-06-28 06:14:49','2022-06-28 06:14:49'),(5,NULL,'2022-06-30 09:15:00',5,NULL,'09032923920','Nothing','pending','2022-06-28 06:15:26','2022-07-11 10:25:56','2022-07-11 10:25:56'),(6,NULL,'2022-07-05 15:38:00',15,NULL,'0384493028','nothing','pending','2022-07-05 15:38:49','2022-07-11 10:27:02','2022-07-11 10:27:02'),(7,NULL,'2022-07-05 18:46:00',15,NULL,'03928289229','abc','pending','2022-07-05 18:46:19','2022-07-11 10:32:13','2022-07-11 10:32:13'),(8,NULL,'2022-07-12 10:32:00',6,NULL,'0384426529','không có gì','serving','2022-07-11 10:32:53','2022-07-11 10:32:53',NULL),(9,NULL,'2022-07-12 08:42:00',4,NULL,'090383983','','confirmed','2022-07-11 10:43:05','2022-07-11 10:43:05',NULL);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Phục vụ','2022-07-26 20:27:13','2022-07-26 20:27:13',NULL),(2,'Thu ngân','2022-07-26 20:29:54','2022-07-26 20:29:54',NULL),(3,'Nhân viên giao hàng','2022-07-26 20:30:07','2022-07-26 20:30:07',NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  `role_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_staff_1_idx` (`role_id`),
  CONSTRAINT `fk_staff_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (4,'active',NULL),(5,'active',NULL),(6,'active',NULL),(7,'active',NULL),(8,'active',NULL);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables`
--

DROP TABLE IF EXISTS `tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `floor_num` int NOT NULL,
  `order` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables`
--

LOCK TABLES `tables` WRITE;
/*!40000 ALTER TABLE `tables` DISABLE KEYS */;
INSERT INTO `tables` VALUES (1,'Bàn 1',1,1,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(2,'Bàn 2',1,2,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(3,'Bàn 3',1,4,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(4,'Bàn 4',2,1,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(5,'Bàn 5',2,2,'2022-06-22 17:49:05','2022-06-22 17:49:05',NULL),(6,'Bàn 1',1,1,'2022-07-13 16:14:45','2022-07-13 16:14:45',NULL),(7,'Bàn 2',1,2,'2022-07-13 16:14:45','2022-07-13 16:14:45',NULL),(8,'Bàn 3',1,4,'2022-07-13 16:14:45','2022-07-13 16:14:45',NULL),(9,'Bàn 4',2,1,'2022-07-13 16:14:45','2022-07-13 16:14:45',NULL),(10,'Bàn 5',2,2,'2022-07-13 16:14:45','2022-07-13 16:14:45',NULL);
/*!40000 ALTER TABLE `tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email_verified` tinyint unsigned DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `refresh_token_expires_at` datetime DEFAULT NULL,
  `email_verify_token` varchar(255) DEFAULT NULL,
  `email_verify_token_expires_at` datetime DEFAULT NULL,
  `password_rest_token` varchar(255) DEFAULT NULL,
  `password_rest_token_expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'quanhoang288@gmail.com','123456','Quan','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-07-05 09:32:21','2022-07-05 09:32:21',NULL),(5,'quan@gmail.com','123456','Quân Hoàng','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-07-05 09:39:58','2022-07-05 09:39:58',NULL),(6,'admin@gmail.com','$2a$10$piWBaeMIdM/INg1bOupsaulqI2dyIAanPxETgJWci04.LityRCSgm','Hoang Huy Quan',NULL,NULL,NULL,'5b875f3b-1bfb-447e-a0a4-7326a47e5f68','2022-08-11 12:56:22',NULL,NULL,NULL,NULL,'2022-07-13 16:48:04','2022-07-27 12:56:22',NULL),(7,'quanap2@gmail.com','12345678','Quan AP 2','','zorofamily-1658858494173.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-07-26 18:01:35','2022-07-26 18:01:35',NULL),(8,'zoro@gmail.com','$2a$10$K158FBc0KlHOc22U0b5XfecVISMNDAu.CBKXm2pPCkmL/IZNFyJAy','zorolufffy','undefined','onepiece-1658859109912.jpg',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-07-26 18:11:51','2022-07-26 18:11:51',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'restaurant_management'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-10 23:39:50
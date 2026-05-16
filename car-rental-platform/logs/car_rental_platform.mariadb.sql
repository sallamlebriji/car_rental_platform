-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: car_rental_platform
-- ------------------------------------------------------
-- Server version	8.4.9

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
-- Current Database: `car_rental_platform`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `car_rental_platform` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ ;

USE `car_rental_platform`;

--
-- Table structure for table `ActivityLog`
--

DROP TABLE IF EXISTS `ActivityLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ActivityLog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entityId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ActivityLog_userId_fkey` (`userId`),
  CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ActivityLog`
--

LOCK TABLES `ActivityLog` WRITE;
/*!40000 ALTER TABLE `ActivityLog` DISABLE KEYS */;
INSERT INTO `ActivityLog` VALUES ('cmodjcqf2002lumos3id6oozp','cmodjcpr4001oumossp4h2qv2','SEED_COMPLETED','system',NULL,'Initial multi-agency seed executed',NULL,'2026-04-24 23:22:33.278','2026-04-24 23:22:33.278'),('cmodjd9wp0001umqg8vbpxsor','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-24 23:22:58.537','2026-04-24 23:22:58.537'),('cmodjdnml0003umqgzexm7cdy','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-24 23:23:16.317','2026-04-24 23:23:16.317'),('cmodjgja30005umqgn97h6lny','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-24 23:25:30.651','2026-04-24 23:25:30.651'),('cmodjgjl10007umqgmop4tl2s','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-24 23:25:31.045','2026-04-24 23:25:31.045'),('cmodjgjl70009umqgsefpfk1c','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-24 23:25:31.049','2026-04-24 23:25:31.049'),('cmodjloyw000bumqgz735lf9x','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-24 23:29:31.304','2026-04-24 23:29:31.304'),('cmodjqg0t000dumqg6qxvlalt','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-24 23:33:12.989','2026-04-24 23:33:12.989'),('cmodkeflg0001umc03io4qlyd','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-24 23:51:52.175','2026-04-24 23:51:52.175'),('cmoea96w60003umc03h4ah1m0','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-25 11:55:37.635','2026-04-25 11:55:37.635'),('cmoeaz82y0001um8kv59y3hl8','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 12:15:52.230','2026-04-25 12:15:52.230'),('cmoeuzbjh0003umu4m71xzsaf','cmodjcps2001qumos3ixjymzi','UPDATE_CAR','car','cmodjcq0n0026umosw1i163ih','Peugeot 208 modifié',NULL,'2026-04-25 21:35:49.037','2026-04-25 21:35:49.037'),('cmoeuzlg00005umu4ypxttfdt','cmodjcps2001qumos3ixjymzi','UPDATE_RESERVATION_STATUS','reservation','cmodjcqbo002humos62ajuslg','Statut changé vers CONFIRMED',NULL,'2026-04-25 21:36:01.872','2026-04-25 21:36:01.872'),('cmoev7lo20007umu4ek4edqju','cmodjcps2001qumos3ixjymzi','UPDATE_RESERVATION_STATUS','reservation','cmodjcqbo002humos62ajuslg','Statut changé vers CONFIRMED',NULL,'2026-04-25 21:42:15.410','2026-04-25 21:42:15.410'),('cmoev7mhe0009umu47pt50w0b','cmodjcps2001qumos3ixjymzi','UPDATE_RESERVATION_STATUS','reservation','cmodjcqbo002humos62ajuslg','Statut changé vers CONFIRMED',NULL,'2026-04-25 21:42:16.466','2026-04-25 21:42:16.466'),('cmoev7mq6000bumu4dqve8pzp','cmodjcps2001qumos3ixjymzi','UPDATE_RESERVATION_STATUS','reservation','cmodjcqbo002humos62ajuslg','Statut changé vers CONFIRMED',NULL,'2026-04-25 21:42:16.782','2026-04-25 21:42:16.782'),('cmoev7mv0000dumu4knr12x6o','cmodjcps2001qumos3ixjymzi','UPDATE_RESERVATION_STATUS','reservation','cmodjcqbo002humos62ajuslg','Statut changé vers CONFIRMED',NULL,'2026-04-25 21:42:16.956','2026-04-25 21:42:16.956'),('cmoev7n68000fumu4pgeis44b','cmodjcps2001qumos3ixjymzi','UPDATE_RESERVATION_STATUS','reservation','cmodjcqbo002humos62ajuslg','Statut changé vers CONFIRMED',NULL,'2026-04-25 21:42:17.360','2026-04-25 21:42:17.360'),('cmoev7nlm000humu47jcadqze','cmodjcps2001qumos3ixjymzi','UPDATE_RESERVATION_STATUS','reservation','cmodjcqbo002humos62ajuslg','Statut changé vers REFUSED',NULL,'2026-04-25 21:42:17.915','2026-04-25 21:42:17.915'),('cmoev7orl000jumu47remg8an','cmodjcps2001qumos3ixjymzi','UPDATE_RESERVATION_STATUS','reservation','cmodjcqbo002humos62ajuslg','Statut changé vers CONFIRMED',NULL,'2026-04-25 21:42:19.425','2026-04-25 21:42:19.425'),('cmoew0x8x000lumu4izsjutjs','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-25 22:05:03.434','2026-04-25 22:05:03.434'),('cmoewyy7c0001umkodubsmrkd','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-25 22:31:30.976','2026-04-25 22:31:30.976'),('cmoexa57p000dumjoe3bsjvh0','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 22:40:13.285','2026-04-25 22:40:13.285'),('cmoexa57q000fumjobw0bpc4j','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 22:40:13.286','2026-04-25 22:40:13.286'),('cmoexb3bd000humjou59hwdey','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 22:40:57.481','2026-04-25 22:40:57.481'),('cmoexb3e8000jumjoy8rsgnj1','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 22:40:57.584','2026-04-25 22:40:57.584'),('cmoexdsz1000rumjo5jc8r09s','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 22:43:04.045','2026-04-25 22:43:04.045'),('cmoexgx0t0001umh4ailixklr','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 22:45:29.258','2026-04-25 22:45:29.258'),('cmoexhs0d0003umh4lp9tboam','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 22:46:09.421','2026-04-25 22:46:09.421'),('cmoexilk20007umh4pm3xqla2','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 22:46:47.714','2026-04-25 22:46:47.714'),('cmoexv1rj0001um1w7t7rgazt','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 22:56:28.588','2026-04-25 22:56:28.588'),('cmoeybx6h0007um1wo5o45mo2','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 23:09:35.801','2026-04-25 23:09:35.801'),('cmoeygczm0001umgssscpnmuz','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-25 23:13:02.911','2026-04-25 23:13:02.911'),('cmofs3nw4000oum8ooillavkc','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-26 13:02:58.992','2026-04-26 13:02:58.992'),('cmofs929z000qum8osy9t8dhx','cmodjcps2001qumos3ixjymzi','LOGIN','user','cmodjcps2001qumos3ixjymzi','Connexion réussie',NULL,'2026-04-26 13:07:10.916','2026-04-26 13:07:10.916'),('cmofsbeqg000sum8ojkcud5r8','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion réussie',NULL,'2026-04-26 13:09:00.375','2026-04-26 13:09:00.375'),('cmofsunph000uum8oro437xet','cmodjcptq001uumosohtl5cwr','LOGIN','user','cmodjcptq001uumosohtl5cwr','Connexion réussie',NULL,'2026-04-26 13:23:58.469','2026-04-26 13:23:58.469'),('cmofu9yrb0008umm8tbo5fxe8',NULL,'CREATE_RESERVATION','reservation','cmofu9yof0004umm8n1uo9a20','Réservation RES-232005 créée',NULL,'2026-04-26 14:03:52.247','2026-04-26 14:03:52.247'),('cmogcasjf0007umd87cfesf20','cmodjcpr4001oumossp4h2qv2','LOGIN','user','cmodjcpr4001oumossp4h2qv2','Connexion reussie',NULL,'2026-04-26 22:28:23.927','2026-04-26 22:28:23.927');
/*!40000 ALTER TABLE `ActivityLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Agency`
--

DROP TABLE IF EXISTS `Agency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Agency` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logoUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coverImageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Agency_slug_key` (`slug`),
  UNIQUE KEY `Agency_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Agency`
--

LOCK TABLES `Agency` WRITE;
/*!40000 ALTER TABLE `Agency` DISABLE KEYS */;
INSERT INTO `Agency` VALUES ('cmodjcoqj0000umosrkm33xws','Atlas Drive','atlas-drive','ATL-CASA','Agence principale de location a Casablanca','Boulevard Zerktouni, Casablanca','Casablanca','Maroc','+212522000000','contact@atlasdrive.ma','https://atlasdrive.ma','+212600123456',NULL,NULL,1,'2026-04-24 23:22:31.098','2026-04-24 23:22:31.098',NULL),('cmodjcosc0001umoshhypx3r1','Ocean Rent','ocean-rent','OCN-AGD','Agence secondaire a Agadir','Marina d\'Agadir','Agadir','Maroc','+212528000111','hello@oceanrent.ma','https://oceanrent.ma','+212611223344',NULL,NULL,1,'2026-04-24 23:22:31.164','2026-04-25 23:48:08.804','2026-04-25 23:48:01.831'),('cmogcfvaf0008umd8z86x4ouz','Elite Location Meknes','elite-location-meknes','ELT_LOC_MEK','Agence premium','Boulvard M6','Meknes','Maroc','0778073672','elit_loc@gmail.com','elit_loc.ma','0778073672','','',1,'2026-04-26 22:32:20.774','2026-04-26 22:32:20.774',NULL);
/*!40000 ALTER TABLE `Agency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AgencySetting`
--

DROP TABLE IF EXISTS `AgencySetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AgencySetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agencyName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logoUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `faviconUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slogan` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ice` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ifNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `openingHours` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiktok` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AgencySetting_agencyId_key` (`agencyId`),
  CONSTRAINT `AgencySetting_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `Agency` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AgencySetting`
--

LOCK TABLES `AgencySetting` WRITE;
/*!40000 ALTER TABLE `AgencySetting` DISABLE KEYS */;
INSERT INTO `AgencySetting` VALUES ('cmodjcoth0003umoshxw7d4if','cmodjcoqj0000umosrkm33xws','Atlas Drive',NULL,NULL,'Roulez en toute confiance','Boulevard Zerktouni, Casablanca','+212522000000','contact@atlasdrive.ma','+212600123456','https://atlasdrive.ma',NULL,NULL,NULL,'Agence principale de location a Casablanca',NULL,NULL,NULL,NULL,NULL,'2026-04-24 23:22:31.205','2026-04-25 22:41:27.862'),('cmodjcoxu000dumosukbo50sb','cmodjcosc0001umoshhypx3r1','Ocean Rent',NULL,NULL,'Vos locations au bord de l\'ocean','Marina d\'Agadir','+212528000111','hello@oceanrent.ma','+212611223344','https://oceanrent.ma',NULL,NULL,NULL,'Agence secondaire a Agadir',NULL,NULL,NULL,NULL,NULL,'2026-04-24 23:22:31.361','2026-04-24 23:22:31.361'),('cmogcfvbx000aumd87kp2ufaa','cmogcfvaf0008umd8z86x4ouz','Elite Location Meknes',NULL,NULL,NULL,'Boulvard M6','0778073672','elit_loc@gmail.com','0778073672','elit_loc.ma',NULL,NULL,NULL,'Agence premium',NULL,NULL,NULL,NULL,NULL,'2026-04-26 22:32:20.828','2026-04-26 22:32:20.828');
/*!40000 ALTER TABLE `AgencySetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AppSetting`
--

DROP TABLE IF EXISTS `AppSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AppSetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AppSetting_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AppSetting`
--

LOCK TABLES `AppSetting` WRITE;
/*!40000 ALTER TABLE `AppSetting` DISABLE KEYS */;
/*!40000 ALTER TABLE `AppSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Car`
--

DROP TABLE IF EXISTS `Car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Car` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plateNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` int NOT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seats` int NOT NULL,
  `fuelType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transmission` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mileage` int DEFAULT NULL,
  `pricePerDay` decimal(10,2) NOT NULL,
  `depositAmount` decimal(10,2) NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conditions` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `status` enum('AVAILABLE','RENTED','MAINTENANCE','DISABLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AVAILABLE',
  `typeId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Car_plateNumber_key` (`plateNumber`),
  KEY `Car_agencyId_fkey` (`agencyId`),
  KEY `Car_typeId_fkey` (`typeId`),
  CONSTRAINT `Car_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `Agency` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Car_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `CarType` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Car`
--

LOCK TABLES `Car` WRITE;
/*!40000 ALTER TABLE `Car` DISABLE KEYS */;
INSERT INTO `Car` VALUES ('cmodjcpx50020umosz1r48q01','cmodjcoqj0000umosrkm33xws','Dacia','Duster','12345-A-6',2023,'Blanc',5,'Diesel','Manuelle',18000,550.00,4000.00,'SUV fiable pour longs trajets.','Kilometrage limite a 250 km/jour.',1,'AVAILABLE','cmodjcpvb001xumos4vv0387y','2026-04-24 23:22:32.633','2026-04-24 23:22:32.633',NULL),('cmodjcpyx0023umos20naay1m','cmodjcoqj0000umosrkm33xws','Hyundai','i10','23456-B-7',2024,'Gris',5,'Essence','Automatique',9000,320.00,2500.00,'Citadine economique et compacte.','Assurance de base incluse.',1,'AVAILABLE','cmodjcpwa001yumos3d2chb4b','2026-04-24 23:22:32.697','2026-04-24 23:22:32.697',NULL),('cmodjcq0n0026umosw1i163ih','cmodjcoqj0000umosrkm33xws','Peugeot','208','34567-C-8',2024,'Bleu',5,'Essence','Automatique',6000,390.00,2800.00,'Modele agile pour la ville et les trajets cotiers.','Assurance basique incluse.',1,'AVAILABLE','cmodjcpwa001yumos3d2chb4b','2026-04-24 23:22:32.759','2026-04-25 21:35:48.884',NULL);
/*!40000 ALTER TABLE `Car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CarImage`
--

DROP TABLE IF EXISTS `CarImage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CarImage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `carId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `CarImage_carId_fkey` (`carId`),
  CONSTRAINT `CarImage_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CarImage`
--

LOCK TABLES `CarImage` WRITE;
/*!40000 ALTER TABLE `CarImage` DISABLE KEYS */;
INSERT INTO `CarImage` VALUES ('cmodjcpy00021umos4mqyjtjk','cmodjcpx50020umosz1r48q01','https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',1,'2026-04-24 23:22:32.664','2026-04-24 23:22:32.664',NULL),('cmodjcpzp0024umoss1sfqzhr','cmodjcpyx0023umos20naay1m','https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',1,'2026-04-24 23:22:32.726','2026-04-24 23:22:32.726',NULL),('cmoeuzbfh0000umu4xcbraucx','cmodjcq0n0026umosw1i163ih','https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',1,'2026-04-25 21:35:48.884','2026-04-25 21:35:48.884',NULL),('cmoeuzbfl0001umu4251h4kbi','cmodjcq0n0026umosw1i163ih','http://localhost:5000/uploads/1777152948683-2.jpeg',2,'2026-04-25 21:35:48.884','2026-04-25 21:35:48.884',NULL);
/*!40000 ALTER TABLE `CarImage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CarType`
--

DROP TABLE IF EXISTS `CarType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CarType` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CarType_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CarType`
--

LOCK TABLES `CarType` WRITE;
/*!40000 ALTER TABLE `CarType` DISABLE KEYS */;
INSERT INTO `CarType` VALUES ('cmodjcpvb001xumos4vv0387y','SUV','Sport utility vehicle','2026-04-24 23:22:32.567','2026-04-24 23:22:32.567',NULL),('cmodjcpwa001yumos3d2chb4b','Citadine','Voiture urbaine','2026-04-24 23:22:32.602','2026-04-24 23:22:32.602',NULL);
/*!40000 ALTER TABLE `CarType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Client`
--

DROP TABLE IF EXISTS `Client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Client` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cinOrPassport` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driverLicense` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identityDocUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licenseDocUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isBlocked` tinyint(1) NOT NULL DEFAULT '0',
  `internalNote` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Client_userId_key` (`userId`),
  CONSTRAINT `Client_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Client`
--

LOCK TABLES `Client` WRITE;
/*!40000 ALTER TABLE `Client` DISABLE KEYS */;
INSERT INTO `Client` VALUES ('cmodjcpuo001wumospw4576rx','cmodjcptq001uumosohtl5cwr','Casablanca','Maarif, Casablanca','AB123456','DL-998877',NULL,NULL,0,NULL,'2026-04-24 23:22:32.544','2026-04-25 22:11:43.779',NULL),('cmofu9yl70002umm88l69apiz','cmofu9yl60001umm8qc7ijmem','Casablanca','Rue test','AB123456','DL998877','','',0,NULL,'2026-04-26 14:03:52.024','2026-04-26 14:03:52.024',NULL);
/*!40000 ALTER TABLE `Client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Contract`
--

DROP TABLE IF EXISTS `Contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contract` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contractNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contentSnapshot` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Contract_reservationId_key` (`reservationId`),
  UNIQUE KEY `Contract_contractNumber_key` (`contractNumber`),
  CONSTRAINT `Contract_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contract`
--

LOCK TABLES `Contract` WRITE;
/*!40000 ALTER TABLE `Contract` DISABLE KEYS */;
INSERT INTO `Contract` VALUES ('cmoew8dqh000yumu4cgwqerbk','cmodjcqbo002humos62ajuslg','CTR-55050988','C:\\Users\\pc\\Downloads\\gestion location\\car-rental-platform\\backend\\src\\uploads\\contracts\\CTR-55050988.pdf','{\"car\": \"Dacia Duster\", \"endDate\": \"2026-04-27T23:22:33.150Z\", \"startDate\": \"2026-04-24T23:22:33.150Z\", \"agencyName\": \"Atlas Drive\", \"clientName\": \"Sara Bennani\", \"totalPrice\": \"2095\", \"generalTerms\": \"Le locataire doit presenter une piece d\'identite valide, un permis de conduire en cours de validite et un moyen de garantie accepte par l\'agence.\\nLe vehicule doit etre restitue a la date convenue, avec ses papiers, ses cles et un niveau de carburant equivalent a celui du depart, sauf accord contraire.\\nLa circulation du vehicule est limitee au territoire marocain sauf autorisation ecrite expresse de l\'agence.\\nEn cas d\'accident, de vol ou de dommage important, le locataire doit avertir l\'agence immediatement et fournir un constat ou une declaration officielle dans les 24 heures.\\nLa caution couvre notamment la franchise, les dommages non couverts, les accessoires manquants, les cles perdues et les frais contractuels annexes.\\nToute prolongation de location doit etre approuvee par l\'agence avant l\'expiration du contrat initial.\"}','2026-04-25 22:10:51.401','2026-04-25 23:16:31.976',NULL);
/*!40000 ALTER TABLE `Contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DocumentSetting`
--

DROP TABLE IF EXISTS `DocumentSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DocumentSetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contractTemplate` text COLLATE utf8mb4_unicode_ci,
  `generalTerms` text COLLATE utf8mb4_unicode_ci,
  `privacyPolicy` text COLLATE utf8mb4_unicode_ci,
  `legalNotice` text COLLATE utf8mb4_unicode_ci,
  `invoiceTemplate` text COLLATE utf8mb4_unicode_ci,
  `paymentReceiptTemplate` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `DocumentSetting_agencyId_key` (`agencyId`),
  CONSTRAINT `DocumentSetting_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `Agency` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DocumentSetting`
--

LOCK TABLES `DocumentSetting` WRITE;
/*!40000 ALTER TABLE `DocumentSetting` DISABLE KEYS */;
INSERT INTO `DocumentSetting` VALUES ('cmodjcox4000bumosi8vc6htu','cmodjcoqj0000umosrkm33xws','Contrat de location Atlas Drive','Le locataire doit presenter une piece d\'identite valide, un permis de conduire en cours de validite et un moyen de garantie accepte par l\'agence.\nLe vehicule doit etre restitue a la date convenue, avec ses papiers, ses cles et un niveau de carburant equivalent a celui du depart, sauf accord contraire.\nLa circulation du vehicule est limitee au territoire marocain sauf autorisation ecrite expresse de l\'agence.\nEn cas d\'accident, de vol ou de dommage important, le locataire doit avertir l\'agence immediatement et fournir un constat ou une declaration officielle dans les 24 heures.\nLa caution couvre notamment la franchise, les dommages non couverts, les accessoires manquants, les cles perdues et les frais contractuels annexes.\nToute prolongation de location doit etre approuvee par l\'agence avant l\'expiration du contrat initial.','Les donnees sont traitees de facon securisee.','Informations legales de l\'agence.',NULL,NULL,'2026-04-24 23:22:31.336','2026-04-25 23:13:02.098'),('cmodjcp78000lumosksaka4i5','cmodjcosc0001umoshhypx3r1','Contrat de location Ocean Rent','Le locataire doit presenter une piece d\'identite valide, un permis de conduire en cours de validite et un moyen de garantie accepte par l\'agence.\nLe vehicule doit etre restitue a la date convenue, avec ses papiers, ses cles et un niveau de carburant equivalent a celui du depart, sauf accord contraire.\nLa circulation du vehicule est limitee au territoire marocain sauf autorisation ecrite expresse de l\'agence.\nEn cas d\'accident, de vol ou de dommage important, le locataire doit avertir l\'agence immediatement et fournir un constat ou une declaration officielle dans les 24 heures.\nLa caution couvre notamment la franchise, les dommages non couverts, les accessoires manquants, les cles perdues et les frais contractuels annexes.\nToute prolongation de location doit etre approuvee par l\'agence avant l\'expiration du contrat initial.','Les donnees sont traitees de facon securisee.','Informations legales de l\'agence.',NULL,NULL,'2026-04-24 23:22:31.700','2026-04-25 23:13:02.098'),('cmogcfvgz000iumd8xp5enaep','cmogcfvaf0008umd8z86x4ouz','Contrat de location Elite Location Meknes',NULL,NULL,NULL,NULL,NULL,'2026-04-26 22:32:21.011','2026-04-26 22:32:21.011');
/*!40000 ALTER TABLE `DocumentSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Employee`
--

DROP TABLE IF EXISTS `Employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Employee` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Employee_userId_key` (`userId`),
  KEY `Employee_roleId_fkey` (`roleId`),
  CONSTRAINT `Employee_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee`
--

LOCK TABLES `Employee` WRITE;
/*!40000 ALTER TABLE `Employee` DISABLE KEYS */;
INSERT INTO `Employee` VALUES ('cmodjcpsz001sumos5562p9ny','cmodjcps2001qumos3ixjymzi','cmodjcp8s000numos2aeu9tor','Directeur d\'agence',NULL,1,'2026-04-24 23:22:32.483','2026-04-25 22:23:10.429',NULL),('cmoeyxded0000um6kgl7a7kly','cmoeyxdef0002um6kww6dqp6k','cmodjcp9q000oumos3r681c9b','AGENT',NULL,1,'2026-04-25 23:26:16.596','2026-04-25 23:26:16.596',NULL);
/*!40000 ALTER TABLE `Employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NotificationSetting`
--

DROP TABLE IF EXISTS `NotificationSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NotificationSetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `smtpHost` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtpPort` int DEFAULT NULL,
  `smtpUser` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `smtpPassword` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emailNotificationsEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `whatsappNotificationsEnabled` tinyint(1) NOT NULL DEFAULT '0',
  `internalNotificationsEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `autoClientMessage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autoAdminMessage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `templates` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `NotificationSetting_agencyId_key` (`agencyId`),
  CONSTRAINT `NotificationSetting_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `Agency` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NotificationSetting`
--

LOCK TABLES `NotificationSetting` WRITE;
/*!40000 ALTER TABLE `NotificationSetting` DISABLE KEYS */;
INSERT INTO `NotificationSetting` VALUES ('cmodjcow60009umosrnk8a9te','cmodjcoqj0000umosrkm33xws',NULL,NULL,'superadmin@agency.com','password123',0,1,1,'Merci pour votre reservation.','Nouvelle reservation a traiter.','{\"newReservation\": \"Une nouvelle reservation a ete creee.\", \"reservationRefused\": \"Votre reservation a ete refusee.\", \"reservationConfirmed\": \"Votre reservation est confirmee.\"}','2026-04-24 23:22:31.302','2026-04-24 23:22:31.302'),('cmodjcp42000jumosq1489r2e','cmodjcosc0001umoshhypx3r1',NULL,NULL,NULL,NULL,0,0,1,'Merci pour votre reservation.','Nouvelle reservation a traiter.','{\"newReservation\": \"Une nouvelle reservation a ete creee.\", \"reservationRefused\": \"Votre reservation a ete refusee.\", \"reservationConfirmed\": \"Votre reservation est confirmee.\"}','2026-04-24 23:22:31.586','2026-04-24 23:22:31.586'),('cmogcfvfw000gumd8xed8r3eg','cmogcfvaf0008umd8z86x4ouz',NULL,NULL,NULL,NULL,0,0,1,NULL,NULL,NULL,'2026-04-26 22:32:20.971','2026-04-26 22:32:20.971');
/*!40000 ALTER TABLE `NotificationSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Option`
--

DROP TABLE IF EXISTS `Option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Option` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `pricingType` enum('FIXED','DAILY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Option_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Option`
--

LOCK TABLES `Option` WRITE;
/*!40000 ALTER TABLE `Option` DISABLE KEYS */;
INSERT INTO `Option` VALUES ('cmodjcq7f002bumosdcgv5h0w','Chauffeur','Chauffeur professionnel',350.00,'DAILY',1,'2026-04-24 23:22:33.003','2026-04-25 22:25:52.218',NULL),('cmodjcq88002cumos21khsp7i','Siege bebe','Securite bebe',40.00,'DAILY',1,'2026-04-24 23:22:33.032','2026-04-24 23:22:33.032',NULL),('cmodjcq92002dumosih33airu','GPS','Navigation integree',35.00,'DAILY',1,'2026-04-24 23:22:33.062','2026-04-24 23:22:33.062',NULL),('cmodjcq9n002eumosxjp2tjep','Livraison','Livraison a domicile',150.00,'FIXED',1,'2026-04-24 23:22:33.083','2026-04-24 23:22:33.083',NULL),('cmodjcqaj002fumost3pclq29','Assurance complete','Couverture avancee',120.00,'DAILY',1,'2026-04-24 23:22:33.116','2026-04-24 23:22:33.116',NULL);
/*!40000 ALTER TABLE `Option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Pack`
--

DROP TABLE IF EXISTS `Pack`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Pack` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pricingType` enum('FIXED','PERCENTAGE','DAILY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `pricingValue` decimal(10,2) NOT NULL,
  `includedKm` int DEFAULT NULL,
  `hasInsurance` tinyint(1) NOT NULL DEFAULT '0',
  `includesDriver` tinyint(1) NOT NULL DEFAULT '0',
  `includesDelivery` tinyint(1) NOT NULL DEFAULT '0',
  `conditions` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Pack_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Pack`
--

LOCK TABLES `Pack` WRITE;
/*!40000 ALTER TABLE `Pack` DISABLE KEYS */;
INSERT INTO `Pack` VALUES ('cmodjcq4u0028umos2zznrfb2','Pack Economique','Solution simple pour petits budgets.','FIXED',0.00,150,0,0,0,'',1,'2026-04-24 23:22:32.910','2026-04-25 22:23:38.061',NULL),('cmodjcq5u0029umosdinxmtzr','Pack Standard','Bon equilibre entre prix et confort.','DAILY',80.00,250,1,0,0,NULL,1,'2026-04-24 23:22:32.947','2026-04-24 23:22:32.947',NULL),('cmodjcq6k002aumosl5nta0z0','Pack Premium','Couverture etendue et services inclus.','PERCENTAGE',15.00,350,1,0,1,NULL,1,'2026-04-24 23:22:32.972','2026-04-24 23:22:32.972',NULL);
/*!40000 ALTER TABLE `Pack` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payment`
--

DROP TABLE IF EXISTS `Payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Payment` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amountTotal` decimal(10,2) NOT NULL,
  `amountPaid` decimal(10,2) NOT NULL,
  `remaining` decimal(10,2) NOT NULL,
  `method` enum('CASH','CARD','BANK_TRANSFER','PAYPAL','STRIPE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('UNPAID','PARTIALLY_PAID','PAID','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Payment_reservationId_fkey` (`reservationId`),
  CONSTRAINT `Payment_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
INSERT INTO `Payment` VALUES ('cmofu9yog0007umm8z26p18d5','cmofu9yof0004umm8n1uo9a20',1270.00,254.00,1016.00,'CASH','PARTIALLY_PAID',NULL,'2026-04-26 14:03:52.143','2026-04-26 14:03:52.143',NULL),('seed-payment-1','cmodjcqbo002humos62ajuslg',2095.00,419.00,1676.00,'CASH','PARTIALLY_PAID',NULL,'2026-04-24 23:22:33.241','2026-04-24 23:22:33.241',NULL);
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permission`
--

DROP TABLE IF EXISTS `Permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permission` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permission_name_key` (`name`),
  UNIQUE KEY `Permission_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permission`
--

LOCK TABLES `Permission` WRITE;
/*!40000 ALTER TABLE `Permission` DISABLE KEYS */;
INSERT INTO `Permission` VALUES ('cmodjcpag000pumosv4ltxkgu','Voir les reservations','reservations.view','reservations','2026-04-24 23:22:31.816','2026-04-24 23:22:31.816',NULL),('cmodjcpbc000qumosez6bijzf','Modifier les reservations','reservations.edit','reservations','2026-04-24 23:22:31.848','2026-04-24 23:22:31.848',NULL),('cmodjcpcu000rumos6un0j5hw','Supprimer les reservations','reservations.delete','reservations','2026-04-24 23:22:31.902','2026-04-24 23:22:31.902',NULL),('cmodjcpgl000sumosfxwf403v','Gerer les voitures','cars.manage','cars','2026-04-24 23:22:32.037','2026-04-24 23:22:32.037',NULL),('cmodjcph3000tumospk1xv85z','Gerer les clients','clients.manage','clients','2026-04-24 23:22:32.055','2026-04-24 23:22:32.055',NULL),('cmodjcpiu000uumoswipl7e92','Gerer les paiements','payments.manage','payments','2026-04-24 23:22:32.118','2026-04-24 23:22:32.118',NULL),('cmodjcpjq000vumos0x5nr60a','Gerer les parametres','settings.manage','settings','2026-04-24 23:22:32.151','2026-04-24 23:22:32.151',NULL),('cmodjcpkf000wumosy8cq62yf','Generer les contrats','contracts.generate','contracts','2026-04-24 23:22:32.175','2026-04-24 23:22:32.175',NULL),('cmodjcpkz000xumos59r6bnly','Gerer les employes','employees.manage','employees','2026-04-24 23:22:32.196','2026-04-24 23:22:32.196',NULL),('cmodjcplr000yumospdapjief','Voir le dashboard','dashboard.view','dashboard','2026-04-24 23:22:32.224','2026-04-24 23:22:32.224',NULL),('cmodjcpme000zumos6re1820w','Gerer les agences','agencies.manage','agencies','2026-04-24 23:22:32.247','2026-04-24 23:22:32.247',NULL),('cmofs125v0000ume0z72nd29o','Voir les audit logs','audit.logs.view','audit','2026-04-26 13:00:57.521','2026-04-26 13:00:57.521',NULL),('cmofs12at0001ume0e2d28sot','Gerer les feature flags','featureflags.manage','platform','2026-04-26 13:00:57.701','2026-04-26 13:00:57.701',NULL);
/*!40000 ALTER TABLE `Permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reservation`
--

DROP TABLE IF EXISTS `Reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Reservation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `clientId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `carId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `packId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employeeId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `totalDays` int NOT NULL,
  `basePrice` decimal(10,2) NOT NULL,
  `packPrice` decimal(10,2) NOT NULL,
  `optionsPrice` decimal(10,2) NOT NULL,
  `bookingFees` decimal(10,2) NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `advanceAmount` decimal(10,2) NOT NULL,
  `remainingAmount` decimal(10,2) NOT NULL,
  `status` enum('PENDING','CONFIRMED','REFUSED','CANCELLED','COMPLETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `finalPrice` decimal(10,2) DEFAULT NULL,
  `internalNote` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Reservation_reference_key` (`reference`),
  KEY `Reservation_agencyId_fkey` (`agencyId`),
  KEY `Reservation_clientId_fkey` (`clientId`),
  KEY `Reservation_carId_fkey` (`carId`),
  KEY `Reservation_packId_fkey` (`packId`),
  KEY `Reservation_employeeId_fkey` (`employeeId`),
  CONSTRAINT `Reservation_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `Agency` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Reservation_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Reservation_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Reservation_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Reservation_packId_fkey` FOREIGN KEY (`packId`) REFERENCES `Pack` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reservation`
--

LOCK TABLES `Reservation` WRITE;
/*!40000 ALTER TABLE `Reservation` DISABLE KEYS */;
INSERT INTO `Reservation` VALUES ('cmodjcqbo002humos62ajuslg','RES-0001','cmodjcoqj0000umosrkm33xws','cmodjcpuo001wumospw4576rx','cmodjcpx50020umosz1r48q01','cmodjcq5u0029umosdinxmtzr',NULL,'2026-04-24 23:22:33.150','2026-04-27 23:22:33.150',3,1650.00,240.00,105.00,100.00,2095.00,419.00,1676.00,'CONFIRMED',NULL,NULL,'2026-04-24 23:22:33.156','2026-04-25 21:42:19.404',NULL),('cmofu9yof0004umm8n1uo9a20','RES-232005','cmodjcoqj0000umosrkm33xws','cmofu9yl70002umm88l69apiz','cmodjcpx50020umosz1r48q01','cmodjcq4u0028umos2zznrfb2',NULL,'2026-05-10 00:00:00.000','2026-05-12 00:00:00.000',2,1100.00,0.00,70.00,100.00,1270.00,254.00,1016.00,'PENDING',NULL,NULL,'2026-04-26 14:03:52.143','2026-04-26 14:03:52.143',NULL);
/*!40000 ALTER TABLE `Reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReservationOption`
--

DROP TABLE IF EXISTS `ReservationOption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReservationOption` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `optionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `pricingType` enum('FIXED','DAILY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ReservationOption_reservationId_optionId_key` (`reservationId`,`optionId`),
  KEY `ReservationOption_optionId_fkey` (`optionId`),
  CONSTRAINT `ReservationOption_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `Option` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ReservationOption_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `Reservation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReservationOption`
--

LOCK TABLES `ReservationOption` WRITE;
/*!40000 ALTER TABLE `ReservationOption` DISABLE KEYS */;
INSERT INTO `ReservationOption` VALUES ('cmodjcqd1002jumosr1rm62zm','cmodjcqbo002humos62ajuslg','cmodjcq92002dumosih33airu','GPS',35.00,'DAILY','2026-04-24 23:22:33.205','2026-04-24 23:22:33.205'),('cmofu9yof0006umm8ug6a6e2o','cmofu9yof0004umm8n1uo9a20','cmodjcq92002dumosih33airu','GPS',35.00,'DAILY','2026-04-26 14:03:52.143','2026-04-26 14:03:52.143');
/*!40000 ALTER TABLE `ReservationOption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ReservationSetting`
--

DROP TABLE IF EXISTS `ReservationSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ReservationSetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `minimumRentalDays` int NOT NULL DEFAULT '1',
  `maximumRentalDays` int NOT NULL DEFAULT '30',
  `bookingFees` decimal(10,2) NOT NULL,
  `requiredAdvancePercent` decimal(5,2) NOT NULL,
  `defaultDepositAmount` decimal(10,2) NOT NULL,
  `cancellationPolicy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `generalTerms` text COLLATE utf8mb4_unicode_ci,
  `reservationSuccessMessage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allowGuestReservation` tinyint(1) NOT NULL DEFAULT '1',
  `allowOnlinePayment` tinyint(1) NOT NULL DEFAULT '0',
  `allowDocumentUpload` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ReservationSetting_agencyId_key` (`agencyId`),
  CONSTRAINT `ReservationSetting_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `Agency` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ReservationSetting`
--

LOCK TABLES `ReservationSetting` WRITE;
/*!40000 ALTER TABLE `ReservationSetting` DISABLE KEYS */;
INSERT INTO `ReservationSetting` VALUES ('cmodjcov40007umos0624r7bx','cmodjcoqj0000umosrkm33xws',1,30,100.00,20.00,3000.00,'Annulation gratuite jusqu\'a 48h avant le depart.','Le locataire doit presenter une piece d\'identite valide, un permis de conduire en cours de validite et un moyen de garantie accepte par l\'agence.\nLe vehicule doit etre restitue a la date convenue, avec ses papiers, ses cles et un niveau de carburant equivalent a celui du depart, sauf accord contraire.\nLa circulation du vehicule est limitee au territoire marocain sauf autorisation ecrite expresse de l\'agence.\nEn cas d\'accident, de vol ou de dommage important, le locataire doit avertir l\'agence immediatement et fournir un constat ou une declaration officielle dans les 24 heures.\nLa caution couvre notamment la franchise, les dommages non couverts, les accessoires manquants, les cles perdues et les frais contractuels annexes.\nToute prolongation de location doit etre approuvee par l\'agence avant l\'expiration du contrat initial.','Votre demande a bien ete enregistree.',1,0,1,'2026-04-24 23:22:31.264','2026-04-25 23:13:02.357'),('cmodjcp2z000humosowoa89xc','cmodjcosc0001umoshhypx3r1',1,30,100.00,20.00,3000.00,'Annulation gratuite jusqu\'a 48h avant le depart.','Le locataire doit presenter une piece d\'identite valide, un permis de conduire en cours de validite et un moyen de garantie accepte par l\'agence.\nLe vehicule doit etre restitue a la date convenue, avec ses papiers, ses cles et un niveau de carburant equivalent a celui du depart, sauf accord contraire.\nLa circulation du vehicule est limitee au territoire marocain sauf autorisation ecrite expresse de l\'agence.\nEn cas d\'accident, de vol ou de dommage important, le locataire doit avertir l\'agence immediatement et fournir un constat ou une declaration officielle dans les 24 heures.\nLa caution couvre notamment la franchise, les dommages non couverts, les accessoires manquants, les cles perdues et les frais contractuels annexes.\nToute prolongation de location doit etre approuvee par l\'agence avant l\'expiration du contrat initial.','Votre demande a bien ete enregistree.',1,0,1,'2026-04-24 23:22:31.547','2026-04-25 23:13:02.357'),('cmogcfve5000eumd8daryttnl','cmogcfvaf0008umd8z86x4ouz',1,30,100.00,20.00,3000.00,'Annulation gratuite jusqu\'a 48h avant le depart.','Permis valide et caution obligatoire.','Votre demande a bien ete enregistree.',1,0,1,'2026-04-26 22:32:20.907','2026-04-26 22:32:20.907');
/*!40000 ALTER TABLE `ReservationSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Role`
--

DROP TABLE IF EXISTS `Role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Role` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isSystem` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_name_key` (`name`),
  UNIQUE KEY `Role_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Role`
--

LOCK TABLES `Role` WRITE;
/*!40000 ALTER TABLE `Role` DISABLE KEYS */;
INSERT INTO `Role` VALUES ('cmodjcp7y000mumos4wtm2uci','Super Admin','SUPER_ADMIN','Acces total a la plateforme',1,'2026-04-24 23:22:31.727','2026-04-24 23:22:31.727',NULL),('cmodjcp8s000numos2aeu9tor','Admin Agence','ADMIN_AGENCY','Gestion operationnelle de l\'agence',1,'2026-04-24 23:22:31.757','2026-04-25 23:46:55.676',NULL),('cmodjcp9q000oumos3r681c9b','Employe','EMPLOYEE','Acces limite selon permissions',1,'2026-04-24 23:22:31.790','2026-04-24 23:22:31.790',NULL);
/*!40000 ALTER TABLE `Role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RolePermission`
--

DROP TABLE IF EXISTS `RolePermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RolePermission` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissionId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `RolePermission_roleId_permissionId_key` (`roleId`,`permissionId`),
  KEY `RolePermission_permissionId_fkey` (`permissionId`),
  CONSTRAINT `RolePermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `Permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RolePermission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RolePermission`
--

LOCK TABLES `RolePermission` WRITE;
/*!40000 ALTER TABLE `RolePermission` DISABLE KEYS */;
INSERT INTO `RolePermission` VALUES ('cmodjcpq30010umosno4tur40','cmodjcp7y000mumos4wtm2uci','cmodjcpag000pumosv4ltxkgu','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq30011umos60ijw96y','cmodjcp7y000mumos4wtm2uci','cmodjcpbc000qumosez6bijzf','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq30012umosimysfxeo','cmodjcp7y000mumos4wtm2uci','cmodjcpcu000rumos6un0j5hw','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq30013umos3rcln90y','cmodjcp7y000mumos4wtm2uci','cmodjcpgl000sumosfxwf403v','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq30014umoschtrr02r','cmodjcp7y000mumos4wtm2uci','cmodjcph3000tumospk1xv85z','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq30015umosexl2ppto','cmodjcp7y000mumos4wtm2uci','cmodjcpiu000uumoswipl7e92','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq30016umoscdu2w826','cmodjcp7y000mumos4wtm2uci','cmodjcpjq000vumos0x5nr60a','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq30017umosjokj9t9v','cmodjcp7y000mumos4wtm2uci','cmodjcpkf000wumosy8cq62yf','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq30018umosimdvtlu8','cmodjcp7y000mumos4wtm2uci','cmodjcpkz000xumos59r6bnly','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq30019umosmay3uz0z','cmodjcp7y000mumos4wtm2uci','cmodjcplr000yumospdapjief','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq3001aumosr9ls2xw8','cmodjcp7y000mumos4wtm2uci','cmodjcpme000zumos6re1820w','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq3001lumos5iocg0wt','cmodjcp9q000oumos3r681c9b','cmodjcpag000pumosv4ltxkgu','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmodjcpq3001mumosfrk3nebo','cmodjcp9q000oumos3r681c9b','cmodjcplr000yumospdapjief','2026-04-24 23:22:32.378','2026-04-24 23:22:32.378'),('cmoeznxh9000dum8oz6m9h5gr','cmodjcp8s000numos2aeu9tor','cmodjcpag000pumosv4ltxkgu','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676'),('cmoeznxh9000eum8oqznnmp63','cmodjcp8s000numos2aeu9tor','cmodjcpbc000qumosez6bijzf','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676'),('cmoeznxh9000fum8ovrhmn1mg','cmodjcp8s000numos2aeu9tor','cmodjcpcu000rumos6un0j5hw','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676'),('cmoeznxh9000gum8oii2pj8io','cmodjcp8s000numos2aeu9tor','cmodjcpgl000sumosfxwf403v','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676'),('cmoeznxh9000hum8obr3cvf8r','cmodjcp8s000numos2aeu9tor','cmodjcph3000tumospk1xv85z','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676'),('cmoeznxh9000ium8oc8jqgzl9','cmodjcp8s000numos2aeu9tor','cmodjcpiu000uumoswipl7e92','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676'),('cmoeznxh9000jum8o1vgcd2g7','cmodjcp8s000numos2aeu9tor','cmodjcpkf000wumosy8cq62yf','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676'),('cmoeznxh9000kum8o2qk5a9ln','cmodjcp8s000numos2aeu9tor','cmodjcpkz000xumos59r6bnly','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676'),('cmoeznxh9000lum8ol8l7rr4z','cmodjcp8s000numos2aeu9tor','cmodjcplr000yumospdapjief','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676'),('cmoeznxh9000mum8oncxon8b1','cmodjcp8s000numos2aeu9tor','cmodjcpme000zumos6re1820w','2026-04-25 23:46:55.676','2026-04-25 23:46:55.676');
/*!40000 ALTER TABLE `RolePermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('SUPER_ADMIN','ADMIN','EMPLOYEE','CLIENT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `roleId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agencyId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_roleId_fkey` (`roleId`),
  KEY `User_agencyId_fkey` (`agencyId`),
  CONSTRAINT `User_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `Agency` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('cmodjcpr4001oumossp4h2qv2','Super','Admin','superadmin@agency.com','+212600000001','$2b$10$HohW/3E4/00fmsP.qfUleuRuTRlfGZZ0rhngiSJ.hO1R9R7vkTVWO','SUPER_ADMIN',1,'cmodjcp7y000mumos4wtm2uci',NULL,'2026-04-24 23:22:32.416','2026-04-24 23:22:32.416',NULL),('cmodjcps2001qumos3ixjymzi','Agence','Admin','admin@agency.com','+212600000002','$2b$10$HohW/3E4/00fmsP.qfUleuRuTRlfGZZ0rhngiSJ.hO1R9R7vkTVWO','ADMIN',1,'cmodjcp8s000numos2aeu9tor','cmodjcoqj0000umosrkm33xws','2026-04-24 23:22:32.450','2026-04-24 23:22:32.450',NULL),('cmodjcptq001uumosohtl5cwr','Sara','Bennani','client@example.com','+212600000003','$2b$10$HohW/3E4/00fmsP.qfUleuRuTRlfGZZ0rhngiSJ.hO1R9R7vkTVWO','CLIENT',1,NULL,'cmodjcoqj0000umosrkm33xws','2026-04-24 23:22:32.510','2026-04-24 23:22:32.510',NULL),('cmoeyvc4u0002um0wy22nc5d8','TMP','USER','tmp-1777159481635@example.com',NULL,'x','EMPLOYEE',1,'cmodjcp9q000oumos3r681c9b','cmodjcoqj0000umosrkm33xws','2026-04-25 23:24:41.645','2026-04-25 23:24:41.645',NULL),('cmoeyxdef0002um6kww6dqp6k','SALLAM','LEBRIJI','sallam.lebriji@gmail.com','77373','$2b$10$vhB.iObDZFfZUKc31EweTu4l4GeU8ZfPK4F592ajHFe2Po0idssKq','EMPLOYEE',1,'cmodjcp9q000oumos3r681c9b','cmodjcoqj0000umosrkm33xws','2026-04-25 23:26:16.596','2026-04-25 23:26:16.596',NULL),('cmofu9yl60001umm8qc7ijmem','Test','Client','client.test.20260426@example.com','0600000000','guest-account','CLIENT',1,NULL,'cmodjcoqj0000umosrkm33xws','2026-04-26 14:03:52.024','2026-04-26 14:03:52.024',NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VisualSetting`
--

DROP TABLE IF EXISTS `VisualSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VisualSetting` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `agencyId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `primaryColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#0f766e',
  `secondaryColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#f59e0b',
  `themeMode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'light',
  `coverImageUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `homepageImages` json DEFAULT NULL,
  `homepageText` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primaryButtonText` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visibleSections` json DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `VisualSetting_agencyId_key` (`agencyId`),
  CONSTRAINT `VisualSetting_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `Agency` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VisualSetting`
--

LOCK TABLES `VisualSetting` WRITE;
/*!40000 ALTER TABLE `VisualSetting` DISABLE KEYS */;
INSERT INTO `VisualSetting` VALUES ('cmodjcouf0005umos5yn670bk','cmodjcoqj0000umosrkm33xws','#0f766e','#f59e0b','light',NULL,'null','Reservez votre voiture en quelques clics.','','null','2026-04-24 23:22:31.239','2026-04-25 22:41:33.180'),('cmodjcoz1000fumos5q1cc7wp','cmodjcosc0001umoshhypx3r1','#0f4c81','#fb923c','light',NULL,NULL,'Reservez votre voiture en quelques clics.',NULL,NULL,'2026-04-24 23:22:31.405','2026-04-24 23:22:31.405'),('cmogcfvd4000cumd890bk06ox','cmogcfvaf0008umd8z86x4ouz','#750f0f','#f50a9f','light',NULL,'null','Bienvenue chez Elite Location Meknes.',NULL,'null','2026-04-26 22:32:20.871','2026-04-26 22:32:20.871');
/*!40000 ALTER TABLE `VisualSetting` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27  0:07:12


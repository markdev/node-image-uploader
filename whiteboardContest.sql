-- MySQL dump 10.15  Distrib 10.1.0-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: sunzora1
-- ------------------------------------------------------
-- Server version	10.1.0-MariaDB-1~trusty-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contests`
--

DROP TABLE IF EXISTS `contests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) DEFAULT NULL,
  `title` varchar(40) DEFAULT NULL,
  `banner` varchar(40) DEFAULT NULL,
  `rules` text,
  `deadline` datetime DEFAULT NULL,
  `judging` enum('public','invite') DEFAULT NULL,
  `competition` enum('public','invite') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uId` (`uId`),
  CONSTRAINT `contests_ibfk_1` FOREIGN KEY (`uId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contests`
--

LOCK TABLES `contests` WRITE;
/*!40000 ALTER TABLE `contests` DISABLE KEYS */;
INSERT INTO `contests` VALUES (1,1,'Whiteboard Pics','c557cba6b28660921bc4f66c914ada62.jpg','Must be an original whiteboard pic','2014-11-05 12:00:00','public','public');
/*!40000 ALTER TABLE `contests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entries`
--

DROP TABLE IF EXISTS `entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uId` int(11) DEFAULT NULL,
  `cId` int(11) DEFAULT NULL,
  `picture` varchar(40) DEFAULT NULL,
  `uploadTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uId` (`uId`),
  KEY `cId` (`cId`),
  CONSTRAINT `entries_ibfk_1` FOREIGN KEY (`uId`) REFERENCES `users` (`id`),
  CONSTRAINT `entries_ibfk_2` FOREIGN KEY (`cId`) REFERENCES `contests` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entries`
--

LOCK TABLES `entries` WRITE;
/*!40000 ALTER TABLE `entries` DISABLE KEYS */;
INSERT INTO `entries` VALUES (1,4,1,'b9a8aa3a2d9f5f6614ea2fc692312fb6.jpg','2014-10-05 22:32:19'),(2,5,1,'0b84001e51dce1579100446e5b42f341.jpg','2014-10-05 22:33:13'),(3,6,1,'b92c70cc5604f9c55932e05444cf0c4d.jpg','2014-10-05 22:34:26'),(4,7,1,'046c98dd4d0f1e575a089f67c79d875a.jpg','2014-10-05 22:35:22'),(5,8,1,'0ca71389a9daa2efe7a3430557773150.jpg','2014-10-05 22:35:54'),(6,9,1,'bb99edc181bc8e176aa15191774d59f9.jpg','2014-10-05 22:36:32'),(7,10,1,'5eafd4b6c30f96f40e05531ca8d51c1c.jpg','2014-10-05 22:37:19'),(8,11,1,'819093ade740c8aa45d507eb84464b28.jpg','2014-10-05 22:37:47'),(9,12,1,'ef6846a3e026593317da8f3b54d50071.jpg','2014-10-05 22:38:23'),(10,13,1,'2e0731931f5fddb3207e91cd40b4f484.jpg','2014-10-05 22:38:57'),(11,14,1,'f4f39d7182d54c3414fe27866c4b8681.jpg','2014-10-05 22:39:26');
/*!40000 ALTER TABLE `entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `judges`
--

DROP TABLE IF EXISTS `judges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `judges` (
  `uId` int(11) DEFAULT NULL,
  `cId` int(11) DEFAULT NULL,
  `eId` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `judgedOn` datetime DEFAULT NULL,
  KEY `uId` (`uId`),
  KEY `cId` (`cId`),
  KEY `eId` (`eId`),
  CONSTRAINT `judges_ibfk_1` FOREIGN KEY (`uId`) REFERENCES `users` (`id`),
  CONSTRAINT `judges_ibfk_2` FOREIGN KEY (`cId`) REFERENCES `contests` (`id`),
  CONSTRAINT `judges_ibfk_3` FOREIGN KEY (`eId`) REFERENCES `entries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `judges`
--

LOCK TABLES `judges` WRITE;
/*!40000 ALTER TABLE `judges` DISABLE KEYS */;
/*!40000 ALTER TABLE `judges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `senderId` int(11) DEFAULT NULL,
  `recipId` int(11) DEFAULT NULL,
  `content` text,
  `sentOn` datetime DEFAULT NULL,
  `seen` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `senderId` (`senderId`),
  KEY `recipId` (`recipId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`),
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`recipId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tagAssociations`
--

DROP TABLE IF EXISTS `tagAssociations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tagAssociations` (
  `tId` int(11) DEFAULT NULL,
  `cId` int(11) DEFAULT NULL,
  KEY `tId` (`tId`),
  KEY `cId` (`cId`),
  CONSTRAINT `tagAssociations_ibfk_1` FOREIGN KEY (`tId`) REFERENCES `tags` (`id`),
  CONSTRAINT `tagAssociations_ibfk_2` FOREIGN KEY (`cId`) REFERENCES `contests` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tagAssociations`
--

LOCK TABLES `tagAssociations` WRITE;
/*!40000 ALTER TABLE `tagAssociations` DISABLE KEYS */;
/*!40000 ALTER TABLE `tagAssociations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userRelations`
--

DROP TABLE IF EXISTS `userRelations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userRelations` (
  `uId` int(11) DEFAULT NULL,
  `cId` int(11) DEFAULT NULL,
  `relationship` enum('creator','judge','competitor') DEFAULT NULL,
  KEY `uId` (`uId`),
  KEY `cId` (`cId`),
  CONSTRAINT `userRelations_ibfk_1` FOREIGN KEY (`uId`) REFERENCES `users` (`id`),
  CONSTRAINT `userRelations_ibfk_2` FOREIGN KEY (`cId`) REFERENCES `contests` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userRelations`
--

LOCK TABLES `userRelations` WRITE;
/*!40000 ALTER TABLE `userRelations` DISABLE KEYS */;
INSERT INTO `userRelations` VALUES (4,1,'competitor'),(5,1,'competitor'),(6,1,'competitor'),(7,1,'competitor'),(8,1,'competitor'),(9,1,'competitor'),(10,1,'competitor'),(11,1,'competitor'),(12,1,'competitor'),(13,1,'competitor'),(14,1,'competitor'),(15,1,'judge'),(16,1,'judge'),(17,1,'judge'),(18,1,'judge'),(19,1,'judge'),(20,1,'judge'),(21,1,'judge'),(22,1,'judge'),(23,1,'judge'),(24,1,'judge'),(25,1,'judge'),(26,1,'judge'),(27,1,'judge'),(28,1,'judge'),(29,1,'judge');
/*!40000 ALTER TABLE `userRelations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(40) DEFAULT NULL,
  `password` varchar(40) DEFAULT NULL,
  `avatar` varchar(40) DEFAULT NULL,
  `sex` enum('male','female','other') DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'mark.karavan@gmail.com','ea82410c7a9991816b5eeeebe195e20a','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(2,'david@hadden.com','1610838743cc90e3e4fdda748282d9b8','','male','1964-04-07 18:34:00','2014-10-05 21:46:43'),(3,'chris@acciavatti.com','6b34fe24ac2ff8103f6fce1f0da2ef57','','male','1983-07-07 15:23:00','2014-10-05 21:46:43'),(4,'a@a.com','0cc175b9c0f1b6a831c399e269772661','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(5,'b@b.com','92eb5ffee6ae2fec3ad71c777531578f','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(6,'c@c.com','4a8a08f09d37b73795649038408b5f33','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(7,'d@d.com','8277e0910d750195b448797616e091ad','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(8,'e@e.com','e1671797c52e15f763380b45e841ec32','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(9,'f@f.com','8fa14cdd754f91cc6554c9e71929cce7','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(10,'g@g.com','b2f5ff47436671b6e533d8dc3614845d','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(11,'h@h.com','2510c39011c5be704182423e3a695e91','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(12,'i@i.com','865c0c0b4ab0e063e5caa3387c1a8741','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(13,'j@j.com','363b122c528f54df4a0446b6bab05515','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(14,'k@k.com','8ce4b16b22b58894aa86c421e8759df3','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(15,'l@l.com','2db95e8e1a9267b7a1188556b2013b33','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(16,'m@m.com','6f8f57715090da2632453988d9a1501b','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(17,'n@n.com','7b8b965ad4bca0e41ab51de7b31363a1','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(18,'o@o.com','d95679752134a2d9eb61dbd7b91c4bcc','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(19,'p@p.com','83878c91171338902e0fe0fb97a8c47a','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(20,'q@q.com','7694f4a66316e53c8cdd9d9954bd611d','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(21,'r@r.com','4b43b0aee35624cd95b910189b3dc231','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(22,'s@s.com','03c7c0ace395d80182db07ae2c30f034','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(23,'t@t.com','e358efa489f58062f10dd7316b65649e','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(24,'u@u.com','7b774effe4a349c6dd82ad4f4f21d34c','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(25,'v@v.com','9e3669d19b675bd57058fd4664205d2a','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(26,'w@w.com','f1290186a5d0b1ceab27f4e77c0c5d68','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(27,'y@y.com','415290769594460e2e485922904f345d','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(28,'x@x.com','9dd4e461268c8034f5c8564e155c67a6','','male','1983-04-07 18:34:00','2014-10-05 21:46:43'),(29,'z@z.com','fbade9e36a3f36d3d676c1b808451dd7','','male','1983-04-07 18:34:00','2014-10-05 21:46:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-10-05 22:44:11

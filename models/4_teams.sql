SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `server_id` varchar(20) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `name` varchar(20) NOT NULL,
  `color` varchar(20) NOT NULL,
  `slug` varchar(6) NOT NULL,
  `executed` boolean NOT NULL default 0,
  `role_id` varchar(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `minecraft` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `server_id` varchar(20) NOT NULL,
  `user_id` varchar(20) NOT NULL,
  `pseudo` varchar(16) NOT NULL,
  `executed` boolean NOT NULL default 0,
  `team_id` int(11),
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_team_id` FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `webhook` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `channel_id` varchar(20) NOT NULL,
  `url` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
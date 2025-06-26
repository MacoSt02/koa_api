DROP DATABASE IF EXISTS `koa_db`;
CREATE DATABASE `koa_db`;
USE `koa_db`;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `role_name` VARCHAR(100) NOT NULL UNIQUE,
  `role_description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `permission_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `permission_name` VARCHAR(100) NOT NULL UNIQUE,
  `permission_description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `role_id` INT UNSIGNED NOT NULL,
  `permission_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`permission_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `user_id` INT UNSIGNED NOT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO koa_db.users(name, email, password) VALUES
('Admin', 'admin@koapi.com', '$2a$12$jmVh70142IyDKusHmIxZq.nEYb91EJvWpCPOa/MJ1afKXia7nyTq2'),
('User', 'user@koapi.com', '$2a$12$UeWYghlvxRrUhjwCDod7COBim3epNIo7m3Eq0yy9WjmubZh/fJM.i');

INSERT INTO koa_db.roles(role_name, role_description) VALUES
('admin', 'Role for admin users'),
('user', 'Role for common users');

INSERT INTO koa_db.permissions(permission_name, permission_description) VALUES
('users:view', 'Can view users'),
('users:create', 'Can create users'),
('users:update', 'Can update users'),
('users:delete', 'Can delete users'),
('roles:view', 'Can view roles'),
('roles:create', 'Can create roles'),
('roles:update', 'Can update roles'),
('roles:delete', 'Can delete roles'),
('permissions:view', 'Can view permissions'),
('permissions:create', 'Can create permissions'),
('permissions:update', 'Can update permissions'),
('permissions:delete', 'Can delete permissions');

INSERT INTO koa_db.role_permissions(role_id, permission_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(2, 1);

INSERT INTO koa_db.user_roles(user_id, role_id) VALUES
(1, 1),
(2, 2);
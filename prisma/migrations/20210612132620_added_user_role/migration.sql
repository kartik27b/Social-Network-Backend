-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('USER') NOT NULL DEFAULT 'USER';

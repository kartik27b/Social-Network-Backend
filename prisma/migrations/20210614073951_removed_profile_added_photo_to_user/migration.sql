/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `profile_ibfk_1`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `profilePicUrl` VARCHAR(191);

-- DropTable
DROP TABLE `Profile`;

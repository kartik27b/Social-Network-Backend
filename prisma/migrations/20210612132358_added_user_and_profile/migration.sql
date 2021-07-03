/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User.email_unique` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `email`,
    DROP COLUMN `name`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profilePicUrl` VARCHAR(191),
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Profile.userId_unique`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User.username_unique` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `Profile` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

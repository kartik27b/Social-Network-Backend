/*
  Warnings:

  - You are about to drop the column `senderId` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Conversation` DROP FOREIGN KEY `conversation_ibfk_2`;

-- AlterTable
ALTER TABLE `Conversation` DROP COLUMN `senderId`,
    ADD COLUMN `receiverId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Conversation` ADD FOREIGN KEY (`receiverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

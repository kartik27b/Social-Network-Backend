-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `message_ibfk_2`;

-- AlterTable
ALTER TABLE `Conversation` MODIFY `conversation_hash` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Message` MODIFY `conversationHash` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD FOREIGN KEY (`conversationHash`) REFERENCES `Conversation`(`conversation_hash`) ON DELETE CASCADE ON UPDATE CASCADE;

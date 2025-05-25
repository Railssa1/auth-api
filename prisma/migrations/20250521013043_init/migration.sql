/*
  Warnings:

  - You are about to drop the column `sender` on the `message` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderType` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `sender`,
    ADD COLUMN `senderId` INTEGER NOT NULL,
    ADD COLUMN `senderType` VARCHAR(191) NOT NULL,
    ADD COLUMN `topicId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `topic` ADD COLUMN `mentorId` INTEGER NULL,
    ADD COLUMN `studentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Topic` ADD CONSTRAINT `Topic_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User_Estudante`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Topic` ADD CONSTRAINT `Topic_mentorId_fkey` FOREIGN KEY (`mentorId`) REFERENCES `User_Mentor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `Topic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

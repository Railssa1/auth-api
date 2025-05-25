-- AlterTable
ALTER TABLE `topic` ADD COLUMN `chatConcluded` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `chatReadByMentor` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `chatReadByStudent` BOOLEAN NOT NULL DEFAULT false;

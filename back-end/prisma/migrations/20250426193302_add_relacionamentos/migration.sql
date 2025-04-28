/*
  Warnings:

  - You are about to drop the column `tipo` on the `Veiculo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Veiculo" DROP COLUMN "tipo",
ALTER COLUMN "id_tipo" DROP DEFAULT;

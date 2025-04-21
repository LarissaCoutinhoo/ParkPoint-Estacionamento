/*
  Warnings:

  - Added the required column `id_funcionario` to the `Entrada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entrada" ADD COLUMN     "id_funcionario" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

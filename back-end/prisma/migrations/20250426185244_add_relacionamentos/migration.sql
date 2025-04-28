/*
  Warnings:

  - You are about to drop the `Veiculos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_funcionario` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Entrada" DROP CONSTRAINT "Entrada_id_veiculo_fkey";

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "id_funcionario" INTEGER NOT NULL,
ADD COLUMN     "observacao" TEXT,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Entrada" ALTER COLUMN "data_entrada" DROP DEFAULT,
ALTER COLUMN "data_entrada" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "data_saida" DROP NOT NULL,
ALTER COLUMN "data_saida" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET DATA TYPE TEXT,
ALTER COLUMN "valor_pagar" DROP NOT NULL;

-- DropTable
DROP TABLE "Veiculos";

-- CreateTable
CREATE TABLE "TipoVeiculo" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "quantidade_vagas" INTEGER NOT NULL,

    CONSTRAINT "TipoVeiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "id_tipo" INTEGER NOT NULL DEFAULT 1,
    "tipo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "id_funcionario" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoVeiculo_descricao_key" ON "TipoVeiculo"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "Veiculo"("placa");

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_id_tipo_fkey" FOREIGN KEY ("id_tipo") REFERENCES "TipoVeiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_id_veiculo_fkey" FOREIGN KEY ("id_veiculo") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

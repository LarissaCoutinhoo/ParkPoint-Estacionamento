-- CreateTable
CREATE TABLE "Veiculos" (
    "id" SERIAL NOT NULL,
    "placa" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "tipo" BOOLEAN NOT NULL DEFAULT false,
    "modelo" TEXT NOT NULL,

    CONSTRAINT "Veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entrada" (
    "id" SERIAL NOT NULL,
    "data_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_saida" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "id_veiculo" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "valor_hora" DECIMAL(65,30) NOT NULL,
    "valor_pagar" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_id_veiculo_fkey" FOREIGN KEY ("id_veiculo") REFERENCES "Veiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrada" ADD CONSTRAINT "Entrada_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

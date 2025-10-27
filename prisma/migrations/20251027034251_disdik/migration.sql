-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Terjadwal', 'Berlangsung', 'Selesai', 'Dibatalkan');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('Menunggu', 'Dipanggil', 'Selesai', 'Dibatalkan');

-- CreateTable
CREATE TABLE "agendas" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "time" VARCHAR(10) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Terjadwal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "queueNumber" VARCHAR(20) NOT NULL,
    "service" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "nik" VARCHAR(20),
    "purpose" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "timeSlot" VARCHAR(10) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'Menunggu',
    "estimatedCallTime" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservations_queueNumber_key" ON "reservations"("queueNumber");

/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `agendas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `agendas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `agendas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "agendas" ADD COLUMN     "address" TEXT,
ADD COLUMN     "capacity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "category" VARCHAR(50) NOT NULL DEFAULT 'Lainnya',
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "organizer" VARCHAR(255) NOT NULL DEFAULT 'Dinas Pendidikan Kota Banjarmasin',
ADD COLUMN     "registrationFee" VARCHAR(100) NOT NULL DEFAULT 'Gratis',
ADD COLUMN     "slug" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "agendas_slug_key" ON "agendas"("slug");

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

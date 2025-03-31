import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const down = async () => {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
  await prisma.$executeRaw`TRUNCATE roles`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
};

const up = async () => {
  await prisma.roles.createMany({
    data: [
      {
        id: 1,
        name: "Superadmin",
        description: "Superadmin",
        business_id: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null
      }
    ]
  });
};

export default { down, up };
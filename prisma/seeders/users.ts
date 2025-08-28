import { PrismaClient } from "../../src/prisma/client";

const prisma = new PrismaClient();

const down = async () => {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
  await prisma.$executeRaw`TRUNCATE users`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
};

const up = async () => {
  await prisma.user.createMany({
    data: [
      {
        id: "76ace7de-9bd4-4479-87f5-1f9903bd3a27",
        name: "Superadmin",
        username: "superadmin",
        email: "superadmin@email.com",
        password: "$2a$12$FzZC/3mX23SoxT5y1QJxz.lWQCu9FEXQ6yBg9iHqptzMF8DfdpGlK",
        accessType: "PORTAL",
        imagePath: null,
        organizationId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
      }
    ]
  });
};

export default { down, up };
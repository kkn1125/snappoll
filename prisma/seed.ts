import { PrismaClient } from '@prisma/client';
import { ErrorCode, ErrorMessage } from '@utils/codes';

const prisma = new PrismaClient();
async function main() {
  await prisma.code.deleteMany();

  await prisma.$queryRaw`ALTER TABLE code DROP COLUMN id`;
  await prisma.$queryRaw`ALTER TABLE code ADD COLUMN id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY`;
  // await prisma.$queryRaw`ALTER SEQUENCE code_id_seq RESTART WITH 1`; // auto increment 초기화

  await prisma.$queryRaw`ALTER TABLE error_message DROP COLUMN id`;
  await prisma.$queryRaw`ALTER TABLE error_message ADD COLUMN id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY`;
  // await prisma.$queryRaw`ALTER SEQUENCE error_message_id_seq RESTART WITH 1`; // auto increment 초기화

  for (const [status, domain] of ErrorCode) {
    const errorMessage = ErrorMessage[domain].map(
      ([status, name, message]) => ({
        status,
        message,
      }),
    );
    await prisma.code.create({
      data: {
        status,
        domain,
        errorMessage: { createMany: { data: errorMessage } },
      },
      include: { errorMessage: true },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

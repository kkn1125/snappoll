import { PrismaClient } from '@prisma/client';
import { ErrorCode, ErrorMessage } from '@utils/codes';

const prisma = new PrismaClient();
async function main() {
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

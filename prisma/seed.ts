import { $Enums, PrismaClient } from '@prisma/client';
import { ErrorCode, ErrorMessage } from '@utils/codes';

const prisma = new PrismaClient();
async function main() {
  await prisma.subscription.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.code.deleteMany();

  // await prisma.$queryRaw`ALTER TABLE subscription DROP COLUMN id`;
  // await prisma.$queryRaw`ALTER TABLE subscription ADD COLUMN id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY`;

  // await prisma.$queryRaw`ALTER TABLE feature DROP COLUMN id`;
  // await prisma.$queryRaw`ALTER TABLE feature ADD COLUMN id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY`;

  // await prisma.$queryRaw`ALTER TABLE plan DROP COLUMN id`;
  // await prisma.$queryRaw`ALTER TABLE plan ADD COLUMN id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY`;

  await prisma.$queryRaw`ALTER TABLE code DROP COLUMN id`;
  await prisma.$queryRaw`ALTER TABLE code ADD COLUMN id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY`;

  await prisma.$queryRaw`ALTER TABLE error_message DROP COLUMN id`;
  await prisma.$queryRaw`ALTER TABLE error_message ADD COLUMN id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY`;

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

  await prisma.plan.create({
    data: {
      name: '무료 플랜',
      price: 0,
      description: '무료 플랜',
      planType: $Enums.PlanType.Free,
      feature: {
        createMany: {
          data: [
            { feature: '월 설문, 투표 작성 3개' },
            { feature: '기본 통계 그래프' },
            { feature: '설문, 투표 공유 URL 생성' },
            { feature: '설문, 투표별 응답자 100명' },
          ],
        },
      },
    },
    include: { feature: true },
  });
  await prisma.plan.create({
    data: {
      name: '프로 플랜',
      price: 3_900,
      description: '프로 플랜',
      planType: $Enums.PlanType.Basic,
      feature: {
        createMany: {
          data: [
            { feature: '월 설문, 투표 작성 7개' },
            { feature: '기본 통계 그래프' },
            { feature: '설문, 투표 공유 URL 생성' },
            { feature: '설문, 투표별 응답자 200명' },
          ],
        },
      },
    },
    include: { feature: true },
  });
  await prisma.plan.create({
    data: {
      name: '업그레이드 플랜',
      price: 7_900,
      description: '업그레이드 플랜',
      planType: $Enums.PlanType.Pro,
      feature: {
        createMany: {
          data: [
            { feature: '설문, 투표 대시보드' },
            { feature: '월 설문, 투표 작성 12개' },
            { feature: '기본 통계 그래프' },
            { feature: '설문, 투표 공유 URL 생성' },
            { feature: '설문, 투표별 응답자 500명' },
            { feature: '통계 데이터 질문별 비교 기능' },
          ],
        },
      },
    },
    include: { feature: true },
  });
  await prisma.plan.create({
    data: {
      name: '엔터프라이즈 플랜',
      price: 14_900,
      description: '엔터프라이즈 플랜',
      planType: $Enums.PlanType.Premium,
      feature: {
        createMany: {
          data: [
            { feature: '설문, 투표 대시보드' },
            { feature: '월 설문, 투표 작성 30개' },
            { feature: '기본 통계 그래프' },
            { feature: '설문, 투표 공유 URL 생성' },
            { feature: '설문, 투표별 응답자 5,000명' },
            { feature: '통계 데이터 질문별 비교 기능' },
            { feature: '통계 데이터 내보내기 지원(Excel, CSV)' },
          ],
        },
      },
    },
    include: { feature: true },
  });
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

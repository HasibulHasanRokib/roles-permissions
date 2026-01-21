import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const permissions = [
    "user.view",
    "user.create",
    "user.update",
    "user.delete",

    "admin.view",
    "admin.create",
    "admin.update",
    "admin.delete",

    "task.assign",
    "task.update",
    "task.delete",
  ];

  await Promise.all(
    permissions.map((key) =>
      prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key },
      }),
    ),
  );

  console.log("✅ Permissions seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

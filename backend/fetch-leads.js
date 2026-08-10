const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Fetching leads from database...");
    const leads = await prisma.lead.findMany({
      where: {
        email: {
          not: "",
        },
      },
      orderBy: {
        capturedAt: "desc",
      },
    });

    console.log(`\nTotal Leads Found: ${leads.length}\n`);
    console.log(JSON.stringify(leads, null, 2));
  } catch (error) {
    console.error("Error fetching leads:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

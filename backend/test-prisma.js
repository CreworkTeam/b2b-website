require('dotenv').config();
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

async function testPrisma() {
  console.log("------------------------------------------------");
  console.log("Testing Prisma Connection & Queries...");
  console.log("Using DATABASE_URL host:", (process.env.DATABASE_URL || '').split('@')[1] || 'undefined');
  console.log("------------------------------------------------\n");

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    // 1. Test basic count query
    console.log("1. Querying count of leads table via Prisma...");
    const count = await prisma.lead.count();
    console.log(`✅ Success! Total leads count in database: ${count}\n`);

    // 2. Test fetching all leads
    console.log("2. Fetching all lead records...");
    const leads = await prisma.lead.findMany({
      orderBy: { capturedAt: 'desc' },
    });
    console.log(`✅ Success! Retrieved ${leads.length} lead(s):`);
    console.log(JSON.stringify(leads, null, 2));

    console.log("\n------------------------------------------------");
    console.log("🎉 PRISMA DATABASE CONNECTION IS WORKING PERFECTLY!");
    console.log("------------------------------------------------");
  } catch (error) {
    console.error("❌ Prisma Test Failed Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();

// Script to seed auth data into NeonDB using Prisma
require("dotenv").config({ path: "../.env" });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Example user data
  const user = await prisma.user.create({
    data: {
      status: "active",
      authIdentities: {
        create: [
          { provider: "mobile", identifier: "9000000001" },
          { provider: "aadhar_vault", identifier: "123412341234" },
          { provider: "consumerid", identifier: "12345678" },
        ],
      },
      profile: {
        create: {
          name: "Guru Nadharao",
          dob: new Date("1990-01-01"),
          gender: "male",
        },
      },
      contacts: {
        create: [
          {
            phone: "9000000001",
            email: "gurunadharao5718@gmail.com",
            address_line: "123 Main St",
            city: "Hyderabad",
            state: "Telangana",
            pincode: "500001",
          },
        ],
      },
    },
  });
  console.log("Seeded user:", user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

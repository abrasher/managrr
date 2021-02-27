/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const main = async () => {
  await prisma.settings.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      id: 1,
      language: "english",
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { prisma } from '../prisma'

const main = async () => {
  const random = ['123freg', 'grewgnjrewgkre', 'grenjg', 'gre', 'grenjgr']
  const randomPromise = random.map(async (rand) => {
    await prisma.radarrGenre.create({
      data: {
        name: rand,
      },
    })
  })

  await Promise.all(randomPromise)

  console.log('Done')
}

main().catch((err) => console.error(err))

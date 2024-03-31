import { PrismaClient } from "@prisma/client";
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient()

async function main() {
  let runSeed = false
  if(process.env.NODE_ENV === 'development') {
    await prisma.interest.deleteMany()
    runSeed = true
  }else{
    const interest =  await prisma.interest.findFirst()
    if(!interest){
      runSeed = true
    }
  }
  if(runSeed){
    const interestsArr = new Set()
    while(interestsArr.size < 100){
      console.log("adding interest::", interestsArr.size)
      const product = faker.commerce.product()
      if(interestsArr.has(product)){
        interestsArr.add(faker.commerce.productAdjective() + " " + product)
        continue
      }
      interestsArr.add(product)
    }

    for(const interest of interestsArr){
      const pastCreated = faker.date.past()
      await prisma.interest.create({
        data: {
          name: interest as string,
          createdAt: pastCreated,
          updatedAt: pastCreated,
        }
      })
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
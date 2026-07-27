import { createApp } from './app.js'
import { env } from './config/env.js'
import { prisma } from './config/prisma.js'

const app = createApp()

async function bootstrap() {
  try {
    await prisma.$connect()

    app.listen(env.PORT, () => {
      console.log(`IJABE backend running on http://localhost:${env.PORT}`)
    })
  } catch (error) {
    console.error('Failed to start backend', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

void bootstrap()

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'alberto@example.com' },
    update: { password, role: 'admin' },
    create: {
      email: 'alberto@example.com',
      password,
      name: 'Alberto Antiza',
      role: 'admin'
    }
  })

  await prisma.note.deleteMany({ where: { userId: user.id } })
  await prisma.interview.deleteMany({ where: { userId: user.id } })
  await prisma.application.deleteMany({ where: { userId: user.id } })
  await prisma.contact.deleteMany({ where: { userId: user.id } })
  await prisma.company.deleteMany({ where: { userId: user.id } })

  const google = await prisma.company.create({
    data: {
      userId: user.id,
      name: 'Google',
      website: 'https://careers.google.com',
      location: 'Mountain View, CA',
      status: 'active'
    }
  })

  const stripe = await prisma.company.create({
    data: {
      userId: user.id,
      name: 'Stripe',
      website: 'https://stripe.com/jobs',
      location: 'Remote',
      status: 'active'
    }
  })

  const airbnb = await prisma.company.create({
    data: {
      userId: user.id,
      name: 'Airbnb',
      website: 'https://airbnb.com/careers',
      location: 'San Francisco, CA',
      status: 'active'
    }
  })

  const googleApp = await prisma.application.create({
    data: {
      userId: user.id,
      companyId: google.id,
      role: 'Senior Software Engineer',
      status: 'interview'
    }
  })

  const stripeApp = await prisma.application.create({
    data: {
      userId: user.id,
      companyId: stripe.id,
      role: 'Backend Engineer',
      status: 'applied'
    }
  })

  const airbnbApp = await prisma.application.create({
    data: {
      userId: user.id,
      companyId: airbnb.id,
      role: 'Full Stack Developer',
      status: 'offer'
    }
  })

  await prisma.contact.create({
    data: {
      userId: user.id,
      companyId: google.id,
      name: 'Sarah Chen',
      email: 'sarah.chen@google.com',
      status: 'active'
    }
  })

  await prisma.contact.create({
    data: {
      userId: user.id,
      companyId: stripe.id,
      name: 'Mike Johnson',
      email: 'mike@stripe.com',
      status: 'active'
    }
  })

  await prisma.contact.create({
    data: {
      userId: user.id,
      companyId: airbnb.id,
      name: 'Emily Davis',
      email: 'emily@airbnb.com',
      status: 'active'
    }
  })

  await prisma.interview.create({
    data: {
      userId: user.id,
      applicationId: googleApp.id,
      date: new Date('2026-07-10T10:00:00Z'),
      stage: 'Technical Screen',
      notes: 'System design and coding'
    }
  })

  await prisma.interview.create({
    data: {
      userId: user.id,
      applicationId: googleApp.id,
      date: new Date('2026-07-17T14:00:00Z'),
      stage: 'On-site',
      notes: '4 rounds including behavioral'
    }
  })

  await prisma.note.create({
    data: {
      userId: user.id,
      applicationId: googleApp.id,
      content: 'Prepare for system design — focus on distributed systems and scalability.'
    }
  })

  await prisma.note.create({
    data: {
      userId: user.id,
      applicationId: stripeApp.id,
      content: "Review Stripe's API docs and idempotency patterns."
    }
  })

  await prisma.note.create({
    data: {
      userId: user.id,
      applicationId: airbnbApp.id,
      content: 'Negotiate offer — target 200k+ TC.'
    }
  })

  console.log('Seed complete!')
  console.log(`  User: alberto@example.com / password123`)
  console.log(`  Companies: ${[google.name, stripe.name, airbnb.name].join(', ')}`)
  console.log(`  Applications: ${googleApp.role}, ${stripeApp.role}, ${airbnbApp.role}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

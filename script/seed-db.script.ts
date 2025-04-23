import prisma from './../src/lib/prisma.client'
import axios from 'axios'

const seedDbWithUsers = async () => {
  try {
    const res = await axios.get<{ data: Array<{ firstname: string; lastname: string; email: string }> }>(
      'https://fakerapi.it/api/v2/persons/?_quantity=1002'
    )
    const data = res.data.data
    const payload = data.map((person) => ({ name: person.firstname + ' ' + person.lastname, email: person.email }))

    if (payload && payload.length > 0) {
      await prisma.user.createMany({
        data: payload
      })
    } else {
      throw new Error('Payload is invalid')
    }
  } catch (error) {
    console.log(error)
  }
}

seedDbWithUsers()

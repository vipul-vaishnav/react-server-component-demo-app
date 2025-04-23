import prisma from '@/lib/prisma.client'

export default async function Home() {
  const users = await prisma.user.findMany({
    take: 7,
    skip: 7
  })
  return (
    <main className="min-h-screen max-w-screen w-full bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-[200px_1fr_1fr_400px] bg-neutral-800 mb-6 p-4 font-bold rounded-2xl">
          <p>S.No.</p>
          <p>Name</p>
          <p>Email</p>
          <p> &nbsp; </p>
        </div>
        <div className="space-y-3">
          {users.map((user) => {
            return (
              <div
                className="grid grid-cols-[200px_1fr_1fr_400px] p-4 font-bold rounded-2xl hover:bg-neutral-600 transition-all duration-300"
                key={user.id}
              >
                <p>{user.serialNumber}</p>
                <p>{user.name}</p>
                <p>{user.email}</p>
                <button>✏️ Edit</button>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

import prisma from '@/lib/prisma.client'
import UserSearch from '@/UserSearch'
import { SearchParams } from 'next/dist/server/request/search-params'
import Link from 'next/link'

function PrevPage({ page }: { page: number }) {
  return (
    <>
      {page === 1 ? (
        <button
          disabled
          className="pointer-events-none bg-neutral-600 text-neutral-950 px-6 py-2 rounded cursor-not-allowed"
        >
          Prev
        </button>
      ) : (
        <Link
          href={page === 2 ? '/' : `/?page=${page - 1}`}
          className="px-6 py-2 rounded bg-transparent border border-neutral-800"
        >
          Prev
        </Link>
      )}
    </>
  )
}

function NextPage({ lastPage, page }: { lastPage: number; page: number }) {
  return (
    <>
      {page === lastPage ? (
        <button
          disabled
          className="pointer-events-none bg-neutral-600 text-neutral-950 px-6 py-2 rounded cursor-not-allowed"
        >
          Next
        </button>
      ) : (
        <Link href={`/?page=${page + 1}`} className="px-6 py-2 rounded bg-transparent border border-neutral-800">
          Next
        </Link>
      )}
    </>
  )
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const perPage = 7 // totalPages = 1000 / 7 = 142.88  ~= 143 pages
  const totalUsers = await prisma.user.count()
  const lastPage = Math.ceil(totalUsers / perPage)

  const page =
    typeof searchParams.page === 'string'
      ? +searchParams.page > lastPage
        ? lastPage
        : +searchParams.page < 2
        ? 1
        : +searchParams.page
      : 1

  const users = await prisma.user.findMany({
    take: perPage,
    skip: (page - 1) * perPage
  })

  return (
    <main className="min-h-screen max-w-screen w-full bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto py-6">
        <UserSearch />
        <div className="grid grid-cols-[200px_1fr_1fr_400px] bg-neutral-800 mb-4 p-4 font-bold rounded-2xl">
          <p>S.No.</p>
          <p>Name</p>
          <p>Email</p>
          <p> &nbsp; </p>
        </div>
        <div className="space-y-2">
          {users.map((user) => {
            return (
              <div
                className="grid grid-cols-[200px_1fr_1fr_400px] p-3 px-4 font-bold rounded-2xl border border-transparent hover:border-neutral-700 transition-all duration-300"
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
        <div className="flex items-center justify-between">
          <p>
            Showing <span className="font-bold">{(page - 1) * perPage + 1}</span> to{' '}
            <span className="font-bold">{Math.min(page * perPage, totalUsers)}</span> users of{' '}
            <span className="font-bold">{totalUsers}</span>
          </p>
          <div className="space-x-2 mt-8">
            <PrevPage page={page} />
            <NextPage lastPage={lastPage} page={page} />
          </div>
        </div>
      </div>
    </main>
  )
}

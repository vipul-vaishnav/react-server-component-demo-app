import prisma from '@/lib/prisma.client'
import UserSearch from '@/UserSearch'
import Link from 'next/link'
import { Suspense } from 'react'

type SearchParamsType = { [key: string]: string | string[] | undefined }

function PrevPage({ page, currentSearchParams }: { page: number; currentSearchParams: URLSearchParams }) {
  const newSearchParams = new URLSearchParams(currentSearchParams)

  if (page > 2) {
    newSearchParams.set('page', `${page - 1}`)
  } else {
    newSearchParams.delete('page')
  }

  return (
    <>
      {page <= 1 ? (
        <button
          disabled
          className="pointer-events-none bg-neutral-600 text-neutral-950 px-6 py-2 rounded cursor-not-allowed"
        >
          Prev
        </button>
      ) : (
        <Link
          href={`/?${newSearchParams.toString()}`}
          className="px-6 py-2 rounded bg-transparent border border-neutral-800"
        >
          Prev
        </Link>
      )}
    </>
  )
}

function NextPage({
  lastPage,
  page,
  currentSearchParams
}: {
  lastPage: number
  page: number
  currentSearchParams: URLSearchParams
}) {
  const newSearchParams = new URLSearchParams(currentSearchParams)

  newSearchParams.set('page', `${page + 1}`)

  return (
    <>
      {page >= lastPage ? (
        <button
          disabled
          className="pointer-events-none bg-neutral-600 text-neutral-950 px-6 py-2 rounded cursor-not-allowed"
        >
          Next
        </button>
      ) : (
        <Link
          href={`/?${newSearchParams.toString()}`}
          className="px-6 py-2 rounded bg-transparent border border-neutral-800"
        >
          Next
        </Link>
      )}
    </>
  )
}

async function UserTable({ searchParams }: { searchParams: SearchParamsType }) {
  const perPage = 7 // totalPages = 1000 / 7 = 142.88  ~= 143 pages
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : undefined

  const totalUsers = await prisma.user.count({
    where: {
      name: {
        contains: searchQuery,
        mode: 'insensitive'
      }
    }
  })

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
    skip: (page - 1) * perPage,
    where: {
      name: {
        contains: searchQuery,
        mode: 'insensitive'
      }
    }
  })

  const currentSearchParams = new URLSearchParams()
  if (searchQuery) {
    currentSearchParams.set('search', searchQuery)
  }
  if (page > 1) {
    currentSearchParams.set('page', `${page}`)
  }

  return (
    <>
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
      <div className="flex items-center justify-between mt-8">
        <p>
          Showing <span className="font-bold">{(page - 1) * perPage + 1}</span> to{' '}
          <span className="font-bold">{Math.min(page * perPage, totalUsers)}</span> users of{' '}
          <span className="font-bold">{totalUsers}</span>
        </p>
        <div className="space-x-2">
          <PrevPage page={page} currentSearchParams={currentSearchParams} />
          <NextPage lastPage={lastPage} page={page} currentSearchParams={currentSearchParams} />
        </div>
      </div>
    </>
  )
}

export default async function Home({ searchParams }: { searchParams: SearchParamsType }) {
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : undefined

  return (
    <main className="min-h-screen h-full max-w-screen w-full bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto py-6">
        <UserSearch searchVal={searchQuery ?? ''} />
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="w-12 h-12 border-4 border-neutral-600 border-t-neutral-800 rounded-full animate-spin"></div>
            </div>
          }
        >
          <UserTable searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  )
}

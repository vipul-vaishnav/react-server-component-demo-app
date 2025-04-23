'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, useTransition } from 'react'

type UserSearchProps = {
  searchVal: string
}

const UserSearch: React.FC<UserSearchProps> = ({ searchVal }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchVal)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      startTransition(() => {
        if (search.trim().length > 0) {
          router.push(`/?search=${encodeURIComponent(search)}`)
        } else {
          router.push('/')
        }
      })
    }, 500) // ⏱️ 500ms debounce delay

    return () => clearTimeout(delayDebounce) // 🧹 cleanup old timers
  }, [search, router])

  return (
    <div className="flex items-center justify-between mb-12">
      <div className="text-2xl w-full font-bold">🔥 React Server Component</div>
      <div className="relative w-full text-right">
        <div className="absolute top-[12px] left-[calc(30%+10px)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {isPending && (
          <div className="absolute top-[12px] right-[12px]">
            <div className="flex items-center justify-center h-auto">
              <div className="w-5 h-5 border-3 border-neutral-600 border-t-neutral-800 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        <input
          type="text"
          className="max-w-md w-full bg-transparent border pl-8 border-neutral-800 p-2 rounded-xl focus:outline-none focus:border-neutral-700"
          placeholder="Search Name..."
          autoComplete="off"
          name="Search"
          value={search}
          id="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  )
}

export default UserSearch

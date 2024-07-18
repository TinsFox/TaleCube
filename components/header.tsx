import * as React from 'react'
import Link from 'next/link'

import { IconGitHub } from '@/components/ui/icons'

async function UserOrLogin() {
  return (
    <Link href={'/'}>
      <div>
        <img src="/bot.png" alt="" className="mr-2 size-6" />
      </div>
    </Link>
  )
}

export function Header() {
  return (
    <header className="evenly sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-primary/20 px-4">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <a
          target="_blank"
          href="https://github.com/TinsFox/TaleCube"
          rel="noopener noreferrer"
        >
          <IconGitHub />
        </a>
      </div>
    </header>
  )
}

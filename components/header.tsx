'use client'
import * as React from 'react'
import Link from 'next/link'

import { IconGitHub } from '@/components/ui/icons'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="evenly sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-primary/20 px-4">
      <div className="group/item flex items-center">
        <Link href={'/'}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bot.png"
              alt="故事魔方"
              className="mr-2 size-6"
              // height={'auto'}
              width={'auto'}
            />
          </div>
        </Link>
        <Button
          className="invisible group-hover/item:visible"
          onClick={() => {
            window.localStorage.clear()
            window.location.href = '/'
          }}
        >
          重启旅程
        </Button>
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

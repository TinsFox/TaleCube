'use client'
import { BotMessageCard } from '@/components/BotMessageCard'
import { ConfirmButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useChatStore } from '@/store/chat'
import { useRouter } from 'next/navigation'
import { IconCheck } from '@/components/ui/icons'
import { StoryCard } from '@/components/StoryCard'

export default function RolePage() {
  const { part1, startOption1 } = useChatStore()

  const router = useRouter()

  return (
    <div className="slate/900 body group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pt-4 md:pt-10')}>
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="group relative flex w-fit items-start md:-ml-12">
            <BotMessageCard
              message="好嘞，让我们进入你的故事吧！"
              extra={part1?.content}
              story
            />
          </div>
          <div className="flex">
            <StoryCard content={part1?.content || ''} />
          </div>
          <div className="flex justify-around">
            <ConfirmButton
              className=""
              onClick={() => {
                startOption1()
                router.push('/option1', { scroll: false })
              }}
            >
              <IconCheck className="mr-3 size-7" />
              继续冒险
            </ConfirmButton>
          </div>
        </div>
      </div>
    </div>
  )
}

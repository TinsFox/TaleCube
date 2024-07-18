'use client'
import { BotMessageCard } from '@/components/BotMessageCard'
import { ConfirmButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useChatStore } from '@/store/chat'
import { useRouter } from 'next/navigation'
import { IconCheck } from '@/components/ui/icons'
import { StoryCard } from '@/components/StoryCard'

export default function Part2Page() {
  const { part2, startOption2 } = useChatStore()

  const router = useRouter()

  return (
    <div className="slate/900 body group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pt-4 md:pt-10')}>
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="group relative flex w-fit items-start md:-ml-12">
            <BotMessageCard message="真是有趣的选择，让我们看看接下来发生了什么呢？" extra={part2} story />
          </div>
          <div className="flex">
            <StoryCard content={part2} />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <ConfirmButton
            className=""
            onClick={() => {
              startOption2()
              router.push('/option2', { scroll: false })
            }}
          >
            <IconCheck className="mr-3 size-7" />
            没问题
          </ConfirmButton>
        </div>
      </div>
    </div>
  )
}

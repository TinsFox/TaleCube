'use client'
import { BotMessageCard } from '@/components/BotMessageCard'

import { cn } from '@/lib/utils'

import { useChatStore } from '@/store/chat'
import { StoryCard } from '@/components/StoryCard'
import { useState } from 'react'
enum contentEnum {
  a = '很棒！快来看看，我们的故事已经基本圆满了！',
  b = '让我们一起来看看完整的故事吧!'
}
export default function Part3Page() {
  const { part3, setDone, done } = useChatStore()
  const [content, setContent] = useState(contentEnum.a)

  return (
    <div className="slate/900 body group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pt-4 md:pt-10')}>
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="group relative flex w-fit items-start md:-ml-12">
            {done ? (
              <BotMessageCard
                key={'done'}
                story={false}
                message={'让我们一起来看看完整的故事吧!'}
                onFinish={() => {
                  if (content === contentEnum.a) {
                    setDone(true)
                    setContent(contentEnum.b)
                  } else {
                    setDone(true)
                  }
                }}
              />
            ) : (
              <BotMessageCard
                message={'很棒！快来看看，我们的故事已经基本圆满了！'}
                extra={part3}
                onFinish={() => {
                  setDone(true)
                }}
                story
              />
            )}
          </div>
          <div className="flex">
            <StoryCard content={part3} />
          </div>
        </div>
      </div>
    </div>
  )
}

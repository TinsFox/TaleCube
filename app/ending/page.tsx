'use client'
import { BotMessageCard } from '@/components/BotMessageCard'
import { StoryCard } from '@/components/StoryCard'

import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'
import * as React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

export default function EndingPage() {
  const { part1, part2, part3 } = useChatStore()

  return (
    <div className="slate/900 body group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pt-4 md:pt-10')}>
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="group relative flex w-fit items-start md:-ml-12">
            <BotMessageCard
              message={'这就是你创作的故事！和你一起创作真是太有趣了！'}
              story={false}
            />
          </div>
          <Carousel
            className="mt-5 w-full"
            opts={{
              align: 'start'
            }}
          >
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-2">
                      <StoryCard content={part1?.content as string} />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-2">
                      <StoryCard content={part2} />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center p-2">
                      <StoryCard content={part3} />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

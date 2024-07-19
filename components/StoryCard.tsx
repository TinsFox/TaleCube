import { useEffect, useState } from 'react'

import { storyToImg } from '@/service/chat'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function StoryCard({ content }: { content: string }) {
  const [img, setImg] = useState('')
  useEffect(() => {
    if (content === '') return
    storyToImg(content).then(res => {
      setImg(res.data.images[0].url)
    })
  }, [content])
  return (
    <div className="px-4 py-6 sm:p-6 md:px-8 md:py-10">
      <div className="mx-auto grid grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Avatar className="h-52 w-[240px] rounded-none">
          <AvatarImage src={img} alt={content} className="object-cover" />
          <AvatarFallback className="rounded-none">
            内容极速生成中...
          </AvatarFallback>
        </Avatar>
        {/* <img src={img} alt={content} width={240} height={280} /> */}
        <p className="text-sm leading-6">{content}</p>
      </div>
    </div>
  )
}

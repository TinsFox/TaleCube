import { useEffect, useState } from 'react'
import { useAudio } from 'react-use'

import { storyToImg } from '@/service/chat'

export function StoryCard({ content }: { content: string }) {
  const [audioUrl, setAudioUrl] = useState('')
  const [audio, state, controls, ref] = useAudio({
    src: audioUrl,
    autoPlay: false
  })
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
        <img src={img} alt={content} width={240} height={280} />
        <p className="text-sm leading-6">
          {content}
          {audio}
        </p>
      </div>
    </div>
  )
}

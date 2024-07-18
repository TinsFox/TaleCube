'use client'
import { BotMessageCard } from '@/components/BotMessageCard'
import { Button, ConfirmButton, IdeaButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { storyTTS } from '@/service/chat'
import { useChatStore } from '@/store/chat'
import { useEffect, useRef, useState } from 'react'
import { useAudio } from 'react-use'
import { useRouter } from 'next/navigation'
import { IconCheck, IconIdea } from '@/components/ui/icons'

export default function RolePage() {
  const { options2, startPart3, protagonist } = useChatStore()
  const router = useRouter()
  return (
    <div className="slate/900 body group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pt-4 md:pt-10')}>
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="group relative flex w-fit items-start md:-ml-12">
            <BotMessageCard
              message={`好极了！越来越期待 ${protagonist.name}之后发生的故事啦！快告诉我，之后都发生什么事情了？`}
            />
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {options2.map(role => (
              <ActionCard key={role} title={role} />
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-evenly">
          <IdeaButton>
            <IconIdea className="mr-3 size-7" />
            我有想法
          </IdeaButton>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ title }: { title: string }) {
  const { setUserOptions2, userOptions2, startPart3 } = useChatStore()
  const [audioUrl, setAudioUrl] = useState('')
  const [audio, state, controls, ref] = useAudio({
    src: audioUrl,
    autoPlay: false
  })

  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        controls.pause()
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [controls])
  const router = useRouter()

  return (
    <div className="group/item flex flex-col items-center justify-center space-y-2">
      <div
        ref={cardRef}
        className={cn(
          'relative flex flex-col items-center justify-center overflow-hidden rounded-md'
        )}
        onClick={async () => {
          setUserOptions2(title)
          if (!audioUrl) {
            const res = await storyTTS(title)
            setAudioUrl(res.data as unknown as string)
          }
          controls.unmute()
          setTimeout(() => {
            controls.play()
          }, 10)
        }}
      >
        <Button
          className={cn(
            'inline-flex h-[240px] w-full items-center bg-primary px-4 text-center text-white',
            {
              'bg-[#68DE7C] hover:bg-[#68DE7C]': userOptions2 === title
            }
          )}
        >
          {title}
        </Button>
        <ConfirmButton
          className={cn('invisible mt-3 group-hover/item:visible', {
            'group-hover/item:visible': userOptions2 === title
          })}
          onClick={() => {
            setUserOptions2(title)
            startPart3()
            router.push('/part3', { scroll: false })
          }}
        >
          <IconCheck className="mr-2 size-7"></IconCheck>
          就它啦
        </ConfirmButton>
        {audio}
      </div>
    </div>
  )
}

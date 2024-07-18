'use client'
import { BotMessageCard } from '@/components/BotMessageCard'
import { Button, ConfirmButton, IdeaButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { storyToImg, storyTTS } from '@/service/chat'
import { getRoles, RoleData } from '@/service/role'
import { useChatStore } from '@/store/chat'
import Image from 'next/image'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useAudio } from 'react-use'
import { useRouter } from 'next/navigation'
import { IconCheck, IconIdea, IconRefresh } from '@/components/ui/icons'

export default function RolePage() {
  const [roles, setRoles] = useState<RoleData[]>([])

  const fetchRoles = async () => {
    const fetchedRoles = await getRoles()
    setRoles(fetchedRoles.data)
  }

  useEffect(() => {
    fetchRoles()
  }, [])
  return (
    <div className="slate/900 body group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pt-4 md:pt-10')}>
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="group relative flex w-fit items-start md:-ml-12">
            <BotMessageCard message="嗨，欢迎来到故事魔方，在这里你可以成为任何人，你希望自己是？" />
          </div>
          {roles.length === 0 ? (
            <div className="mt-16 flex justify-center">
              <div className="loader" />
            </div>
          ) : (
            <>
              <div className="mt-20 flex space-x-3">
                {roles.map(role => (
                  <Suspense key={role.title}>
                    <RoleCard title={role.title} img={role.img} />
                  </Suspense>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-center">
                <Button
                  onClick={fetchRoles}
                  className="bg-transparent hover:bg-transparent"
                  variant={'link'}
                >
                  <IconRefresh className="size-7" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function RoleCard({ title, img }: { title: string; img: string }) {
  const { protagonist, setProtagonistItem } = useChatStore()
  const [audioUrl, setAudioUrl] = useState('')
  const [audio, state, controls, ref] = useAudio({
    src: audioUrl,
    autoPlay: false
  })

  const cardRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        controls.pause()
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [controls])

  return (
    <div className="group/item flex flex-col items-center justify-center space-y-2">
      <div
        ref={cardRef}
        className={cn('relative overflow-hidden rounded-md')}
        onClick={async () => {
          setProtagonistItem('role', title)
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={title}
          width={240}
          height={280}
          className="h-72 w-60 object-cover"
        />

        <p
          className={cn(
            'absolute bottom-0 left-1/2 inline-block w-full -translate-x-1/2 text-nowrap bg-primary text-center',
            {
              'bg-[#68DE7C]': protagonist.role === title
            }
          )}
        >
          {title}
        </p>
        {audio}
      </div>
      <ConfirmButton
        className={cn('invisible group-hover/item:visible', {
          'group-hover/item:visible': protagonist.role === title
        })}
        onClick={() => {
          setProtagonistItem('role', title)
          router.push('/name', { scroll: false })
        }}
      >
        <IconCheck className="mr-2 size-7"></IconCheck>
        就它啦
      </ConfirmButton>
    </div>
  )
}

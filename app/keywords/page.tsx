'use client'
import { BotMessageCard } from '@/components/BotMessageCard'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { storyToImg, storyTTS } from '@/service/chat'
import { getKeywords, RoleData } from '@/service/role'
import { useChatStore } from '@/store/chat'
import Image from 'next/image'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useAudio } from 'react-use'
import { useRouter } from 'next/navigation'

export default function RolePage() {
  const [roles, setRoles] = useState<RoleData[]>([])
  const { protagonist, setDefaultMessage, startPart1 } = useChatStore()

  const fetchRoles = async () => {
    const fetchedRoles = await getKeywords()
    setRoles(fetchedRoles.data)
  }

  useEffect(() => {
    fetchRoles()
  }, [])
  const router = useRouter()

  return (
    <div className="slate/900 body group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pt-4 md:pt-10')}>
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="group relative flex w-fit items-start md:-ml-12">
            <BotMessageCard
              message={`哇哦，${protagonist.name}，好特殊的名字！那么 ${protagonist.name}，请问你的世界里还有些什么其他东西呢？`}
              story={false}
            />
          </div>
          <div className="mt-20 grid grid-cols-5 gap-4">
            {roles.map(role => (
              <Suspense key={role.title}>
                <RoleCard title={role.title} img={role.img} />
              </Suspense>
            ))}
          </div>
          <div className="mt-12 flex justify-around">
            <Button onClick={fetchRoles}>换一批</Button>
            <Button
              className=""
              onClick={() => {
                setDefaultMessage()
                startPart1()
                router.push('/part1', { scroll: false })
              }}
            >
              选好了
            </Button>
          </div>
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
          if (protagonist.keywords.includes(title)) {
            setProtagonistItem(
              'keywords',
              protagonist.keywords.filter(keyword => keyword !== title)
            )
          } else {
            setProtagonistItem('keywords', [...protagonist.keywords, title])
          }

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
        <Image src={img} alt={title} width={240} height={200} />
        {/* {img && <Image src={img} alt={title} width={240} height={200} />} */}
        <p
          className={cn(
            'absolute bottom-0 left-1/2 inline-block w-full -translate-x-1/2 text-nowrap bg-primary text-center',
            {
              'bg-[#68DE7C]': protagonist.keywords.includes(title)
            }
          )}
        >
          {title}
        </p>
        {audio}
      </div>
    </div>
  )
}

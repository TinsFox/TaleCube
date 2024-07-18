import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

import { useAudio } from 'react-use'
import { storyTTS } from '@/service/chat'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface BotMessageCardProps {
  message: string
  extra?: string
  onFinish?: () => void
  story: boolean
}

// eslint-disable-next-line react/display-name
export const BotMessageCard = memo(
  ({ message, extra, onFinish, story = false }: BotMessageCardProps) => {
    const [audioUrl, setAudioUrl] = useState('')
    const [shouldPlay, setShouldPlay] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)
    const [audio, state, controls, ref] = useAudio({
      src: audioUrl,
      autoPlay: false,
      onEnded: () => {
        onFinish && onFinish()
      }
    })
    const fetchAudio = useCallback(async () => {
      if (audioUrl) return
      if (!story) {
        const context = extra ? `${message}${extra}` : message
        const res = await storyTTS(message)
        setAudioUrl(res.data as unknown as string)
        setShouldPlay(true)
      } else {
        if (!extra) return
        const context = `${message}${extra}`
        const res = await storyTTS(context)
        setAudioUrl(res.data as unknown as string)
        setShouldPlay(true)
      }
    }, [audioUrl, extra, message, story])

    useEffect(() => {
      fetchAudio()
    }, [fetchAudio])
    useEffect(() => {
      function handleOutsideClick(event: MouseEvent) {
        if (
          cardRef.current &&
          !cardRef.current.contains(event.target as Node)
        ) {
          controls.pause()
        }
      }

      document.addEventListener('click', handleOutsideClick)
      return () => document.removeEventListener('click', handleOutsideClick)
    }, [controls])

    useEffect(() => {
      // 只有当 shouldPlay 为 true 时才播放音频
      if (shouldPlay) {
        setTimeout(() => {
          controls.unmute()
          controls.play()
        }, 100)
        setShouldPlay(false) // 重置 shouldPlay 状态避免重复播放
      }
    }, [shouldPlay, controls])

    return (
      <div className="relative flex w-full max-w-xl" ref={cardRef}>
        <Avatar>
          <AvatarImage src="/bot.png" alt="故事魔方" />
          <AvatarFallback>TC</AvatarFallback>
        </Avatar>
        {audio}
        <div>
          <div className="absolute size-full">
            {/* SVG remains unchanged */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 667 116"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_103_1557)">
                <path
                  d="M7.82843 10.8284C5.30857 8.30857 7.09324 4 10.6569 4H627C643.569 4 657 17.4315 657 34V74C657 90.5685 643.569 104 627 104H61C44.4315 104 31 90.5685 31 74V37.3137C31 35.192 30.1571 33.1571 28.6569 31.6568L7.82843 10.8284Z"
                  fill="#FFA500"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_103_1557"
                  x="0.648834"
                  y="0"
                  width="666.351"
                  height="116"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dx="2" dy="4" />
                  <feGaussianBlur stdDeviation="4" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_103_1557"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_103_1557"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </div>
          {/* Dialogue text */}
          <div className="relative flex h-full items-center justify-center p-4">
            <p className="ml-5 px-3 text-left text-lg font-bold text-white">
              {message}
            </p>
          </div>
        </div>
      </div>
    )
  }
)

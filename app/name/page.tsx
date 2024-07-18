'use client'
import { BotMessageCard } from '@/components/BotMessageCard'
import { Button, ConfirmButton, IdeaButton } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/wav'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'

import { SoundWave } from '@/components/SoundWave'
import { useAudio } from 'react-use'
import { IconCheck, IconRefresh, IconStop } from '@/components/ui/icons'
import { useRouter } from 'next/navigation'

let rec: any = null
const recOpen = function (success: any) {
  rec = Recorder({
    type: 'wav',
    sampleRate: 16000,
    bitRate: 16
  })

  rec.open(
    function () {
      success && success()
    },
    function (msg: string, isUserNotAllow: any) {
      // 用户拒绝未授权或不支持
      console.log(`${isUserNotAllow ? 'UserNotAllow，' : ''}无法录音:${msg}`)
    }
  )
}

/** 开始录音* */
function recStart() {
  // 打开了录音后才能进行start、stop调用
  rec.start()
}
export default function NamePage() {
  const { protagonist, setProtagonistItem } = useChatStore()
  const [recording, setRecording] = useState(false)
  const [name, setName] = useState('')
  const [hasError, setHasError] = useState(false)
  const [audio, state, controls, ref] = useAudio({
    src: '/Beep.mp3',
    autoPlay: false,
    onEnded: () => {
      toggleRecording()
    }
  })

  function recStop() {
    if (!rec) {
      setRecording(false)
      return
    }
    rec.stop(
      function (blob: any) {
        setRecording(false)
        rec.close()
        rec = null
        const formData = new FormData()

        formData.append('audio', blob)
        fetch('/api/v1/silicon/asr', {
          method: 'POST',
          body: formData
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then(data => {
            setName(data.result)
            if (data.result === '') {
              setHasError(true)
            }
          })
          .catch(error => {
            console.error(
              'There was a problem with the fetch operation:',
              error
            )
          })
      },
      function (msg: string) {
        console.log(`录音失败:${msg}`)
        setRecording(false)
        rec.close() // 可以通过stop方法的第3个参数来自动调用close
        rec = null
      }
    )
  }
  useEffect(() => {
    return () => {
      rec?.close()
    }
  }, [])
  const toggleRecording = () => {
    if (!recording) {
      recOpen(function () {
        recStart()
        setRecording(true)
      })
    } else {
      recStop()
    }
  }
  const router = useRouter()
  return (
    <div className="slate/900 body group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pt-4 md:pt-10')}>
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="group relative flex w-fit items-start md:-ml-12">
            <BotMessageCard
              message={`那么 ${protagonist.role} 请问你的名字是？额稍等稍等……我准备一下，请在“滴”声之后告诉我哈！`}
              onFinish={() => {
                controls.play()
              }}
              story={false}
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              {!recording && !name && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="names.png"
                  alt=""
                  className="mt-12 h-[#265] w-[673px] object-cover"
                />
              )}
              {recording && (
                <div className="mt-64">
                  <IdeaButton
                    className="w-32 hover:bg-current"
                    onClick={toggleRecording}
                  >
                    <IconStop className="size-7" />
                    <div className="w-2"></div>
                    结束录音
                  </IdeaButton>
                  <SoundWave isAnimating={recording} />
                </div>
              )}
              {!recording && name && (
                <>
                  <div className={cn('relative overflow-hidden rounded-md')}>
                    <div
                      className={cn(
                        'inline-flex h-72 w-60 items-center justify-center text-nowrap rounded-md bg-primary text-center text-primary-foreground shadow'
                      )}
                    >
                      {name}
                    </div>
                  </div>
                  <div>
                    <ConfirmButton
                      onClick={() => {
                        controls.pause()
                        toggleRecording()
                        setProtagonistItem('name', name)
                        router.push('/keywords', { scroll: false })
                      }}
                    >
                      <IconCheck className="mr-3 size-7" />
                      就它啦
                    </ConfirmButton>
                    <Button
                      onClick={() => {
                        setName('')
                        controls.play()
                      }}
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
          {/* {!recording && (
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                {name === '' && (
                  <div className={cn('relative overflow-hidden rounded-md')}>
                    <div
                      className={cn(
                        'inline-flex h-72 w-60 items-center justify-center text-nowrap rounded-md text-center text-primary-foreground'
                      )}
                    >
                      {hasError && <>没有听见你说话，再来一次吧！</>}
                    </div>
                  </div>
                )}

                {name ? (
                  <>
                    <div className={cn('relative overflow-hidden rounded-md')}>
                      <div
                        className={cn(
                          'inline-flex h-72 w-60 items-center justify-center text-nowrap rounded-md bg-primary text-center text-primary-foreground shadow'
                        )}
                      >
                        {name}
                      </div>
                    </div>
                    <div>
                      <ConfirmButton
                        onClick={() => {
                          controls.pause()
                          toggleRecording()
                          setProtagonistItem('name', name)
                          router.push('/keywords', { scroll: false })
                        }}
                      >
                        <IconCheck className="mr-3 size-7" />
                        就它啦
                      </ConfirmButton>
                      <Button
                        onClick={() => {
                          controls.play()
                        }}
                        className="bg-transparent hover:bg-transparent"
                        variant={'link'}
                      >
                        <IconRefresh className="size-7" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      controls.play()
                    }}
                    className="bg-transparent hover:bg-transparent"
                    variant={'link'}
                  >
                    <IconRefresh className="size-7" />
                  </Button>
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>
      {/* <div className={cn('mb-5 flex flex-col items-center justify-center')}>
        {recording && <div className="h-72"></div>}
        {recording && (
          <IdeaButton
            className="w-32 hover:bg-current"
            onClick={toggleRecording}
          >
            <IconStop className="size-7" />
            <div className="w-2"></div>
            结束录音
          </IdeaButton>
        )}
        <SoundWave isAnimating={recording} />
      </div> */}
      {audio}
    </div>
  )
}

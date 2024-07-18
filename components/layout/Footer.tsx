'use client'
import { IconBack, IconCheck, IconClose } from '@/components/ui/icons'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'
import { toast } from 'sonner'

export function Footer() {
  const { done, setDone } = useChatStore()

  const router = useRouter()
  const pathname = usePathname()
  if (pathname === '/') {
    return null
  }
  return (
    <div className="slate/900 body group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn('pt-4 md:pt-10')}>
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="relative flex items-start pl-12 md:-ml-12">
            <div className="relative mx-auto mt-5 flex max-w-2xl flex-1 flex-col">
              <div className="flex w-full items-center justify-between">
                <IconBack
                  className="size-8"
                  onClick={() => {
                    router.back()
                  }}
                />

                {pathname === '/ending' ? (
                  <Button
                    className={cn(
                      'ml-2 rounded-full bg-primary text-center text-lg font-semibold leading-7 text-white hover:bg-[#68DE7C] hover:bg-primary hover:text-white',
                      {
                        'bg-[#68DE7C] hover:bg-[#68DE7C]': true
                      }
                    )}
                    onClick={() => {
                      toast.success('保存成功!')
                    }}
                  >
                    <IconCheck className="mr-3 size-7" />
                    保存
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setDone(false)
                      if (pathname !== '/part3') {
                        return
                      }
                      router.push('/ending', { scroll: false })
                    }}
                    className={cn(
                      'ml-2 rounded-full bg-primary text-center text-lg font-semibold leading-7 text-white hover:bg-[#68DE7C] hover:bg-primary hover:text-white',
                      {
                        'bg-[#68DE7C] hover:bg-[#68DE7C]': done
                      }
                    )}
                  >
                    {done ? (
                      <IconCheck className="mr-3 size-7" />
                    ) : (
                      <IconClose className="mr-3 size-7" />
                    )}

                    {pathname === '/part3'
                      ? done
                        ? 'Ok'
                        : '结束故事'
                      : '返回'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

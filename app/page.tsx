import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
export const metadata = {
  title: 'Next.js AI Chatbot'
}

export default async function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-background p-8">
      <Image src="/bot.png" alt="" width={351} height={385} />
      <h1 className="mt-10 scroll-m-20 pb-2 text-3xl tracking-tight text-[#DA9C45] transition-colors first:mt-0">
        哦我亲爱的朋友你好，让我们开始今天的故事之旅吧！
      </h1>
      <Link
        href={'/role'}
        className={buttonVariants({
          variant: 'default'
        })}
      >
        开始
      </Link>
    </div>
  )
}

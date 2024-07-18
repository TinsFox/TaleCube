import { Suspense } from 'react'

interface IStoryImgProps {
  imgUrl?: string
}

export function StoryImg(props: IStoryImgProps) {
  const { imgUrl } = props
  return (
    <Suspense>
      <img src={imgUrl} alt={imgUrl} />
    </Suspense>
  )
}

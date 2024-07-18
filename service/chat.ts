import { Message } from '@/store/chat'
import axios from 'axios'
export interface ResponseData<T = unknown> {
  code: number
  data: T
  msg: string
  time: string
}
export interface Data {
  id: string
  object: string
  created: number
  model: string
  choices: Choice[]
  usage: Usage
  system_fingerprint: string
}
export interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}
export interface Choice {
  index: number
  message: Message
  finish_reason?: string
}

export async function Chat(body: Message[]): Promise<ResponseData<Data>> {
  const res = await axios.post('api/v1/silicon/chat', {
    prompts: body
  })
  return res.data
}

export async function storyToImg(
  storyText: string
): Promise<ResponseData<StoryToImgResponse>> {
  const res = await axios.post('api/v1/silicon/story2prompt', {
    story: storyText
  })
  return res.data
}

export async function storyTTS(
  storyText: string
): Promise<ResponseData<StoryToImgResponse>> {
  const res = await axios.get('api/v1/dify/set_hash', {
    params: {
      story: storyText
    }
  })
  return res.data
}
export interface StoryToImgResponse {
  images: Image[]
  timings: Timings
  seed: number
  shared_id: string
}

export interface Image {
  url: string
}

export interface Timings {
  inference: number
}

// api/v1/silicon/chat_step

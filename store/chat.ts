import { z } from 'zod'
import { create } from 'zustand'
import { Chat, storyTTS } from '@/service/chat'
import { persist } from 'zustand/middleware'

export interface Message {
  role: string
  content: string
  img?: string
}

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),
  role: z.string(),
  word: z.string(),
  keywords: z.string().array()
})
interface IPart {
  content?: string
  img?: string
  audio?: string
}
export type IProtagonist = z.infer<typeof formSchema>

interface ChatStore {
  messages: Message[]
  part1: IPart | null
  part2: string
  part3: string
  addMessage: (message: Message) => void
  startPart1: () => void
  startPart2: () => void
  startPart3: () => void
  setDefaultMessage: () => void
  protagonist: IProtagonist
  refresh: () => void
  options1: string[]
  options2: string[]
  options3: string[]
  userOptions1: string
  userOptions2: string
  startOption1: () => void
  startOption2: () => void
  setUserOptions1: (val: string) => void
  setUserOptions2: (val: string) => void
  setProtagonistItem: (
    key: keyof IProtagonist,
    value: string | string[]
  ) => void
  idea1?: string
  setIdea1?: (val: string) => void
  done: boolean
  setDone: (val: boolean) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      done: false,
      protagonist: {
        name: '',
        role: '',
        word: '',
        keywords: []
      },
      part1: null,
      part2: '',
      part3: '',
      options1: [],
      userOptions2: '',
      options2: [],
      options3: [],
      userOptions1: '',
      idea1: '',
      setIdea1: (val: string) => {
        set(state => ({
          ...state,
          idea1: val,
          messages: [
            ...state.messages,
            {
              role: 'user',
              content: `<内容>：${val}. 请一步一步完成这个任务。首先理解<内容>并以一句话概括为主人公最有可能的一个<动作>；然后把<动作>作为主人公也就是“你”下一步的行为，续写这个故事的下一个段落。段落包括三个部分，第一部分是扩写主人公的行为，第二部分是续写行为引发的事件，第三部分是事件引发的主人公下一步的行为，总字数在120字以内，不需要换行或包括“\n”，以句号结束。`
            }
          ]
        }))
      },
      setDone: val => {
        set(state => ({ ...state, done: val }))
      },
      setUserOptions1: (val: string) => {
        set(state => ({ ...state, userOptions1: val }))
      },
      setUserOptions2: (val: string) => {
        set(state => ({ ...state, userOptions2: val }))
      },
      setProtagonistItem: (
        key: keyof IProtagonist,
        value: string | string[]
      ) => {
        set(state => ({
          ...state,
          protagonist: {
            ...state.protagonist,
            [key]: value
          }
        }))
      },
      messages: [],
      setDefaultMessage: () => {
        set(state => ({
          ...state,
          messages: [
            {
              role: 'system',
              content:
                '你是一个给小朋友写故事的童话作家。你写的故事是中文的。你写的故事采用第二人称叙述的方式，其中“你”被用来直接指代故事的主人公。故事的开头往往是：在一个场景中，你，名字，角色正在做什么。这个故事中不会使用第一人称或第三人称称呼主人公。这个故事的发展是以发生在主人公身上的事件，主人公的行为，发生在主人公身上的事件，主人公的行为，以此类推不断重复的方式展开的。在每一个事件中，主人公没有主动的行为，只有主人公之外的任务和环境发生变化。主人公的行为会引发下一个事件。',
              genImg: false,
              show: false
            },
            {
              role: 'system',
              content: `现在你要写一个关于${state.protagonist.keywords.join('、')}的故事。故事发生在${state.protagonist.word}。主人公也就是”你“的名字是${state.protagonist.name}。主人公的角色是${state.protagonist.role}`,
              genImg: false,
              show: false
            },
            {
              role: 'user',
              content:
                '请基于以上信息，写一个故事的开场白，返回总字数在100字以内。开场白包括对故事发生的背景的描述，与主人公也就是“你”遇到的第一个事件。直接返回故事内容',
              genImg: false,
              show: false
            }
          ]
        }))
      },
      addMessage: message => {
        set(state => ({ messages: [...state.messages, message] }))
      },
      refresh: () => {
        set(state => ({
          ...state,
          fetching: true,
          messages: state.messages.slice(0, -1)
        }))
      },
      startPart1: async () => {
        set(state => ({ ...state, fetching: true }))
        const prompts = get().messages
        const res = await Chat(prompts)
        if (!res.data.choices.length) {
          set(state => ({ ...state, fetching: true }))
          return
        }
        const story = res.data.choices[0].message.content
        const role = res.data.choices[0].message.role
        const storyAudio = await storyTTS(story)
        // const img = await storyToImg(story)
        // console.log('img: ', img)
        set(state => ({
          ...state,
          part1: {
            content: story,
            audio: storyAudio.data as unknown as string
          },
          messages: [
            ...state.messages,
            {
              role,
              content: story
            }
          ],
          fetching: false
        }))
      },
      startPart2: async () => {
        set(state => ({
          ...state,
          fetching: true,
          messages: [
            ...state.messages,
            {
              role: 'user',
              content: `主人公也就是“你”下一步的行为是${state.userOptions1}。基于以上信息，写这个故事的下一个段落。段落包括三个部分，第一部分是扩写主人公的行为，第二部分是续写行为引发的事件，第三部分是事件引发的主人公下一步的行为，每段总字数在40字以内，直接返回每一段的内容实用“\n”换行，以句号结束。`
            }
          ]
        }))
        const prompts = get().messages
        console.log('prompts: ', prompts)
        const res = await Chat(prompts)
        if (!res.data.choices.length) {
          set(state => ({ ...state, fetching: true }))
          return
        }
        const story = res.data.choices[0].message.content
        const role = res.data.choices[0].message.role
        set(state => ({
          ...state,
          part2: story,
          messages: [
            ...state.messages,
            {
              role,
              content: story
            }
          ],
          fetching: false
        }))
      },
      startPart3: async () => {
        set(state => ({
          ...state,
          fetching: true,
          messages: [
            ...state.messages,
            {
              role: 'user',
              content: `下一个发生在主人公身上的事件是“${state.userOptions2}”。基于以上信息，写这个故事的下一个段落。段落包括两个部分，第一个部分是扩写上述发生在主人公身上的事件，第二个部分是故事的结局。总字数在100字以内，不需要换行或包括“\n”，以句号结束。`
            }
          ]
        }))
        const prompts = get().messages

        const res = await Chat(prompts)
        if (!res.data.choices.length) {
          set(state => ({ ...state, fetching: true }))
          return
        }
        const story = res.data.choices[0].message.content
        const role = res.data.choices[0].message.role
        set(state => ({
          ...state,
          part3: story,
          messages: [
            ...state.messages,
            {
              role,
              content: story
            }
          ],
          fetching: false
        }))
      },
      startOption1: async () => {
        set(state => ({
          messages: [
            ...state.messages,
            {
              role: 'user',
              content:
                '基于以上信息，想象主人公接下来三种可能的行为动作，并以分别一个动词概括这个行为。使用五个字描述这个动作，每个动作使用 、 分开，不要返回对行为的具体描述'
            }
          ]
        }))
        const prompts = get().messages
        const res = await Chat(prompts)
        const story = res.data.choices[0].message.content
        const role = res.data.choices[0].message.role
        set(state => ({
          ...state,
          options1: story.split('、'),
          messages: [
            ...state.messages,
            {
              role,
              content: story
            }
          ],
          fetching: false
        }))
      },
      startOption2: async () => {
        set(state => ({
          messages: [
            ...state.messages,
            {
              role: 'user',
              content:
                '基于以上信息，想象接下来可能发生在主人公身上的三个事件，并以分别以一句话概括这个事件。每句话的格式为主谓宾或主谓，在20字以内。只需要返回概括的一句话，不要返回对事件的具体描述,每个动作使用 ; 分开"'
            }
          ]
        }))
        const prompts = get().messages
        const res = await Chat(prompts)
        const story = res.data.choices[0].message.content
        const role = res.data.choices[0].message.role
        set(state => ({
          ...state,
          options2: story.split(';'),
          messages: [
            ...state.messages,
            {
              role,
              content: story
            }
          ],
          fetching: false
        }))
      }
    }),
    {
      name: 'chat-storage'
    }
  )
)

export interface Root {
  code: number
  msg: string
  time: string
  data: Data
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

export interface Choice {
  index: number
  message: Message
  finish_reason?: string
}

export interface Message {
  role: string
  content: string
}

export interface Usage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

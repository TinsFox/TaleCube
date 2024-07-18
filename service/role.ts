import axios from 'axios'
import { ResponseData } from './chat'
import { queryOptions } from '@tanstack/react-query'

export const pokemonOptions = queryOptions({
  queryKey: ['pokemon'],
  queryFn: async () => {
    const res = await axios.get('/api/v1/silicon/role')
    return res.data
  }
})
export async function getRoles(): Promise<ResponseData<RoleData[]>> {
  const res = await axios.get('/api/v1/silicon/role')
  return res.data
}
export interface RoleData {
  title: string
  img: string
}

export async function getKeywords(): Promise<ResponseData<RoleData[]>> {
  const res = await axios.get('/api/v1/silicon/source')
  return res.data
}
export interface RoleData {
  title: string
}

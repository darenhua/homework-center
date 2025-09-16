import { queryOptions, useQuery } from '@tanstack/react-query'

import apiClient from '@/lib/api-client'

import type { components } from '@/types/schema.gen'

type AssignmentResponse = components['schemas']['AssignmentResponse']

export const baseKey = ['assignments'] as const

export const assignmentsQueryOptions = () =>
  queryOptions<AssignmentResponse[]>({
    queryKey: baseKey,
    queryFn: async () => {
      const { data } = await apiClient.GET('/assignments')
      return data!
    },
  })

export function useAssignments() {
  return useQuery(assignmentsQueryOptions())
}
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import apiClient from '@/lib/api-client'

export interface PastAssignment {
    assignment_id: string
    title: string | null
    due_date: string | null
    course: {
        color: string
        title: string | null
    }
}

export function usePastAssignments() {
    const { user } = useAuth()

    return useQuery({
        queryKey: ['past-assignments', user?.id],
        queryFn: async () => {
            if (!user) throw new Error('User not authenticated')

            // Get user's courses
            const { data: userCourses, error: userCoursesError } = await supabase
                .from('user_courses')
                .select('course_id')
                .eq('user_id', user.id)

            if (userCoursesError) throw userCoursesError
            if (!userCourses || userCourses.length === 0) return []

            const courseIds = userCourses.map((uc) => uc.course_id)

            // Get today's date at midnight for comparison
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            // Fetch courses with colors from API
            const coursesResponse = await apiClient.GET('/courses')
            if (coursesResponse.error) throw new Error('Failed to fetch courses')
            
            const coursesWithColors = coursesResponse.data || []
            const courseColorMap = new Map<string, string>()
            const courseTitleMap = new Map<string, string | null>()
            
            coursesWithColors.forEach((course: any) => {
                courseColorMap.set(course.id, course.color || 'blue')
                courseTitleMap.set(course.id, course.title || null)
            })

            // Fetch all assignments for user's courses
            const { data: assignments, error: assignmentsError } = await supabase
                .from('assignments')
                .select(`
                    id,
                    title,
                    chosen_due_date_id,
                    course_id,
                    courses!course_id (
                        title
                    )
                `)
                .in('course_id', courseIds)

            if (assignmentsError) throw assignmentsError
            if (!assignments || assignments.length === 0) return []

            const assignmentIds = assignments.map((a) => a.id)

            // Batch fetch all user_assignment overrides for these assignments
            const { data: userAssignments } = await supabase
                .from('user_assignments')
                .select('assignment_id, chosen_due_date_id')
                .eq('user_id', user.id)
                .in('assignment_id', assignmentIds)

            // Create a map of assignment_id -> chosen_due_date_id from user_assignments
            const userAssignmentMap = new Map<string, string>()
            userAssignments?.forEach((ua) => {
                if (ua.chosen_due_date_id) {
                    userAssignmentMap.set(ua.assignment_id, ua.chosen_due_date_id)
                }
            })

            // Collect all due date IDs we need to fetch
            const dueDateIds = new Set<string>()
            assignments.forEach((assignment) => {
                const chosenDueDateId =
                    userAssignmentMap.get(assignment.id) ||
                    assignment.chosen_due_date_id
                if (chosenDueDateId) {
                    dueDateIds.add(chosenDueDateId)
                }
            })

            // Batch fetch all due dates
            const { data: dueDates, error: dueDatesError } = await supabase
                .from('due_dates')
                .select('id, date')
                .in('id', Array.from(dueDateIds))

            if (dueDatesError) throw dueDatesError

            // Create a map of due_date_id -> date
            const dueDateMap = new Map<string, string>()
            dueDates?.forEach((dd) => {
                if (dd.date) {
                    dueDateMap.set(dd.id, dd.date)
                }
            })

            // Filter and build past assignments
            const pastAssignments: PastAssignment[] = []

            for (const assignment of assignments) {
                const chosenDueDateId =
                    userAssignmentMap.get(assignment.id) ||
                    assignment.chosen_due_date_id

                if (!chosenDueDateId) continue

                const dueDateStr = dueDateMap.get(chosenDueDateId)
                if (!dueDateStr) continue

                // Check if due date is before today
                const dueDate = new Date(dueDateStr)
                dueDate.setHours(0, 0, 0, 0)

                if (dueDate < today) {
                    const courseId = assignment.course_id
                    pastAssignments.push({
                        assignment_id: assignment.id,
                        title: assignment.title,
                        due_date: dueDateStr,
                        course: {
                            color: courseColorMap.get(courseId) || 'blue',
                            title: courseTitleMap.get(courseId) || (assignment.courses as any)?.title || null,
                        },
                    })
                }
            }

            // Sort by due_date descending (most recent past assignments first)
            return pastAssignments.sort((a, b) => {
                if (!a.due_date || !b.due_date) return 0
                return new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
            })
        },
        enabled: !!user,
    })
}

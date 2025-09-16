export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read Root */
        get: operations["read_root__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health Check */
        get: operations["health_check_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Me
         * @description Get current user information.
         */
        get: operations["get_me_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/protected": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Protected Route
         * @description Example protected endpoint that requires authentication.
         */
        get: operations["protected_route_protected_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get User Courses
         * @description Get all courses with their sources for the logged-in user.
         */
        get: operations["get_user_courses_courses_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assignments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get User Assignments
         * @description Get all upcoming assignments for user's courses.
         */
        get: operations["get_user_assignments_assignments_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assignments/{assignment_id}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark Assignment Complete
         * @description Mark an assignment as completed for the current user.
         */
        post: operations["mark_assignment_complete_assignments__assignment_id__complete_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/assignments/{assignment_id}/dates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Assignment Due Dates
         * @description Get all due dates for a specific assignment with pagination.
         */
        get: operations["get_assignment_due_dates_assignments__assignment_id__dates_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * AssignmentDueDatesResponse
         * @description Response model for assignment due dates with pagination.
         */
        AssignmentDueDatesResponse: {
            /**
             * Assignment Id
             * Format: uuid4
             */
            assignment_id: string;
            /** Data */
            data: components["schemas"]["DueDate"][];
            /** Hasmore */
            hasMore: boolean;
            /** Total */
            total: number;
        };
        /**
         * AssignmentResponse
         * @description Response model for assignment data.
         */
        AssignmentResponse: {
            /**
             * Assignment Id
             * Format: uuid4
             */
            assignment_id: string;
            /** Title */
            title: string | null;
            /** Due Date */
            due_date: string | null;
            /** Conflicting Due Date Count */
            conflicting_due_date_count: number;
            course: components["schemas"]["CourseInfo"];
        };
        /**
         * CourseInfo
         * @description Course information without source data.
         */
        CourseInfo: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Title */
            title?: string | null;
            /** Color */
            color: string;
        };
        /**
         * CourseWithColor
         * @description Course model with color attribute.
         */
        CourseWithColor: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Title */
            title?: string | null;
            /**
             * Source
             * @default []
             */
            source: components["schemas"]["SourceInfo"][];
            /** Color */
            color: string;
        };
        /**
         * DueDate
         * @description Due date model for assignment due dates response.
         */
        DueDate: {
            /** Source Url */
            source_url: string | null;
            /** Title */
            title: string | null;
            /** Date */
            date: string | null;
            /** Selected */
            selected: boolean;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /**
         * SourceInfo
         * @description Source information with sync status.
         */
        SourceInfo: {
            /** Url */
            url?: string | null;
            /** Synced */
            synced: boolean;
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    read_root__get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    health_check_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    get_me_me_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    protected_route_protected_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    get_user_courses_courses_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CourseWithColor"][];
                };
            };
        };
    };
    get_user_assignments_assignments_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssignmentResponse"][];
                };
            };
        };
    };
    mark_assignment_complete_assignments__assignment_id__complete_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                assignment_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_assignment_due_dates_assignments__assignment_id__dates_get: {
        parameters: {
            query?: {
                page?: number;
                limit?: number;
            };
            header?: never;
            path: {
                assignment_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssignmentDueDatesResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
}

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const ADMIN_API = "http://localhost:8080/api/v1/admin";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ADMIN_API,
    credentials: "include",
  }),
  tagTypes: ["Courses", "Users", "Stats"],
  endpoints: (builder) => ({

    // Admin Dashboard
    getAdminStats: builder.query({
      query: () => "/stats",
      providesTags: ["Stats"],
    }),

    // Manage Users
    getAllUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    updateUser: builder.mutation({
      query: ({ userId, payload }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),


    // Manage Courses
    getAllCourses: builder.query({
      query: () => "/courses",
      providesTags: ["Courses"],
    }),

    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    togglePublishCourse: builder.mutation({
      query: (courseId) => ({
        url: `/course/${courseId}/toggle-publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useTogglePublishCourseMutation,
} = adminApi;

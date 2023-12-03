import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUser, IUserChangeInfo, IUserDeleteInfo, IUserLoginInfo, IUserRegisterInfo } from '@/types/user.interface'
import { baseApi } from './baseApi'

export const userApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        logInUser: builder.mutation<IUser | string, IUserLoginInfo>({
            query: (userInfo: IUserLoginInfo) => ({
                body: userInfo,
                url: '/user/login',
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Collections'
            }]
        }),
        registerUser: builder.mutation<string, IUserRegisterInfo>({
            query: (userInfo: IUserRegisterInfo) => ({
                body: userInfo,
                url: '/user/register',
                method: 'POST',
            }),
        }),
        changeUser: builder.mutation<string | IUser, IUserChangeInfo>({
            query: (userInfo: IUserChangeInfo) => ({
                body: userInfo,
                url: '/user/changeInfo',
                method: 'PUT',
            }),
        }),
        changeUserAdmin: builder.mutation<string | IUser, IUser>({
            query: (user) => ({
                body: user,
                url: '/user/changeInfoAdmin',
                method: 'PUT',
            }),
            invalidatesTags: () => [{
                type: 'Users'
            }]
        }),
        deleteUser: builder.mutation<string, IUserDeleteInfo>({
            query: (userInfo: IUserDeleteInfo) => ({
                body: userInfo,
                url: '/user/delete',
                method: 'DELETE',
            }),
            invalidatesTags: () => [{
                type: 'Collections'
            },{
                type: 'Users'
            }]
        }),
        getAll: builder.query<IUser[], undefined>({
            query: () => ({
                url: '/user/getAll',
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Users'
            }]
        }),
    })
})

export const { useLogInUserMutation,
    useRegisterUserMutation,
    useChangeUserMutation,
    useDeleteUserMutation, 
    useGetAllQuery,
    useChangeUserAdminMutation } = userApi
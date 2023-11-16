import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { variables } from '../../variables'
import { IUser, IUserLoginInfo, IUserRegisterInfo } from '../../types/user.interface'

export const userApi = createApi({
    reducerPath: 'userApi',
    tagTypes: ['User'],
    baseQuery: fetchBaseQuery({
        baseUrl: variables.API_URL + '/user'
    }),
    endpoints: builder => ({
        logInUser: builder.mutation({
            query: (userInfo: IUserLoginInfo) => ({
                body: userInfo,
                url: '/login',
                method: 'POST',
            }),
        }),
        registerUser: builder.mutation({
            query: (userInfo: IUserRegisterInfo) => ({
                body: userInfo,
                url: '/register',
                method: 'POST',
            }),
        })
    })
})

export const { useLogInUserMutation, useRegisterUserMutation } = userApi
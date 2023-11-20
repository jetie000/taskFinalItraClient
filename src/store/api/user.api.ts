import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { variables } from '../../variables'
import { IUser, IUserChangeInfo, IUserDeleteInfo, IUserLoginInfo, IUserRegisterInfo } from '../../types/user.interface'

export const userApi = createApi({
    reducerPath: 'userApi',
    tagTypes: ['User'],
    baseQuery: fetchBaseQuery({
        baseUrl: variables.API_URL + '/user'
    }),
    endpoints: builder => ({
        logInUser: builder.mutation<IUser | string, IUserLoginInfo>({
            query: (userInfo: IUserLoginInfo) => ({
                body: userInfo,
                url: '/login',
                method: 'POST',
            }),
        }),
        registerUser: builder.mutation<string, IUserRegisterInfo>({
            query: (userInfo: IUserRegisterInfo) => ({
                body: userInfo,
                url: '/register',
                method: 'POST',
            }),
        }),
        changeUser: builder.mutation<string | IUser, IUserChangeInfo>({
            query: (userInfo: IUserChangeInfo) => ({
                body: userInfo,
                url: '/changeInfo',
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + (JSON.parse(localStorage.getItem(variables.USER_LOCALSTORAGE)!) as IUser)?.accessToken || ''
                }
            }),
        }),
        deleteUser: builder.mutation<string, IUserDeleteInfo>({
            query: (userInfo: IUserDeleteInfo) => ({
                body: userInfo,
                url: '/delete',
                method: 'DELETE',
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + (JSON.parse(localStorage.getItem(variables.USER_LOCALSTORAGE)!) as IUser)?.accessToken || ''
                }
            }),
        }),
    })
})

export const { useLogInUserMutation, useRegisterUserMutation, useChangeUserMutation, useDeleteUserMutation } = userApi
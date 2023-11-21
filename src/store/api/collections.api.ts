import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { variables } from '../../variables'
import { ICollection } from '../../types/collection.interface'
import { baseApi } from './baseApi'


export const collectionsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getMyCollections: builder.query<ICollection[], string>({
            query: (accessToken) => ({
                url: '/collection/getMy?accessToken='+accessToken,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Collections'
            }]
        }),
        addCollection: builder.mutation<string, ICollection>({
            query: (collection) => ({
                body: collection,
                url: '/collection/add?accessToken='+variables.ACCESS_TOKEN,
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Collections'
            }]
        }),
        changeMyCollection: builder.mutation<string, ICollection>({
            query: (collection) => ({
                body: collection,
                url: '/collection/changeInfoMy?accessToken='+variables.ACCESS_TOKEN,
                method: 'PUT',
            }),
            invalidatesTags: () => [{
                type: 'Collections'
            }]
        }),
        deleteCollection: builder.mutation<string, number>({
            query: (collectionId) => ({
                url: '/collection/delete?id='+collectionId+'&accessToken='+variables.ACCESS_TOKEN,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{
                type: 'Collections'
            }]
        }),
        postCollectionPhoto: builder.mutation<string, FormData>({
            query: (imgFileData) => ({
                body: imgFileData,
                url: '/collection/saveCollectionPhoto?accessToken='+variables.ACCESS_TOKEN,
                method: 'POST',
            }),
        }),
    })
})

export const { useAddCollectionMutation, useGetMyCollectionsQuery, useChangeMyCollectionMutation, useDeleteCollectionMutation, usePostCollectionPhotoMutation } = collectionsApi
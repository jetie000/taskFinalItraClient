import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { variables } from '@/variables'
import { ICollection } from '@/types/collection.interface'
import { baseApi } from './baseApi'
import { ICollectionInfo } from '@/types/collectionInfo.interface'


export const collectionsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getMyCollections: builder.query<ICollection[] | string, string>({
            query: (accessToken) => ({
                url: '/collection/getMy?accessToken=' + accessToken,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Collections'
            }]
        }),
        getLargestCollections: builder.query<ICollection[] | string, number>({
            query: (limit) => ({
                url: '/collection/getLargest?limit=' + limit,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Collections'
            },{
                type: 'Collection'
            }]
        }),
        getCollection: builder.query<ICollectionInfo | string, number>({
            query: (collectionId) => ({
                url: '/collection/getOne?collectionId=' + collectionId,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Collection'
            }]
        }),
        addCollection: builder.mutation<string, ICollection>({
            query: (collection) => ({
                body: collection,
                url: '/collection/add?accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Collections'
            }]
        }),
        changeMyCollection: builder.mutation<string, ICollection>({
            query: (collection) => ({
                body: collection,
                url: '/collection/change?accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'PUT',
            }),
            invalidatesTags: () => [{
                type: 'Collections'
            },{
                type: 'Collection'
            }]
        }),
        deleteCollection: builder.mutation<string, number>({
            query: (collectionId) => ({
                url: '/collection/delete?id=' + collectionId + '&accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'DELETE',
            }),
            invalidatesTags: () => [{
                type: 'Collections'
            },{
                type: 'Collection'
            }]
        }),
        postCollectionPhoto: builder.mutation<string, FormData>({
            query: (imgFileData) => ({
                body: imgFileData,
                url: '/collection/saveCollectionPhoto?accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'POST',
            }),
        }),
    })
})

export const {
    useAddCollectionMutation,
    useGetMyCollectionsQuery,
    useChangeMyCollectionMutation,
    useDeleteCollectionMutation,
    usePostCollectionPhotoMutation,
    useGetCollectionQuery,
    useGetLargestCollectionsQuery
} = collectionsApi
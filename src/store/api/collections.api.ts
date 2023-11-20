import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { variables } from '../../variables'
import { ICollection } from '../../types/collection.interface'

const AuthHeaders = {
    "Accept": "application/json",
    "Authorization": "Bearer " + variables.ACCESS_TOKEN
}

export const collectionsApi = createApi({
    reducerPath: 'collectionsApi',
    tagTypes: ['Collections'],
    baseQuery: fetchBaseQuery({
        baseUrl: variables.API_URL + '/collection'
    }),
    endpoints: builder => ({
        getMyCollections: builder.query<ICollection[], undefined>({
            query: () => ({
                url: '/getMy?accessToken='+variables.ACCESS_TOKEN,
                method: 'GET',
                headers: AuthHeaders
            }),
        }),
        addCollection: builder.mutation<string, ICollection>({
            query: (collection) => ({
                body: collection,
                url: '/add?accessToken='+variables.ACCESS_TOKEN,
                method: 'POST',
                headers: AuthHeaders
            }),
        }),
        changeMyCollection: builder.mutation<string, ICollection>({
            query: (collection) => ({
                body: collection,
                url: '/changeInfoMy?accessToken='+variables.ACCESS_TOKEN,
                method: 'PUT',
                headers: AuthHeaders
            }),
        }),
        deleteCollection: builder.mutation<string, number>({
            query: (collectionId) => ({
                url: '/delete?id='+collectionId+'&accessToken='+variables.ACCESS_TOKEN,
                method: 'DELETE',
                headers: AuthHeaders
            }),
        }),
    })
})

export const { useAddCollectionMutation, useGetMyCollectionsQuery, useChangeMyCollectionMutation, useDeleteCollectionMutation } = collectionsApi
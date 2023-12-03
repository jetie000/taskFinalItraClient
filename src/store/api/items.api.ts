import { IItem } from "@/types/item.interface"
import { IItemInfo } from "@/types/itemInfo.interface"
import { variables } from "@/variables"
import { baseApi } from "./baseApi"

export const itemsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getItem: builder.query<IItemInfo | string, number>({
            query: (itemId) => ({
                url: '/item/getOne?itemId=' + itemId,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Item'
            }]
        }),
        searchItems: builder.query<IItem[], {contain: string, limit: number}>({
            query: ({contain, limit}) => ({
                url: '/item/search?contain=' + contain+ '&limit=' + limit,
                method: 'GET',
            })
        }),
        getCommentsItems: builder.query<IItem[] | string, undefined>({
            query: () => ({
                url: '/comment/getMy?accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Item'
            }]
        }),
        getLastItems: builder.query<IItemInfo[] | string, number>({
            query: (limit) => ({
                url: '/item/getLast?limit=' + limit,
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Item'
            },{
                type: 'Collection'
            }]
        }),
        getReactionItems: builder.query<IItem[] | string, undefined>({
            query: () => ({
                url: '/reaction/getMy?accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'GET',
            }),
            providesTags: () => [{
                type: 'Item'
            }]
        }),
        addItem: builder.mutation<string, { item: IItem, collectionId: number }>({
            query: ({ item, collectionId }) => ({
                body: item,
                url: '/item/add?collectionId=' + collectionId + '&accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Collection'
            }]
        }),
        changeMyItem: builder.mutation<string, IItem>({
            query: (item) => ({
                body: item,
                url: '/item/change?accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'PUT',
            }),
            invalidatesTags: () => [{
                type: 'Item'
            }, {
                type: 'Collection'
            }]
        }),
        deleteMyItem: builder.mutation<string, number>({
            query: (itemId) => ({
                url: '/item/delete?itemId=' + itemId + '&accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'DELETE',
            }),
            invalidatesTags: () => [{
                type: 'Item'
            }, {
                type: 'Collection'
            }]
        }),
    })
})

export const {
    useAddItemMutation,
    useGetItemQuery,
    useChangeMyItemMutation,
    useDeleteMyItemMutation,
    useGetCommentsItemsQuery,
    useGetReactionItemsQuery,
    useGetLastItemsQuery,
    useSearchItemsQuery
} = itemsApi
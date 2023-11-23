import { IItem } from "../../types/item.interface"
import { variables } from "../../variables"
import { baseApi } from "./baseApi"

export const itemsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        addItem: builder.mutation<string, {item:IItem, collectionId: number}>({
            query: ({item, collectionId}) => ({
                body: item,
                url: '/item/add?collectionId='+collectionId+'&accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Items',
            },{
                type: 'Collection'
            }]
        }),
    })
})

export const {
    useAddItemMutation
} = itemsApi
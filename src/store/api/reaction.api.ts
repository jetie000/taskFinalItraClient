import { IReaction } from "@/types/reaction.interface"
import { variables } from "@/variables"
import { baseApi } from "./baseApi"

export const reactionsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        setReaction: builder.mutation<string, {reaction:IReaction, itemId: number}>({
            query: ({reaction, itemId}) => ({
                body: reaction,
                url: '/reaction/set?itemId='+itemId+'&accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Item',
            },{
                type: 'Collection'
            }]
        }),
    })
})

export const {
    useSetReactionMutation
} = reactionsApi
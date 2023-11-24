import { IComment } from "../../types/comment.interface"
import { variables } from "../../variables"
import { baseApi } from "./baseApi"

export const commentsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        addComment: builder.mutation<string, {comment:IComment, itemId: number}>({
            query: ({comment, itemId}) => ({
                body: comment,
                url: '/comment/add?itemId='+itemId+'&accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'POST',
            }),
            invalidatesTags: () => [{
                type: 'Item',
            },{
                type: 'Collection'
            }]
        }),
        deleteComment: builder.mutation<string, number>({
            query: (commentId) => ({
                url: '/comment/delete?commentId=' + commentId + '&accessToken=' + variables.GET_ACCESS_TOKEN(),
                method: 'DELETE',
            }),
            invalidatesTags: () => [{
                type: 'Item'
            },{
                type: 'Collection'
            }]
        }),
    })
})

export const {
    useAddCommentMutation,
    useDeleteCommentMutation
} = commentsApi
import { ICollection } from "./collection.interface"
import { IComment } from "./comment.interface"
import { IItemFields } from "./itemFields.interface"
import { IReaction } from "./reaction.interface"
import { ITag } from "./tag.interface"

export interface IItem{
    id: number 
    name: string 
    tags: ITag[] | undefined
    creationDate: Date
    fields : IItemFields[] | undefined
    comments : IComment[] | undefined
    likes : IReaction[] | undefined
    myCollection? : ICollection
}
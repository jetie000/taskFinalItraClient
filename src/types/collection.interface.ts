import { ICollectionFields } from "./collectionFields.interface"
import { IItem } from "./item.interface"
import { IUser } from "./user.interface"

export interface ICollection {
    id: number | undefined
    title: string
    description: string | undefined
    theme: string
    photoPath: string
    creationDate: Date
    items: IItem[] | undefined
    collectionFields: ICollectionFields[] | undefined
    user? : IUser
}
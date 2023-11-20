import { IItem } from "./item.interface"

export interface ICollection{
    id: number 
    title: string 
    description: string | undefined
    theme: string
    photoPath: string
    creationDate: Date
    items : IItem[] | undefined
}
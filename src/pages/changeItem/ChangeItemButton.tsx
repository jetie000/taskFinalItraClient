import React, { useEffect } from "react";
import { useActions } from "@/hooks/useActions";
import { useChangeMyItemMutation } from "@/store/api/items.api";
import { RootState } from "@/store/store";
import { variables } from "@/variables";
import { Toast as bootstrapToast } from 'bootstrap';
import { useSelector } from "react-redux";
import { IItemFields } from '@/types/itemFields.interface';
import { IItemInfo } from '@/types/itemInfo.interface';

function ChangeItemButton({itemTags, data}:{itemTags: string[], data: IItemInfo}) {
    const { setToastChildren } = useActions();
    const { language } = useSelector((state: RootState) => state.options);
    
    const [changeMyItem, { isLoading: isLoadingChange, isSuccess: isSuccessChange, isError: isErrorChange, error: errorChange, data: dataChange }] = useChangeMyItemMutation();
    useEffect(() => {
        if (isSuccessChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            switch (dataChange) {
                case 'No user found.':
                    setToastChildren(variables.LANGUAGES[language].USER_NOT_FOUND); break;
                case 'No item found.':
                    setToastChildren(variables.LANGUAGES[language].COLLECTION_NOT_FOUND); break;
                case 'Fields don\'t match.':
                    setToastChildren(variables.LANGUAGES[language].FIELDS_DONT_MATCH); break;
                case 'There are empty fields.':
                    setToastChildren(variables.LANGUAGES[language].EMPTY_FIELDS); break;
                case 'No access to item.':
                    setToastChildren(variables.LANGUAGES[language].NO_ACCESS_ITEM); break;
                case 'Item changed.':
                    setToastChildren(variables.LANGUAGES[language].ITEM_CHANGED); break;
                default:
                    setToastChildren(variables.LANGUAGES[language].ERROR_CHANGE_ITEM); break;
            }
            myToast.show();
        }
        if (isErrorChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_CHANGE_ITEM);
            myToast.show();
        }
    }, [isLoadingChange])

    const changeItemClick = () => {
        let inputItemName = (document.getElementById('inputItemName') as HTMLInputElement).value;
        let itemFields: IItemFields[] = [];
        (data as IItemInfo).item.fields?.forEach(field => {
            if (field.stringFieldValue !== null) {
                let valueStr = (document.getElementById('input' + field.id) as HTMLInputElement)?.value.trim()
                itemFields.push({
                    stringFieldValue: valueStr === '' ? undefined : valueStr,
                    fieldName: field.fieldName,
                    id: 0
                })
            } else
                if (field.doubleFieldValue !== null) {

                    let valueNum = (document.getElementById('input' + field.id) as HTMLInputElement)?.value;
                    itemFields.push({
                        doubleFieldValue: valueNum === '' ? undefined : Number(valueNum),
                        fieldName: field.fieldName,
                        id: 0
                    })
                } else
                    if (field.dateFieldValue !== null) {
                        let valueDate = (document.getElementById('input' + field.id) as HTMLInputElement)?.value;
                        itemFields.push({
                            dateFieldValue: valueDate === '' ? undefined : new Date(valueDate),
                            fieldName: field.fieldName,
                            id: 0
                        })
                    }
                    else {
                        itemFields.push({
                            boolFieldValue: (document.getElementById('input' + field.id) as HTMLInputElement)?.checked,
                            fieldName: field.fieldName,
                            id: 0
                        })
                    }
        })
        if (inputItemName.trim() === '' || itemFields.some(field =>
            field.dateFieldValue === undefined && field.doubleFieldValue === undefined && field.stringFieldValue === undefined && field.boolFieldValue === undefined)) {

            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].INPUT_DATA);
            myToast.show();
            return;
        }
        changeMyItem(
            {
                id: data.item.id ,
                name: inputItemName,
                tags: itemTags.map(tag => {
                    return {
                        id: 0,
                        tag: tag
                    };
                }),
                creationDate: new Date(),
                fields: itemFields,
                comments: undefined,
                likes: undefined
            })
    }

    return (
        <button onClick={() => changeItemClick()} className='btn btn-primary fs-4 mt-4'>
            {isLoadingChange ?
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>
                :
                <div>{variables.LANGUAGES[language].CHANGE_ITEM}</div>
            }
        </button>
    );
}

export default ChangeItemButton;
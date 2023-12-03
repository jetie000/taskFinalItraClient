import React, { useEffect, useState } from "react";
import { ICollectionInfo } from "@/types/collectionInfo.interface";
import { Toast as bootstrapToast } from 'bootstrap';
import { useAddItemMutation } from "@/store/api/items.api";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useActions } from "@/hooks/useActions";
import { IItemFields } from "@/types/itemFields.interface";
import { variables } from "@/variables";

function AddItem({ data }: { data: ICollectionInfo }) {
    const [isAddingItem, setIsAddingItem] = useState(false)
    const { user } = useSelector((state: RootState) => state.user);
    const { language } = useSelector((state: RootState) => state.options);
    const [addItemTags, setAddItemTags] = useState<string[]>([]);
    const [addItem, { isLoading, isSuccess, isError, error, data: dataItem }] = useAddItemMutation();
    const { setToastChildren } = useActions();

    useEffect(() => {
        if (isSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            switch (dataItem) {
                case 'No user found.':
                    setToastChildren(variables.LANGUAGES[language].USER_NOT_FOUND); break;
                case 'No collection found.':
                    setToastChildren(variables.LANGUAGES[language].COLLECTION_NOT_FOUND); break;
                case 'Fields don\'t match.':
                    setToastChildren(variables.LANGUAGES[language].FIELDS_DONT_MATCH); break;
                case 'There are empty fields.':
                    setToastChildren(variables.LANGUAGES[language].EMPTY_FIELDS); break;
                case 'Item added.': default:
                    setToastChildren(variables.LANGUAGES[language].ITEM_ADDED); break;
            }
            setIsAddingItem(false);
            myToast.show();
        }
        if (isError) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_ADDING_ITEM);
            myToast.show();
        }
    }, [isLoading])

    const addTag = () => {
        let value = (document.getElementById('inputTag') as HTMLInputElement).value;
        if (value.trim().includes(' '))
            return;
        if (value.trim() === '')
            return;
        if (addItemTags.some(tag => tag === value))
            return;
        setAddItemTags([...addItemTags, value]);
        (document.getElementById('inputTag') as HTMLInputElement).value = '';
    }

    const deleteTag = (e: React.MouseEvent<HTMLElement>) => {
        setAddItemTags(addItemTags.filter(tag => tag !== e.currentTarget.textContent))
    }

    const addItemHandler = () => {
        let inputItemName = (document.getElementById('inputItemName') as HTMLInputElement).value;
        let itemFields: IItemFields[] = [];
        data.collection.collectionFields?.forEach(field => {
            switch (field.fieldType) {
                case 'string':
                    let valueStr = (document.getElementById('input' + field.id) as HTMLInputElement)?.value.trim()
                    itemFields.push({
                        stringFieldValue: valueStr === '' ? undefined : valueStr,
                        fieldName: field.fieldName,
                        id: 0
                    })
                    break;
                case 'number':
                    let valueNum = (document.getElementById('input' + field.id) as HTMLInputElement)?.value;
                    itemFields.push({
                        doubleFieldValue: valueNum === '' ? undefined : Number(valueNum),
                        fieldName: field.fieldName,
                        id: 0
                    })
                    break;
                case 'Date':
                    let valueDate = (document.getElementById('input' + field.id) as HTMLInputElement)?.value;
                    itemFields.push({
                        dateFieldValue: valueDate === '' ? undefined : new Date(valueDate),
                        fieldName: field.fieldName,
                        id: 0
                    })
                    break;
                case 'boolean':
                    itemFields.push({
                        boolFieldValue: (document.getElementById('input' + field.id) as HTMLInputElement)?.checked,
                        fieldName: field.fieldName,
                        id: 0
                    })
                    break;
            }
        })
        if (inputItemName.trim() === '' || itemFields.some(field =>
            field.dateFieldValue === undefined && field.doubleFieldValue === undefined && field.stringFieldValue === undefined && field.boolFieldValue === undefined)) {

            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].INPUT_DATA);
            myToast.show();
            return;
        }
        addItem({
            item: {
                id: 0,
                name: inputItemName,
                tags: addItemTags.map(tag => {
                    return {
                        id: 0,
                        tag: tag
                    };
                }),
                creationDate: new Date(),
                fields: itemFields,
                comments: undefined,
                likes: undefined
            },
            collectionId: data.collection.id || 0
        })
    }

    return (
        <>
            {
                isAddingItem &&
                <div className="border rounded-4 p-3 mt-3 fs-5 d-flex flex-column">
                    <h3>{variables.LANGUAGES[language].ITEM_ADDING}</h3>
                    <div className="d-flex gap-4 mb-3">
                        <div className="d-flex flex-column w-50">
                            <label htmlFor="inputItemName">{variables.LANGUAGES[language].ITEM_NAME}</label>
                            <input type='text' className="form-control" id="inputItemName" placeholder={variables.LANGUAGES[language].ENTER_ITEM_NAME} />
                            {
                                data.collection.collectionFields && data.collection.collectionFields.map(field =>
                                    <div key={field.id}>
                                        <label htmlFor={"input" + field.id}>{field.fieldName}</label>
                                        <input type={
                                            field.fieldType === 'string' ?
                                                'text' : (
                                                    field.fieldType === 'number' ?
                                                        'number' : (
                                                            field.fieldType === 'Date' ?
                                                                'datetime-local' :
                                                                'checkbox'
                                                        ))
                                        } className={"item-field form-control " + (field.fieldType === 'boolean' && 'form-check-input p-2')} id={"input" + field.id}
                                        />
                                    </div>
                                )
                            }
                        </div>
                        <div className="d-flex flex-column w-50 flex-wrap">
                            <span>{variables.LANGUAGES[language].ADD_TAGS}</span>
                            <div className="d-flex gap-3">
                                <input type='text' className="form-control" id="inputTag" placeholder={variables.LANGUAGES[language].ENTER_TAG} />
                                <button className="btn btn-primary" onClick={() => addTag()}>{variables.LANGUAGES[language].ADD}</button>
                            </div>
                            <div className="d-flex gap-2 flex-wrap pt-2">
                                {addItemTags.map(tag =>
                                    <div key={tag}
                                        className="flex-grow-0 btn btn-info border rounded-4 p-0 ps-2 pe-2"
                                        onClick={e => deleteTag(e)}>
                                        {tag}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                    <button onClick={() => addItemHandler()} className="btn btn-primary">
                        {variables.LANGUAGES[language].ADD_ITEM}
                    </button>
                </div>
            }
            {
                user && ((user.collections && user.collections.some(collection => collection.id === data.collection.id)) || user.role === 1) &&
                <div className='btn btn-outline-primary mt-3 border rounded-4 d-flex' onClick={() => setIsAddingItem(!isAddingItem)}>
                    {
                        isAddingItem ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-chevron-up m-auto" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-plus-circle m-auto" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                    }
                </div>
            }</>
    );
}

export default AddItem;
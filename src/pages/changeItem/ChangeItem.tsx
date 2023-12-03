import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import { Toast as bootstrapToast } from 'bootstrap';
import { useGetItemQuery } from '@/store/api/items.api';
import { useActions } from '@/hooks/useActions';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { variables } from '@/variables';
import './ChangeItem.scss'
import ChangeItemButton from './ChangeItemButton';

function ChangeItem() {
    let { id, idItem } = useParams();
    const { language } = useSelector((state: RootState) => state.options);
    
    const { user } = useSelector((state: RootState) => state.user);
    if (!user) {
        return <Navigate to={'/'}/>;
    }
    
    const { isLoading, isSuccess, isError, error, data } = useGetItemQuery(Number(idItem))
    const { setToastChildren } = useActions();
    const [itemTags, setItemTags] = useState<string[]>([]);

    useEffect(() => {
        if (isSuccess && typeof (data) !== 'string') {
            setItemTags(data.item.tags?.map(tag => tag.tag) || []);

        }
        if (isError || data === 'No item found.') {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].COLLECTION_NOT_FOUND);
            myToast.show();
        }
    }, [isLoading])

    const addTag = () => {
        let value = (document.getElementById('inputTag') as HTMLInputElement).value;
        if (value.trim().includes(' '))
            return;
        if (value.trim() === '')
            return;
        if (itemTags.some(tag => tag === value))
            return;
        setItemTags([...itemTags, value]);
        (document.getElementById('inputTag') as HTMLInputElement).value = '';
    }

    const deleteTag = (e: React.MouseEvent<HTMLElement>) => {
        setItemTags(itemTags.filter(tag => tag !== e.currentTarget.textContent))
    }

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={id ? '/collection/' + id + '/item/' + idItem : '/item/' + idItem} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    {variables.LANGUAGES[language].RETURN_TO_ITEM}
                </Link>
                {
                    data && typeof (data) !== 'string' && <>
                        <h2 className="text-center p-3">
                            {variables.LANGUAGES[language].ITEM_CHANGING}
                        </h2>
                        <div className="d-flex align-self-center flex-column w-75 mb-4 changeItem_wrapper">
                            <div className="d-flex gap-4 mb-3">
                                <div className="d-flex flex-column w-50">
                                    <label htmlFor="inputItemName">{variables.LANGUAGES[language].ITEM_NAME}</label>
                                    <input type='text' className="form-control" id="inputItemName" placeholder={variables.LANGUAGES[language].ENTER_ITEM_NAME} defaultValue={data.item.name} />
                                    {
                                        data.item.fields && data.item.fields.map(field =>
                                            <div key={field.id}>
                                                <label htmlFor={"input" + field.id}>{field.fieldName}</label>
                                                {
                                                    field.stringFieldValue !== null
                                                        ? <input type="text" defaultValue={field.stringFieldValue} className='item-field form-control' id={"input" + field.id} />
                                                        : (field.doubleFieldValue !== null
                                                            ? <input type='number' defaultValue={field.doubleFieldValue} className='item-field form-control' id={"input" + field.id} />
                                                            : (field.dateFieldValue !== null
                                                                ? <input type='datetime-local' defaultValue={field.dateFieldValue?.toString()} className='item-field form-control' id={"input" + field.id} />
                                                                : <input type='checkbox' defaultChecked={field.boolFieldValue} className='item-field form-control form-check-input p-2' id={"input" + field.id} />))
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="d-flex flex-column w-50">
                                    <span>{variables.LANGUAGES[language].TAGS}</span>
                                    <div className="d-flex gap-3">
                                        <input type='text' className="form-control" id="inputTag" placeholder={variables.LANGUAGES[language].ENTER_TAG} />
                                        <button className="btn btn-primary" onClick={() => addTag()}>{variables.LANGUAGES[language].ADD}</button>
                                    </div>
                                    {itemTags && itemTags.length > 0 &&
                                        <div className="d-flex gap-2 flex-wrap pt-2">
                                            {itemTags.map(tag =>
                                                <div key={tag}
                                                    className=" btn btn-info border rounded-4 p-0 ps-2 pe-2 text-truncate"
                                                    onClick={e => deleteTag(e)}>
                                                    {tag}
                                                </div>
                                            )}
                                        </div>
                                    }
                                </div>
                            </div>
                            <ChangeItemButton itemTags={itemTags} data={data}/>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default ChangeItem;
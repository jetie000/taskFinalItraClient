import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import { Toast as bootstrapToast } from 'bootstrap';
import { useChangeMyItemMutation, useGetItemQuery } from '../../store/api/items.api';
import { useActions } from '../../hooks/useActions';
import { ITag } from '../../types/tag.interface';
import { IItemFields } from '../../types/itemFields.interface';
import { IItemInfo } from '../../types/itemInfo.interface';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

function ChangeItem() {
    let { id, idItem } = useParams();
    
    const { user } = useSelector((state: RootState) => state.user);
    if (!user) {
        return <Navigate to={'/'}/>;
    }
    
    const { isLoading, isSuccess, isError, error, data } = useGetItemQuery(Number(idItem))
    const [changeMyItem, { isLoading: isLoadingChange, isSuccess: isSuccessChange, isError: isErrorChange, error: errorChange, data: dataChange }] = useChangeMyItemMutation();
    const { setToastChildren } = useActions();
    const [itemTags, setItemTags] = useState<string[]>([]);

    useEffect(() => {
        if (isSuccess && typeof (data) !== 'string') {
            setItemTags(data.item.tags?.map(tag => tag.tag) || []);

        }
        if (isError || data === 'No item found.') {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Коллекция не найдена');
            myToast.show();
        }
    }, [isLoading])

    useEffect(() => {
        if (isSuccessChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            switch (dataChange) {
                case 'No user found.':
                    setToastChildren('Пользователь не найден'); break;
                case 'No item found.':
                    setToastChildren('Коллекция не найдена'); break;
                case 'Fields don\'t match.':
                    setToastChildren('Поля коллекции и предмета не совпадают'); break;
                case 'There are empty fields.':
                    setToastChildren('Присутствуют пустые поля'); break;
                case 'No access to item.':
                    setToastChildren('Нет доступа к предмету'); break;
                case 'Item changed.':
                    setToastChildren('Предмет успешно изменен'); break;
                default:
                    setToastChildren('Ошибка изменения предмета'); break;
            }
            myToast.show();
        }
        if (isErrorChange) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка изменения предмета');
            myToast.show();
        }
    }, [isLoadingChange])

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
            setToastChildren('Введите данные');
            myToast.show();
            return;
        }
        changeMyItem(
            {
                id: (data as IItemInfo).item.id ,
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
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={id ? '/collection/' + id + '/item/' + idItem : '/item/' + idItem} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    Вернуться к предмету
                </Link>
                {
                    data && typeof (data) !== 'string' && <>
                        <h2 className="text-center p-3">
                            Изменение предмета
                        </h2>
                        <div className="d-flex align-self-center flex-column w-75 mb-4">
                            <div className="d-flex gap-4 mb-3">
                                <div className="d-flex flex-column w-50">
                                    <label htmlFor="inputItemName">Название предмета</label>
                                    <input type='text' className="form-control" id="inputItemName" placeholder="Введите название предмета" defaultValue={data.item.name} />
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
                                    <span>Теги</span>
                                    <div className="d-flex gap-3">
                                        <input type='text' className="form-control" id="inputTag" placeholder="Введите тег" />
                                        <button className="btn btn-primary" onClick={() => addTag()}>Добавить</button>
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
                            <button onClick={() => changeItemClick()} className='btn btn-primary fs-4 mt-4'>
                                {isLoadingChange ?
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Загрузка...</span>
                                    </div>
                                    :
                                    <div>Изменить предмет</div>
                                }
                            </button>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default ChangeItem;
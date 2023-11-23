import React, { useEffect, useState } from 'react'
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { IModalInfo } from '../../types/modalInfo.interface';
import Modal from '../modal/Modal';
import { useDeleteCollectionMutation } from '../../store/api/collections.api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { variables } from '../../variables';
import { useActions } from '../../hooks/useActions';
import { useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import { IItemInfo } from '../../types/itemInfo.interface';
import { useDeleteMyItemMutation } from '../../store/api/items.api';
import ItemInfoFields from './ItemInfoFields';
import ItemInfoTags from './ItemInfoTags';

function ItemInfo({ data }: { data: IItemInfo }) {
    let { id, idItem } = useParams();
    const { user } = useSelector((state: RootState) => state.user);
    const { setToastChildren } = useActions();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [deleteItem, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete, data: dataDelete }] = useDeleteMyItemMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccessDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            switch (dataDelete) {
                case 'No user found.':
                    setToastChildren('Пользователь не найден'); break;
                case 'No item found.':
                    setToastChildren('Предмет не найден'); break;
                case 'No access to item.':
                    setToastChildren('Нет доступа к предмету'); break;
                case 'Item deleted.':
                    setToastChildren('Предмет успешно удален'); break;
            }
            myToast.show();
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка удаления предмета');
            myToast.show();
        }
    }, [isLoadingDelete])

    const deleteItemClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('itemModal') || 'itemModal');
        const children = data && typeof (data) !== 'string'
            ?
            <div className='d-flex flex-column gap-3'>
                <span>Вы точно хотите удалить предмет? Вместе с этим вы удалите все его комментарии и реакции.</span>
                <button onClick={() => {
                    deleteItem(data.item.id!);
                    myModal.hide()
                }} className='btn btn-danger'>
                    Удалить предмет
                </button>
            </div >
            : <div>Предмет не найден</div>;
        setModalInfo({ title: "Удаление предмета", children: children });
        myModal.show();
    }
    return (
        <>
            <div className="d-flex">
                <img className="w-50 rounded-4" src={variables.PHOTOS_URL + data.item.myCollection?.photoPath} alt="collection img" />
                <div className="d-flex flex-column ps-5 justify-content-around flex-fill">
                    <span className="fs-1 align-self-center">Предмет</span>
                    <hr />
                    <span className='fs-1'>{data.item.name}</span>
                    <hr />
                    <div className='d-flex gap-2 fs-2'>
                        <div className='d-flex flex-column'>
                            <span className='fw-light'>Дата создания: </span>
                            <span>Коллекция: </span>
                        </div>
                        <div className='d-flex flex-column'>
                            <span className='fw-light'>{new Date(data.item.creationDate).toLocaleString()}</span>
                            <span className='d-flex gap-2 align-items-center'>
                                {data.item.myCollection?.title}
                                {!id &&
                                    <button onClick={() => navigate('/collection/' + data.collectionId)} className='btn btn-primary fs-5'>Перейти</button>
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {
                user && user.id === data.userId &&
                <div className="d-flex gap-3 mt-3">
                    <button onClick={() => navigate('/collection/' + data.collectionId + '/item/' + data.item.id + '/change')} className="btn btn-primary fs-4 w-50">
                        Изменить предмет
                    </button>
                    <button onClick={() => deleteItemClick()} className="btn btn-danger fs-4 w-50">
                        Удалить предмет
                    </button>
                </div>
            }
            {
                data.item.fields && data.item.fields.length > 0 &&
                <ItemInfoFields itemFields={data.item.fields} />
            }
            {
                data.item.tags && data.item.tags.length > 0 &&
                <ItemInfoTags tags={data.item.tags}/>
            }
            <Modal id={"itemModal"} title={modalInfo.title}>
                {modalInfo.children}
            </Modal>
        </>
    );
}

export default ItemInfo;
import React, { useEffect, useState } from 'react'
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { ICollectionInfo } from '../../types/collectionInfo.interface';
import { IModalInfo } from '../../types/modalInfo.interface';
import Modal from '../modal/Modal';
import { useDeleteCollectionMutation } from '../../store/api/collections.api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { variables } from '../../variables';
import { useActions } from '../../hooks/useActions';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';

function CollectionInfo({ data }: { data: ICollectionInfo }) {
    const { user } = useSelector((state: RootState) => state.user);
    const { setToastChildren } = useActions();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [deleteCollection, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete, data: dataDelete }] = useDeleteCollectionMutation();
    const navigate = useNavigate();
    useEffect(() => {
        if (isSuccessDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (dataDelete === 'No user found.')
                setToastChildren('Пользователь не найден');
            else
                if (dataDelete === 'No collection found.')
                    setToastChildren('Коллекция не найдена');
                else {
                    setToastChildren('Коллекция успешно удалена');
                }
            myToast.show();
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка удаления коллекции');
            myToast.show();
        }
    }, [isLoadingDelete])

    const deleteCollectionClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('collectionModal') || 'collectionModal');
        const children = data && typeof (data) !== 'string'
            ?
            <div className='d-flex flex-column gap-3'>
                <span>Вы точно хотите удалить коллекцию? Вместе с этим вы удалите все предметы этой коллекции.</span>
                <button onClick={() =>
                    deleteCollection(data.collection.id!)} className='btn btn-danger'>
                    Удалить коллекцию
                </button>
            </div >
            : <div>Коллекция не найдена</div>;
        setModalInfo({ title: "Удаление коллекции", children: children });
        myModal.show();
    }
    return (
        <>
            <div className="d-flex">
                <img className="w-50 rounded-4" src={variables.PHOTOS_URL + data.collection.photoPath} alt="collection img" />
                <div className="d-flex flex-column ps-5 justify-content-around flex-fill w-50">
                    <span className="fs-1 align-self-center">Коллекция</span>
                    <hr />
                    <span className='fs-1 text-truncate'>{data.collection.title}</span>
                    <hr />
                    <div className='d-flex gap-2 fs-2'>
                        <div className='d-flex flex-column'>
                            <span className='fw-light'>Категория: </span>
                            <span>Предметов: </span>
                            <span>Полей: </span>
                            <span>Создано: </span>
                            <span>Создатель: </span>
                        </div>
                        <div className='d-flex flex-column'>
                            <span className='fw-light text-truncate'>{data.collection.theme}</span>
                            <span className="ms-2">{data.collection.items?.length || 0}</span>
                            <span className="ms-2">{data.collection.collectionFields?.length || 0}</span>
                            <span>{new Date(data.collection.creationDate).toLocaleString()}</span>
                            <span className='text-truncate'>{data.userName}</span>
                        </div>
                    </div>
                </div>
            </div>
            {
                data.collection.description && data.collection.description?.trim() != '' &&
                <div className="mt-4 fs-5 text-break" dangerouslySetInnerHTML={{ __html: marked.parse(data.collection.description) }}>
                </div>
            }
            {
                user && user.collections?.some(collection => collection.id === data.collection.id) &&
                <div className="d-flex gap-3 mt-3">
                    <button onClick={() => navigate('/collection/' + data.collection.id + '/change')} className="btn btn-primary fs-4 w-50">
                        Изменить коллекцию
                    </button>
                    <button onClick={() => deleteCollectionClick()} className="btn btn-danger fs-4 w-50">
                        Удалить коллекцию
                    </button>
                </div>
            }
            <Modal id={"collectionModal"} title={modalInfo.title}>
                {modalInfo.children}
            </Modal>
        </>
    );
}

export default CollectionInfo;
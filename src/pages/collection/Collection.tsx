import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { useDeleteCollectionMutation, useGetCollectionQuery, useGetMyCollectionsQuery } from "../../store/api/collections.api";
import { useActions } from "../../hooks/useActions";
import { variables } from "../../variables";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import Modal from "../modal/Modal";
import { IModalInfo } from "../../types/modalInfo.interface";
function Collection() {
    let { id } = useParams();
    const { user } = useSelector((state: RootState) => state.user);
    const { isLoading, isSuccess, isError, error, data } = useGetCollectionQuery(Number(id))
    const { isLoading: isLoadingMy, isSuccess: isSuccessMy, isError: isErrorMy, error: errorMy, data: dataMy } = useGetMyCollectionsQuery(user?.accessToken || '')
    const [deleteCollection, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete, data: dataDelete }] = useDeleteCollectionMutation();
    const { setToastChildren } = useActions();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (isError || data === 'No collection found.') {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Коллекция не найдена');
            myToast.show();
        }
    }, [isLoading])

    useEffect(() => {
        if (isErrorMy) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка загрузки коллекций');
            myToast.show();
        }
    }, [isLoadingMy])

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
                    myToast.show();
                }
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
                    deleteCollection(data.id!)} className='btn btn-danger'>
                    Удалить коллекцию
                </button>
            </div >
            : <div>Коллекция не найдена</div>;
        setModalInfo({ title: "Удаление коллекции", children: children });
        myModal.show();
    }

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={'/'} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    Вернуться на главную
                </Link>
                {
                    data && typeof (data) != 'string' &&
                    <div className="d-flex flex-column">
                        <div className="d-flex">
                            <img className="w-50 rounded-4" src={variables.PHOTOS_URL + data.photoPath} alt="collection img" />
                            <div className="d-flex flex-column ps-5 justify-content-around flex-fill">
                                <span className="fs-1 align-self-center">Коллекция</span>
                                <hr />
                                <span className='fs-1'>{data.title}</span>
                                <hr />
                                <div className='d-flex gap-2 fs-2'>
                                    <div className='d-flex flex-column'>
                                        <span className='fw-light'>Категория: </span>
                                        <span>Предметов: </span>
                                        <span>Полей: </span>
                                        <span>Создано: </span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <span className='fw-light'>{data.theme}</span>
                                        <span className="ms-2">{data.items?.length || 0}</span>
                                        <span className="ms-2">{data.collectionFields?.length || 0}</span>
                                        <span>{new Date(data.creationDate).toLocaleTimeString() + ' ' + new Date(data.creationDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            data.description && data.description?.trim() != '' &&
                            <div className="pt-5 fs-3">
                                {data.description}
                            </div>
                        }
                        {
                            data.items && data.items?.length > 0 &&
                            <ul className="list-group">
                                {
                                    data.items.map(item =>
                                        <li className="list-group-item">
                                            {item.name}
                                        </li>
                                    )
                                }
                            </ul>
                        }
                        {
                            dataMy && dataMy?.some(collection => collection.id === data.id) &&
                            <div className="d-flex gap-3 mt-3">
                                <button className="btn btn-primary fs-4 w-50">
                                    Изменить коллекцию
                                </button>
                                <button onClick={() => deleteCollectionClick()} className="btn btn-danger fs-4 w-50">
                                    Удалить коллекцию
                                </button>
                            </div>
                        }
                        <span className="fs-1 mt-3">Предметы:</span>
                        <div className='btn btn-outline-primary mt-3 border rounded-4 d-flex' onClick={() => navigate('/collection/' + id + '/additem')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-plus-circle m-auto" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                            </svg>
                        </div>

                    </div>
                }
                <Modal id={"collectionModal"} title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
        </div>
    );
}

export default Collection;
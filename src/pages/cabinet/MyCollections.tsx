import React, { useEffect } from 'react'
import { useActions } from '../../hooks/useActions';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toast as bootstrapToast } from 'bootstrap';
import { useGetMyCollectionsQuery } from '../../store/api/collections.api';
import './Cabinet.scss'
import { variables } from '../../variables';

function MyCollections() {
    const { setUser, setToastChildren, setCollections } = useActions();
    const { user } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const { isLoading, isSuccess, isError, error, data } = useGetMyCollectionsQuery(user?.accessToken || '')

    useEffect(() => {
        if (isSuccess) {
            setCollections(data);
        }
        if (isError) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка загрузки коллекций');
            myToast.show();
        }
    }, [isLoading])

    return (
        <div className='ps-3 pe-3 d-flex flex-column flex-fill'>
            <h2 className='text-center p-3'>
                Мои коллекции
            </h2>
            <div className='overflow-y-auto collection-wrapper'>
                {
                    user?.collections &&
                    user.collections.map(collection => {
                        let correctDate = new Date(collection.creationDate).toLocaleTimeString() + ' ' + new Date(collection.creationDate).toLocaleDateString();
                        return <div className='m-2 border rounded-4 collection-item d-flex cursor-pointer' key={collection.id}>
                            <img className='rounded-start-4' src={variables.PHOTOS_URL + collection.photoPath} alt="CollectionImg" />
                            <div className='d-flex flex-column p-4 ps-5 fs-5 justify-content-around'>
                                <span className='fs-1'>{collection.title}</span>
                                <div className='d-flex gap-2'>
                                    <div className='d-flex flex-column'>
                                        <span className='fs-3 fw-light'>Категория: </span>
                                        <span>Предметов: </span>
                                        <span>Полей: </span>
                                        <span>Создано: </span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <span className='fs-3 fw-light'>{collection.theme}</span>
                                        <span>{collection.items?.length || 0}</span>
                                        <span>{collection.collectionFields?.length || 0}</span>
                                        <span>{correctDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    )
                }
                <div className='btn btn-outline-primary collection-add m-2 border rounded-4 d-flex' onClick={() => navigate('/addcollection')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-plus-circle m-auto" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                </div>
            </div>
            {/* <Modal id='myInfoModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal> */}
        </div>
    );
}

export default MyCollections;
import React, { useEffect } from 'react'
import { useActions } from '@/hooks/useActions';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toast as bootstrapToast } from 'bootstrap';
import { useGetMyCollectionsQuery } from '@/store/api/collections.api';
import './Cabinet.scss'
import { variables } from '@/variables';
import { ICollection } from '@/types/collection.interface';

function MyCollections() {
    const { setToastChildren, setCollections } = useActions();
    const { user } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const { language } = useSelector((state: RootState) => state.options);
    const { isLoading, isSuccess, isError, error, data } = useGetMyCollectionsQuery(user?.accessToken || '')

    useEffect(() => {
        if (isSuccess) {
            if (data === 'No user found.') {

                const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
                setToastChildren(variables.LANGUAGES[language].ERROR_LOAD_COLLECTIONS);
                myToast.show();
            }
            else
                setCollections(data as ICollection[]);
        }
        if (isError) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_LOAD_COLLECTIONS);
            myToast.show();
        }
    }, [isLoading])

    return (
        <div className='ps-3 pe-3 d-flex flex-column w-75 flex-fill'>
            <h2 className='text-center p-3'>
                {variables.LANGUAGES[language].MY_COLLECTIONS}
            </h2>
            <div className='overflow-y-auto collection-wrapper flex-fill'>
                {
                    user?.collections &&
                    user.collections.map(collection => {
                        let correctDate = new Date(collection.creationDate).toLocaleTimeString() + ' ' + new Date(collection.creationDate).toLocaleDateString();
                        return <div onClick={() => navigate('/collection/' + collection.id)} className='m-2 border rounded-4 collection-item d-flex cursor-pointer' key={collection.id}>
                            <img className='rounded-start-4' src={variables.PHOTOS_URL + collection.photoPath} alt="CollectionImg" />
                            <div className='d-flex flex-column p-4 ps-5 fs-5 justify-content-around flex-fill w-25'>
                                <span className='fs-1 text-truncate'>{collection.title}</span>
                                <div className='d-flex gap-2'>
                                    <div className='d-flex flex-column'>
                                        <span className='fs-3 fw-light'>{variables.LANGUAGES[language].CATEGORY} </span>
                                        <span>{variables.LANGUAGES[language].ITEMS} </span>
                                        <span>{variables.LANGUAGES[language].FIELDS} </span>
                                        <span>{variables.LANGUAGES[language].CREATED} </span>
                                    </div>
                                    <div className='d-flex flex-column'>
                                        <span className='fs-3 fw-light text-truncate'>{collection.theme}</span>
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
                {isLoading &&
                    <div className="d-flex p-3">
                        <div className="spinner-border m-auto" role="status">
                            <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
                        </div>
                    </div>
                }
                <div className='btn btn-outline-primary collection-add m-2 border rounded-4 d-flex' onClick={() => navigate('/addcollection')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-plus-circle m-auto" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default MyCollections;
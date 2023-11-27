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
    const { language } = useSelector((state: RootState) => state.options);
    const { setToastChildren } = useActions();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [deleteCollection, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete, data: dataDelete }] = useDeleteCollectionMutation();
    const navigate = useNavigate();
    useEffect(() => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('collectionModal') || 'collectionModal');
        if (isSuccessDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (dataDelete === 'No user found.')
                setToastChildren(variables.LANGUAGES[language].USER_NOT_FOUND);
            else
                if (dataDelete === 'No collection found.')
                    setToastChildren(variables.LANGUAGES[language].COLLECTION_NOT_FOUND);
                else {
                    setToastChildren(variables.LANGUAGES[language].COLLECTION_DELETED);
                }
            myToast.show();
            myModal.hide()
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_DELETING_COLLECTION);
            myToast.show();
            myModal.hide();
        }
    }, [isLoadingDelete])

    const deleteCollectionClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('collectionModal') || 'collectionModal');
        const children = data && typeof (data) !== 'string'
            ?
            <div className='d-flex flex-column gap-3'>
                <span>{variables.LANGUAGES[language].SURE_DELETE_COLLECTION}</span>
                <button onClick={() =>
                    deleteCollection(data.collection.id!)} className='btn btn-danger'>
                    {variables.LANGUAGES[language].DELETE_COLLECTION}
                </button>
            </div >
            : <div>{variables.LANGUAGES[language].COLLECTION_NOT_FOUND}</div>;
        setModalInfo({ title: variables.LANGUAGES[language].COLLECTION_DELETING, children: children });
        myModal.show();
    }
    return (
        <>
            <div className="d-flex">
                <img className="w-50 rounded-4" src={variables.PHOTOS_URL + data.collection.photoPath} alt="collection img" />
                <div className="d-flex flex-column ps-5 justify-content-around flex-fill w-50">
                <span className="fs-1 align-self-center">{variables.LANGUAGES[language].COLLECTION}</span>
                    <hr />
                    <span className='fs-1 text-truncate'>{data.collection.title}</span>
                    <hr />
                    <div className='d-flex gap-2 fs-2'>
                        <div className='d-flex flex-column'>
                            <span className='fw-light'>{variables.LANGUAGES[language].CATEGORY}</span>
                            <span>{variables.LANGUAGES[language].ITEMS}</span>
                            <span>{variables.LANGUAGES[language].FIELDS}</span>
                            <span>{variables.LANGUAGES[language].CREATED}</span>
                            <span>{variables.LANGUAGES[language].CREATOR}</span>
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
                user && ((user.collections && user.collections?.length > 0 && user.collections.some(collection => collection.id === data.collection.id)) || user.role === 1) &&
                <div className="d-flex gap-3 mt-3">
                    <button onClick={() => navigate('/collection/' + data.collection.id + '/change')} className="btn btn-primary fs-4 w-50">
                        {variables.LANGUAGES[language].CHANGE_COLLECTION_}
                    </button>
                    <button onClick={() => deleteCollectionClick()} className="btn btn-danger fs-4 w-50">
                        {variables.LANGUAGES[language].DELETE_COLLECTION}
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
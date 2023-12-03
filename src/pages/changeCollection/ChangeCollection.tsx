import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from "react-router-dom";
import { useChangeMyCollectionMutation, useGetCollectionQuery, usePostCollectionPhotoMutation } from '@/store/api/collections.api';
import MyCropper from '@/pages/addCollection/MyCropper';
import { useActions } from '@/hooks/useActions';
import { IModalInfo } from '@/types/modalInfo.interface';
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { dataUrlToFile } from '@/utils/cropUtils';
import Modal from '@/pages/modal/Modal';
import { variables } from '@/variables';
import { ICollectionInfo } from '@/types/collectionInfo.interface';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import './ChangeCollection.scss'

function ChangeCollection() {
    let { id } = useParams();
    const { isLoading: isLoadingGet, isSuccess: isSuccessGet, isError: isErrorGet, error: errorGet, data: dataGet } = useGetCollectionQuery(Number(id))
    const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const { language } = useSelector((state: RootState) => state.options);
    const { setToastChildren } = useActions();
    
    const { user } = useSelector((state: RootState) => state.user);
    if (!user) {
        return <Navigate to={'/collection/' + id} />;
    }

    const [changeCollection, { isLoading, isSuccess, isError, error, data }] = useChangeMyCollectionMutation();
    const [postCollectionImg, { isLoading: isLoadingImg, isSuccess: isSuccessImg, isError: isErrorImg, error: errorImg, data: dataImg }] = usePostCollectionPhotoMutation();

    useEffect(() => {
        if (isSuccessImg) {
            let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
            let inputTheme = (document.getElementById('inputTheme') as HTMLInputElement).value;
            let inputDesc = (document.getElementById('inputDesc') as HTMLInputElement).value;

            changeCollection({
                id: (dataGet as ICollectionInfo).collection.id,
                title: inputName,
                description: inputDesc !== '' ? inputDesc : undefined,
                theme: inputTheme,
                photoPath: dataImg || 'default.jpg',
                creationDate: new Date(),
                items: [],
                collectionFields: undefined
            })
        }
        if (isErrorImg) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_LOADING_COLLECTION_PHOTO);
            myToast.show();
        }
    }, [isLoadingImg]);

    useEffect(() => {
        if (isSuccess) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('addCollectionModal') || 'addCollectionModal');
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (data === "No user found.") {
                setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].ERROR_ACCESS_TOKEN })
                myModal.show();
            } else
            if(data === "No collection found."){
                setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].COLLECTION_NOT_FOUND })
                myModal.show();
            }
            else {
                setToastChildren(variables.LANGUAGES[language].COLLECTION_CHANGED);
                myToast.show();
            }
        }
        if (isError) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('addCollectionModal') || 'addCollectionModal');
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: (error as FetchBaseQueryError).data as string })
            myModal.show();
        }
    }, [isLoading])

    const changeCollectionClick = async () => {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputTheme = (document.getElementById('inputTheme') as HTMLInputElement).value;
        let inputDesc = (document.getElementById('inputDesc') as HTMLInputElement).value;
        if (inputName === '' || inputTheme === '') {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('addCollectionModal') || 'addCollectionModal');
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].INPUT_DATA })
            myModal.show();
            return;
        }
        if (croppedImage) {
            const formData = new FormData();
            let imgFile = await dataUrlToFile(croppedImage, inputName + '.jpg')
            formData.append('file', imgFile, imgFile.name);
            postCollectionImg(formData);
        }
        else {
            changeCollection({
                id: (dataGet as ICollectionInfo).collection.id,
                title: inputName,
                description: inputDesc !== '' ? inputDesc : undefined,
                theme: inputTheme,
                photoPath: (dataGet as ICollectionInfo).collection.photoPath,
                creationDate: new Date(),
                items: [],
                collectionFields: undefined
            })
        }
    }

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={id ? '/collection/' + id : '/'} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    {variables.LANGUAGES[language].RETURN_TO_COLLECTION}
                </Link>
                {
                    dataGet && typeof (dataGet) !== 'string' && <>
                        <h2 className="text-center p-3">
                            {variables.LANGUAGES[language].CHANGE_COLLECTION}
                        </h2>
                        <div className="d-flex align-self-center flex-column w-50 mb-4 changeCollection_wrapper">
                            <span className='fs-5'>
                                {variables.LANGUAGES[language].COLLECTION_PHOTO}
                            </span>
                            <MyCropper croppedImage={croppedImage} setCroppedImage={setCroppedImage} />
                            {croppedImage ? <img className='img-fluid border rounded-2 mb-1' src={croppedImage} alt="blab" />
                            :  <img className='img-fluid border rounded-2 mb-1' src={variables.PHOTOS_URL + dataGet.collection.photoPath} alt="blab" />}
                            <label className="mb-1 fs-5" htmlFor="inputName">{variables.LANGUAGES[language].COLLECTION_NAME}</label>
                            <input className="form-control fs-6 mb-3" id="inputName" placeholder={variables.LANGUAGES[language].ENTER_COLLECTION_NAME} defaultValue={dataGet.collection.title} />
                            <label className="mb-1 fs-5" htmlFor="inputTheme">{variables.LANGUAGES[language].COLLECTION_THEME}</label>
                            <input className="form-control fs-6 mb-3" id="inputTheme" placeholder={variables.LANGUAGES[language].ENTER_COLLECTION_THEME} defaultValue={dataGet.collection.theme} />
                            <label className="mb-1 fs-5" htmlFor="inputDesc">{variables.LANGUAGES[language].COLLECTION_DESCRIPTION}</label>
                            <textarea rows={4} className="form-control fs-6 mb-3" id="inputDesc" placeholder={variables.LANGUAGES[language].ENTER_COLLECTION_DESCRIPTION} defaultValue={dataGet.collection.description}/>
                            <button onClick={() => changeCollectionClick()} className='btn btn-primary fs-4 mt-4'>
                                {isLoadingImg || isLoading ?
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
                                    </div>
                                    :
                                    <div>{variables.LANGUAGES[language].CHANGE_COLLECTION_}</div>
                                }
                            </button>
                        </div>
                    </>
                }
                <Modal id='addCollectionModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
        </div>
    );
}

export default ChangeCollection;
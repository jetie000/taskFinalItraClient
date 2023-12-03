import React, { useEffect, useState } from 'react'
import { useAddCollectionMutation, usePostCollectionPhotoMutation } from '@/store/api/collections.api';
import CollectionFields from './CollectionFields';
import MyCropper from './MyCropper';
import { dataUrlToFile } from '@/utils/cropUtils';
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { useActions } from '@/hooks/useActions';
import { IModalInfo } from '@/types/modalInfo.interface';
import Modal from '@/pages/modal/Modal';
import { Link, Navigate } from 'react-router-dom';
import { ICollectionFields } from '@/types/collectionFields.interface';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { variables } from '@/variables';
import './AddCollection.scss'


function AddCollection() {
    const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);
    const { user } = useSelector((state: RootState) => state.user);
    const { language } = useSelector((state: RootState) => state.options);
    const [fields, setFields] = useState<ICollectionFields[]>([]);
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const { setToastChildren } = useActions();
    
    if (!user) {
        return <Navigate to={'/'} />;
    }

    const [addCollection, { isLoading, isSuccess, isError, error, data }] = useAddCollectionMutation();
    const [postCollectionImg, { isLoading: isLoadingImg, isSuccess: isSuccessImg, isError: isErrorImg, error: errorImg, data: dataImg }] = usePostCollectionPhotoMutation();

    useEffect(() => {
        if (isSuccessImg) {
            let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
            let inputTheme = (document.getElementById('inputTheme') as HTMLInputElement).value;
            let inputDesc = (document.getElementById('inputDesc') as HTMLInputElement).value;

            addCollection({
                        id: undefined,
                        title: inputName,
                        description: inputDesc !== '' ? inputDesc : undefined,
                        theme: inputTheme,
                        photoPath: dataImg || 'default.jpg',
                        creationDate: new Date(),
                        items: [],
                        collectionFields: fields
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
            }
            else {
                setToastChildren(variables.LANGUAGES[language].COLLECTION_ADDED);
                myToast.show();
            }
        }
        if (isError) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('addCollectionModal') || 'addCollectionModal');
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].ERROR_ADDING_COLLECTION})
            myModal.show();
        }
    }, [isLoading])

    const addCollectionClick = async () => {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputTheme = (document.getElementById('inputTheme') as HTMLInputElement).value;
        let inputDesc = (document.getElementById('inputDesc') as HTMLInputElement).value;
        if (inputName === '' || inputTheme === '' || fields.some(field => field.fieldName.trim() === '')) {
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
            addCollection({
                id: undefined,
                title: inputName,
                description: inputDesc !== '' ? inputDesc : undefined,
                theme: inputTheme,
                photoPath: dataImg || 'default.jpg',
                creationDate: new Date(),
                items: [],
                collectionFields: fields
            })
        }
    }

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={'/cabinet'} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    {variables.LANGUAGES[language].RETURN_TO_THE_CABINET}
                </Link>
                <h2 className="text-center p-3">
                    {variables.LANGUAGES[language].ADD_NEW_COLLECTION}
                </h2>
                <div className="d-flex align-self-center flex-column w-50 mb-4 addCollection_wrapper">
                    <span className='fs-5'>
                        {variables.LANGUAGES[language].COLLECTION_PHOTO}
                    </span>
                    <MyCropper croppedImage={croppedImage} setCroppedImage={setCroppedImage} />
                    {croppedImage && <img className='img-fluid border rounded-2 mb-1' src={croppedImage} alt="blab" />}
                    <label className="mb-1 fs-5" htmlFor="inputName">{variables.LANGUAGES[language].COLLECTION_NAME}</label>
                    <input className="form-control fs-6 mb-3" id="inputName" placeholder={variables.LANGUAGES[language].ENTER_COLLECTION_NAME} />
                    <label className="mb-1 fs-5" htmlFor="inputTheme">{variables.LANGUAGES[language].COLLECTION_THEME}</label>
                    <input className="form-control fs-6 mb-3" id="inputTheme" placeholder={variables.LANGUAGES[language].ENTER_COLLECTION_THEME} />
                    <label className="mb-1 fs-5" htmlFor="inputDesc">{variables.LANGUAGES[language].COLLECTION_DESCRIPTION}</label>
                    <textarea rows={4} className="form-control fs-6 mb-3" id="inputDesc" placeholder={variables.LANGUAGES[language].ENTER_COLLECTION_DESCRIPTION} />
                    <span className='fs-5 mb-1'>
                        {variables.LANGUAGES[language].ADD_COLLECTION_FIELDS}
                    </span>
                    <button className='btn btn-secondary mb-2' onClick={() => setFields([...fields, { id: undefined, fieldName: '', fieldType: 'string' }])}>
                        {variables.LANGUAGES[language].ADD_FIELD}
                    </button>
                    <CollectionFields fields={fields} setFields={setFields} />
                    <button onClick={() => addCollectionClick()} className='btn btn-primary fs-4 mt-4'>
                        {isLoadingImg || isLoading ?
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
                            </div>
                            :
                            <div>{variables.LANGUAGES[language].ADD_COLLECTION}</div>
                        }
                    </button>
                </div>
                <Modal id='addCollectionModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
        </div>
    );
}

export default AddCollection;
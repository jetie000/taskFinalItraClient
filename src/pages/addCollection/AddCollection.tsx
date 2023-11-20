import React, { useState } from 'react'
import { useAddCollectionMutation } from '../../store/api/collections.api';
import CollectionFields from './CollectionFields';
import MyCropper from './MyCropper';


function AddCollection() {
    const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);
    const [fields, setFields] = useState<{ id: number, name: string, type: string }[]>([]);

    const [addCollection, { isLoading, isSuccess, isError, error, data }] = useAddCollectionMutation();

    const addCollectionClick = () => {
        
    }

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex cabinet-wrapper ms-auto me-auto">
                <div className="d-flex flex-column flex-fill">
                    <h2 className="text-center p-3">
                        Создание новой коллекции
                    </h2>
                    <div className="d-flex align-self-center flex-column w-50 mb-4">
                        <span className='fs-5'>
                            Фото коллекции
                        </span>
                        <MyCropper croppedImage={croppedImage} setCroppedImage={setCroppedImage}/>
                        {croppedImage && <img className='img-fluid border rounded-2 mb-1' src={croppedImage} alt="blab" />}
                        <label className="mb-1 fs-5" htmlFor="inputName">Название коллекции</label>
                        <input className="form-control fs-6 mb-3" id="inputName" placeholder="Введите название коллекции" />
                        <label className="mb-1 fs-5" htmlFor="inputTheme">Тема коллекции</label>
                        <input className="form-control fs-6 mb-3" id="inputTheme" placeholder="Введите тему коллекции" />
                        <label className="mb-1 fs-5" htmlFor="inputDesc">Описание (по желанию)</label>
                        <textarea className="form-control fs-6 mb-3" id="inputDesc" placeholder="Введите описание коллекции" />
                        <span className='fs-5 mb-1'>
                            Добавьте поля коллекции
                        </span>
                        <button className='btn btn-secondary mb-2' onClick={() => setFields([...fields, { id: fields.length, name: '', type: 'string' }])}>
                            Добавить поле
                        </button>
                        <CollectionFields fields={fields} setFields={setFields} />
                        <button onClick={() => addCollectionClick()} className='btn btn-primary fs-4 mt-4'>Создать колллекцию</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCollection;
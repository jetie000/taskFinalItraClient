import React, { ChangeEvent, SelectHTMLAttributes, SyntheticEvent, useState } from 'react'
import { variables } from '../../variables';
import { Toast as bootstrapToast } from 'bootstrap'
import { useActions } from '../../hooks/useActions';
import Cropper, { Area } from "react-easy-crop";
import { cropImage } from "./cropUtils";


function AddCollection() {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | undefined>(undefined);
    const [imageSrc, setImageSrc] = useState<string>();
    const [croppedImage, setCroppedImage] = useState<string | undefined>(undefined);

    const { setToastChildren } = useActions();

    const [fields, setFields] = useState<{ id: number, name: string, type: string }[]>([]);

    const changeFieldType = (event: SyntheticEvent<HTMLSelectElement, Event>, id: number) => {
        setFields(fields.map(field => {
            if (field.id === id)
                field.type = event.currentTarget.value;
            return field;
        }));
    }
    const changeFieldName = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        setFields(fields.map(field => {
            if (field.id === id)
                field.name = event.currentTarget.value;
            return field;
        }));
    }

    function readFile(file: File) {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    }

    const writeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setCroppedImage(undefined);
        if (!e.target.files?.length) return;
        if (e.target.files[0].size >= variables.MAX_COLLECTION_PHOTO_SIZE) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            e.target.value = '';
            setToastChildren('Максимальный размер фото - 5 МБ');
            myToast.show();
            return;
        }
        let imageDataUrl = (await readFile(e.target.files[0])) as string;
        setImageSrc(imageDataUrl);
    }

    const setCroppedImgFunc = async () => {
        if (imageSrc) {
            const croppedImageResponse = await cropImage(imageSrc, croppedAreaPixels, console.log);
            setCroppedImage(croppedImageResponse)
        }
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
                        <input onChange={(e) => writeFile(e)} type="file" className="form-control mb-3" id="inputFile" />
                        {imageSrc && !croppedImage &&
                            <>
                                <div className='img-fluid border rounded-2 mb-1 position-relative' style={{ height: '400px' }}>
                                    <Cropper
                                        image={imageSrc}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={variables.ASPECT_COLLECTIONS_IMG}
                                        onCropChange={setCrop}
                                        onCropComplete={(_, croppedAreaPixels) => {
                                            setCroppedAreaPixels(croppedAreaPixels);
                                        }}
                                        onZoomChange={setZoom}
                                    />
                                </div>
                                <button onClick={() => setCroppedImgFunc()} className='btn btn-secondary mb-3'>Обрезать</button>
                            </>
                        }
                        {croppedImage && <img className='img-fluid border rounded-2 mb-1' src={croppedImage} alt="blab" />}
                        {/* <img className='img-fluid border rounded-2 mb-1' id='outputImg' src="" alt="Upload Image" /> */}
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
                        {fields.length > 0 && fields.map(field =>
                            <div key={field.id} className="input-group mb-1">
                                <select onSelect={(event) => changeFieldType(event, field.id)} className="form-select" id={'fieldSelect' + field.id}>
                                    <option selected value='string'>Строка</option>
                                    <option value="number">Число</option>
                                    <option value="Date">Дата</option>
                                    <option value="boolean">Да/Нет</option>
                                </select>
                                <input onChange={event => changeFieldName(event, field.id)} id={'fieldInput' + field.id} type="text" className="form-control" />
                            </div>)}
                        <button className='btn btn-primary fs-4 mt-4'>Создать колллекцию</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCollection;
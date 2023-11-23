import React, { ChangeEvent, SyntheticEvent } from "react";
import { ICollectionFields } from "../../types/collectionFields.interface";


function CollectionFields({ fields, setFields }: { fields: ICollectionFields[], setFields: Function }) {
    
    const changeFieldType = (event: SyntheticEvent<HTMLSelectElement, Event>, id: number) => {
        setFields(fields.map(field => {
            if (field.id === id)
                field.fieldType = event.currentTarget.value as ('string' | 'boolean' | 'Date' | 'number');
            return field;
        }));
    }
    const changeFieldName = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        setFields(fields.map(field => {
            if (field.id === id)
                field.fieldName = event.currentTarget.value;
            return field;
        }));
    }
    const deleteField = (id: number) => {
        setFields(fields.filter(field => field.id !== id));
    }
    return (
        <>
            {fields.length > 0 && fields.map(field =>
                <div key={field.id} className="input-group mb-1">
                    <select onChange={(event) => changeFieldType(event, field.id || 0)} className="form-select" id={'fieldSelect' + field.id} defaultValue='string'>
                        <option value='string'>Строка</option>
                        <option value="number">Число</option>
                        <option value="Date">Дата</option>
                        <option value="boolean">Да/Нет</option>
                    </select>
                    <input onChange={event => changeFieldName(event, field.id || 0)} id={'fieldInput' + field.id} type="text" className="form-control w-25" placeholder='Введите название поля' />
                    <button className='btn btn-danger d-flex align-items-center' onClick={() => deleteField(field.id || 0)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                        </svg>
                    </button>
                </div>)
            }
        </>
    );
}

export default CollectionFields;
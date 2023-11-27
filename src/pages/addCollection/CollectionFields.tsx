import React, { ChangeEvent, SyntheticEvent } from "react";
import { ICollectionFields } from "../../types/collectionFields.interface";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { variables } from "../../variables";


function CollectionFields({ fields, setFields }: { fields: ICollectionFields[], setFields: Function }) {
    const { language } = useSelector((state: RootState) => state.options);
    
    const changeFieldType = (event: SyntheticEvent<HTMLSelectElement, Event>, id: number) => {
        setFields(fields.map((field, index) => {
            if (index === id)
                field.fieldType = event.currentTarget.value as ('string' | 'boolean' | 'Date' | 'number');
            return field;
        }));
    }
    const changeFieldName = (event: ChangeEvent<HTMLInputElement>, id: number) => {
        setFields(fields.map((field, index) => {
            if (index === id)
                field.fieldName = event.currentTarget.value;
            return field;
        }));
    }
    const deleteField = (id: number) => {
        setFields(fields.filter((field, index) => index !== id));
    }
    return (
        <>
            {fields.length > 0 && fields.map((field, index) =>
                <div key={index} className="input-group mb-1">
                    <select onChange={(event) => changeFieldType(event, index || 0)} className="form-select" id={'fieldSelect' + index} defaultValue='string'>
                        <option value='string'>{variables.LANGUAGES[language].STRING}</option>
                        <option value="number">{variables.LANGUAGES[language].NUMBER}</option>
                        <option value="Date">{variables.LANGUAGES[language].DATE}</option>
                        <option value="boolean">{variables.LANGUAGES[language].BOOLEAN}</option>
                    </select>
                    <input onChange={event => changeFieldName(event, index || 0)} id={'fieldInput' + index} type="text" className="form-control w-25" placeholder={variables.LANGUAGES[language].ENTER_FIELD_NAME} />
                    <button className='btn btn-danger d-flex align-items-center' onClick={() => deleteField(index || 0)}>
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
import React from 'react'
import { IItemFields } from '@/types/itemFields.interface'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { variables } from '@/variables';
function ItemInfoFields({ itemFields }: { itemFields: IItemFields[] }) {
    const { language } = useSelector((state: RootState) => state.options);
    return (
        <div className="d-flex flex-wrap border rounded-4 mt-3 p-2">
            {
                itemFields.map(field =>
                    <div key={field.id} className="w-50 fs-4 p-2">
                        {field.fieldName}:{' '}
                        {field.stringFieldValue
                            || field.doubleFieldValue
                            || (field.dateFieldValue && new Date(field.dateFieldValue).toLocaleString())
                            || (field.boolFieldValue ? variables.LANGUAGES[language].YES : variables.LANGUAGES[language].NO)
                        }
                    </div>)
            }
        </div>

    );
}

export default ItemInfoFields;
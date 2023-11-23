import React from 'react'
import { IItemFields } from '../../types/itemFields.interface'
function ItemInfoFields({ itemFields }: { itemFields: IItemFields[] }) {
    return (
        <div className="d-flex flex-wrap border rounded-4 mt-3 mb-3 p-2">
            {
                itemFields.map(field =>
                    <div key={field.id} className="w-50 fs-4 p-2">
                        {field.fieldName}:{' '}
                        {field.stringFieldValue
                            || field.doubleFieldValue
                            || (field.dateFieldValue && new Date(field.dateFieldValue).toLocaleString())
                            || (field.boolFieldValue ? 'Да' : 'Нет')
                        }
                    </div>)
            }
        </div>

    );
}

export default ItemInfoFields;
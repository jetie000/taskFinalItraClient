import React from 'react'
import { ITag } from '@/types/tag.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { variables } from '@/variables';
function ItemInfoTags({ tags }: { tags: ITag[] }) {
    const { language } = useSelector((state: RootState) => state.options);
    return (
        <div className='border rounded-4 p-3 mt-3'>
            <h4>{variables.LANGUAGES[language].TAGS}</h4>
            <div className="d-flex gap-2 flex-wrap">
                {
                    tags.map(tag =>
                        <button key={tag.id} className='flex-grow-0 btn btn-info border rounded-4 p-0 ps-2 pe-2 text-truncate'>
                            {tag.tag}
                        </button>)
                }
            </div>
        </div>
    );
}

export default ItemInfoTags;
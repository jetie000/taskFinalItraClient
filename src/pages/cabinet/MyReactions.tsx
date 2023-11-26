import React from 'react'
import { useGetReactionItemsQuery } from '../../store/api/items.api';
import { useNavigate } from 'react-router-dom';
import ItemsList from './ItemsList';
function MyReactions() {

    const { data } = useGetReactionItemsQuery(undefined)

    return (
        <div className='p-5 pt-2 pb-0 overflow-x-hidden flex-fill '>
            <h2 className='text-center mb-3'>Мои реакции</h2>
            {
                typeof (data) !== 'string' && data && data.length > 0 ?
                    <ItemsList data={data} />
                    :
                    <div className="fs-3 mt-2 text-center">Вы еще не оставляли реакций</div>
            }
        </div>
    );
}

export default MyReactions;
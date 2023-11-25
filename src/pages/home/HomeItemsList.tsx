import React from 'react'
import { IItem } from '../../types/item.interface';
import { useNavigate } from 'react-router-dom';
import { IItemInfo } from '../../types/itemInfo.interface';

function HomeItemsList({ data, setItemsLimit, itemsLimit }: { data: IItemInfo[], setItemsLimit: Function, itemsLimit: number }) {
    const navigate = useNavigate();

    return (
        <ul className="list-group rounded-4 mt-2 collection-wrapper overflow-y-auto">
            {
                data.map(itemInfo =>
                    <li key={itemInfo.item.id}
                        onClick={() => navigate('/item/' + itemInfo.item.id)}
                        className="list-group-item cursor-pointer">
                        <div className='mb-2 fs-4 d-flex gap-3 align-items-start'>
                            <span>{itemInfo.item.name}</span>
                            <div className="vr"></div>
                            <div className="d-flex gap-2 flex-wrap align-self-center overflow-hidden">
                                {itemInfo.item.tags?.length ? itemInfo.item.tags?.map(tag =>
                                    <div key={tag.id}
                                        className="flex-grow-0 btn btn-info border rounded-4 p-0 ps-2 pe-2 text-truncate">
                                        {tag.tag}
                                    </div>)
                                    :
                                    <span className="fs-5">Нет тегов</span>
                                }
                            </div>
                            <div className="vr ms-auto"></div>
                            <div className="d-flex align-items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-hand-thumbs-up-fill item-icon" viewBox="0 0 16 16">
                                    <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
                                </svg>
                                <span>
                                    {itemInfo.item.likes?.filter(reaction => reaction.isLike === true).length || 0}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-hand-thumbs-down-fill item-icon" viewBox="0 0 16 16">
                                    <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" />
                                </svg>
                                <span>
                                    {itemInfo.item.likes?.filter(reaction => reaction.isLike === false).length || 0}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chat-fill item-icon" viewBox="0 0 16 16">
                                    <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15" />
                                </svg>
                                <span>
                                    {itemInfo.item.comments?.length || 0}
                                </span>
                            </div>
                        </div>
                        <div className='fs-5 d-flex gap-3'>
                            <span className='text-truncate'>{'Коллекция: '}{itemInfo.item.myCollection?.title}</span>
                            <div className="vr ms-auto"></div>
                            <span className='text-truncate flex-shrink-0'>{'Создатель: '}{itemInfo.item.myCollection?.user?.fullName}</span>
                        </div>
                    </li>
                )
            }

            <li className='list-group-item btn btn-outline-primary fs-4 d-flex justify-content-center' onClick={() => setItemsLimit(itemsLimit + 5)}>
                Показать еще
            </li>
        </ul>
    );
}

export default HomeItemsList;
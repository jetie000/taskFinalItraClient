import React, { useState } from "react";
import './Home.scss'
import { useGetLastTagsQuery, useGetTagsQuery } from "../../store/api/tags.api";
import { useGetLargestCollectionsQuery } from "../../store/api/collections.api";
import { useGetLastItemsQuery } from "../../store/api/items.api";
import { variables } from "../../variables";
import { useNavigate } from "react-router-dom";
import ItemsList from "../cabinet/ItemsList";
import HomeItemsList from "./HomeItemsList";
function Home() {

    const navigate = useNavigate();
    const [collectionsLimit, setCollectionLimit] = useState(5);
    const [itemsLimit, setItemLimit] = useState(5);
    const [tagsLimit, setTagsLimit] = useState(20);
    const { isLoading: isLoadingCollections, data: dataCollections } = useGetLargestCollectionsQuery(collectionsLimit)
    const { isLoading: isLoadingItems, data: dataItems } = useGetLastItemsQuery(itemsLimit)
    const { isLoading: isLoadingTags, data: dataTagsLast } = useGetLastTagsQuery(tagsLimit)

    return (
        <div className="d-flex p-3">
            <div className="d-flex main-wrapper m-auto">
                <div className="d-flex w-75 flex-column">
                    <h2 className="p-2 text-center">Самые большие коллекции</h2>
                    {isLoadingCollections ?
                        <div className="d-flex p-3">
                            <div className="spinner-border m-auto" role="status">
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                        </div> :
                        (dataCollections && typeof (dataCollections) !== 'string' && dataCollections?.length > 0 ?
                            <div className="overflow-y-auto collection-wrapper flex-fill">
                                {
                                    dataCollections?.map(collection =>
                                        <div onClick={() => navigate('/collection/' + collection.id)} className='m-2 border rounded-4 collection-item d-flex cursor-pointer' key={collection.id}>
                                            <img className='rounded-start-4 img-fluid' src={variables.PHOTOS_URL + collection.photoPath} alt="CollectionImg" />
                                            <div className='d-flex flex-column p-4 ps-5 fs-5 justify-content-around flex-fill w-25'>
                                                <span className='fs-1 text-truncate'>{collection.title}</span>
                                                <div className='d-flex gap-2'>
                                                    <div className='d-flex flex-column'>
                                                        <span className='fs-3 fw-light'>Категория: </span>
                                                        <span>Предметов: </span>
                                                        <span>Полей: </span>
                                                        <span>Создано: </span>
                                                    </div>
                                                    <div className='d-flex flex-column'>
                                                        <span className='fs-3 fw-light text-truncate'>{collection.theme}</span>
                                                        <span>{collection.items?.length || 0}</span>
                                                        <span>{collection.collectionFields?.length || 0}</span>
                                                        <span>{new Date(collection.creationDate).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>)
                                }
                                <div className='btn btn-outline-primary m-2 fs-4 border rounded-4 d-flex justify-content-center' onClick={() => setCollectionLimit(collectionsLimit + 5)}>
                                    Показать еще
                                </div>
                            </div>
                            : <div>Коллекции не найдены</div>)
                    }

                    <h2 className="p-2 mt-4 text-center">Последние добавленные предметы</h2>
                    {
                        isLoadingItems ?
                            <div className="d-flex p-3">
                                <div className="spinner-border m-auto" role="status">
                                    <span className="visually-hidden">Загрузка...</span>
                                </div>
                            </div> : (
                                dataItems && typeof (dataItems) !== 'string' && dataItems.length > 0 ?
                                    <HomeItemsList data={dataItems} setItemsLimit={setItemLimit} itemsLimit={itemsLimit} />
                                    : <div className="fs-4">Предметы не найдены</div>)
                    }
                </div>
                <div className="p-3 pt-2 w-25">
                    <h4 className="text-center mb-4">Недавние теги</h4>
                    <div className="d-flex gap-2 flex-wrap align-self-center overflow-hidden">
                        {dataTagsLast && typeof (dataTagsLast) !== 'string' ?
                            <>{dataTagsLast.map(tag =>
                                <div key={tag.id}
                                    className="flex-grow-0 btn btn-info border rounded-4 p-0 ps-2 pe-2 text-truncate">
                                    {tag.tag}
                                </div>)}
                                <div className='btn btn-outline-primary m-2 fs-6 border rounded-4 d-flex justify-content-center w-100' onClick={() => setTagsLimit(tagsLimit + 10)}>
                                    Показать еще
                                </div>
                            </>
                            : (isLoadingTags ?
                                <div className="d-flex p-3">
                                    <div className="spinner-border m-auto" role="status">
                                        <span className="visually-hidden">Загрузка...</span>
                                    </div>
                                </div>
                                :
                                <span className="fs-5">Нет тегов</span>)

                        }
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Home;
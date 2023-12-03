import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { variables } from "@/variables";
import { RootState } from "@/store/store";
import { useGetLargestCollectionsQuery } from "@/store/api/collections.api";
import { useGetLastItemsQuery } from "@/store/api/items.api";
import { useGetLastTagsQuery } from "@/store/api/tags.api";
import HomeItemsList from "./HomeItemsList";

function Home() {

    const navigate = useNavigate();
    const { language } = useSelector((state: RootState) => state.options);
    const [collectionsLimit, setCollectionLimit] = useState(5);
    const [itemsLimit, setItemLimit] = useState(5);
    const [tagsLimit, setTagsLimit] = useState(20);
    const { isLoading: isLoadingCollections, data: dataCollections } = useGetLargestCollectionsQuery(collectionsLimit)
    const { isLoading: isLoadingItems, data: dataItems } = useGetLastItemsQuery(itemsLimit)
    const { isLoading: isLoadingTags, data: dataTagsLast } = useGetLastTagsQuery(tagsLimit)

    return (
        <div className="d-flex p-3">
            <div className="d-flex main-wrapper m-auto home-wrapper">
                <div className="d-flex w-75 flex-column">
                    <h2 className="p-2 text-center">{variables.LANGUAGES[language].BIGGEST_COLLECTIONS}</h2>
                    {isLoadingCollections ?
                        <div className="d-flex p-3">
                            <div className="spinner-border m-auto" role="status">
                                <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
                            </div>
                        </div> :
                        (dataCollections && typeof (dataCollections) !== 'string' && dataCollections?.length > 0 ?
                            <div className="flex-fill">
                                {
                                    dataCollections?.map(collection =>
                                        <div onClick={() => navigate('/collection/' + collection.id)} className='m-2 border rounded-4 collection-item d-flex cursor-pointer' key={collection.id}>
                                            <img className='rounded-start-4 img-fluid' src={variables.PHOTOS_URL + collection.photoPath} alt="CollectionImg" />
                                            <div className='d-flex flex-column p-4 ps-5 fs-5 justify-content-around flex-fill w-25'>
                                                <span className='fs-1 text-truncate'>{collection.title}</span>
                                                <div className='d-flex gap-2'>
                                                    <div className='d-flex flex-column'>
                                                        <span className='fs-3 fw-light'>{variables.LANGUAGES[language].CATEGORY} </span>
                                                        <span>{variables.LANGUAGES[language].ITEMS}</span>
                                                        <span>{variables.LANGUAGES[language].FIELDS} </span>
                                                        <span>{variables.LANGUAGES[language].CREATED} </span>
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
                                    {variables.LANGUAGES[language].SHOW_MORE}
                                </div>
                            </div>
                            : <div>{variables.LANGUAGES[language].COLLECTIONS_NOT_FOUND}</div>)
                    }

                    <h2 className="p-2 mt-4 text-center">{variables.LANGUAGES[language].LAST_ITEMS}</h2>
                    {
                        isLoadingItems ?
                            <div className="d-flex p-3">
                                <div className="spinner-border m-auto" role="status">
                                    <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
                                </div>
                            </div> : (
                                dataItems && typeof (dataItems) !== 'string' && dataItems.length > 0 ?
                                    <HomeItemsList data={dataItems} setItemsLimit={setItemLimit} itemsLimit={itemsLimit} />
                                    : <div className="fs-4">{variables.LANGUAGES[language].ITEMS_NOT_FOUND}</div>)
                    }
                </div>
                <div className="p-3 pt-2 w-25">
                    <h4 className="text-center mb-4">{variables.LANGUAGES[language].RECENT_TAGS}</h4>
                    <div className="d-flex gap-2 flex-wrap align-self-center overflow-hidden">
                        {dataTagsLast && typeof (dataTagsLast) !== 'string' ?
                            <>{dataTagsLast.map(tag =>
                                <div key={tag.id}
                                    className="flex-grow-0 btn btn-info border rounded-4 p-0 ps-2 pe-2 text-truncate">
                                    {tag.tag}
                                </div>)}
                                <div className='btn btn-outline-primary m-2 fs-6 border rounded-4 d-flex justify-content-center w-100' onClick={() => setTagsLimit(tagsLimit + 10)}>
                                    {variables.LANGUAGES[language].SHOW_MORE}
                                </div>
                            </>
                            : (isLoadingTags ?
                                <div className="d-flex p-3">
                                    <div className="spinner-border m-auto" role="status">
                                        <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
                                    </div>
                                </div>
                                :
                                <span className="fs-5">{variables.LANGUAGES[language].NO_TAGS}</span>)

                        }
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Home;
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toast as bootstrapToast } from 'bootstrap';
import { useGetCollectionQuery, useGetMyCollectionsQuery } from "@/store/api/collections.api";
import { useActions } from "@/hooks/useActions";
import CollectionInfo from "./CollectionInfo";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ICollection } from "@/types/collection.interface";
import CollectionItems from "./CollectionItems";
import { variables } from "@/variables";
function Collection() {
    let { id } = useParams();
    const { user } = useSelector((state: RootState) => state.user);
    const { isLoading, isSuccess, isError, error, data } = useGetCollectionQuery(Number(id))
    const { setToastChildren, setCollections } = useActions();
    const { language } = useSelector((state: RootState) => state.options);
    const navigate = useNavigate();
    const { isLoading: isLoadingMy, isSuccess: isSuccessMy, isError: isErrorMy, error: errorMy, data: dataMy } = useGetMyCollectionsQuery(user?.accessToken || '')

    useEffect(() => {
        if (isError || data === 'No collection found.') {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].COLLECTION_NOT_FOUND);
            myToast.show();
        }
    }, [isLoading])

    useEffect(() => {
        if (isSuccessMy) {
            if (dataMy === 'No user found.') {
                if (user) {
                    const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
                    setToastChildren(variables.LANGUAGES[language].ERROR_LOAD_COLLECTIONS);
                    myToast.show();
                }
            }
            else
                setCollections(dataMy as ICollection[]);
        }
        if (isErrorMy) {
            if (user) {
                const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
                setToastChildren(variables.LANGUAGES[language].ERROR_LOAD_COLLECTIONS);
                myToast.show();
            }
        }
    }, [isLoadingMy])

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={'/'} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    {variables.LANGUAGES[language].RETURN_TO_MAIN}
                </Link>
                {
                    data && typeof (data) != 'string' && data.collection ?
                        <div className="collection_collection d-flex flex-column">
                            <CollectionInfo data={data} />
                            <CollectionItems data={data} />
                        </div>
                        : (isLoading ?
                            <div className="spinner-border m-auto" role="status">
                                <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
                            </div>
                            : <span className="fs-2 m-auto">{variables.LANGUAGES[language].COLLECTION_NOT_FOUND}</span>)
                }
            </div>
        </div>
    );
}

export default Collection;
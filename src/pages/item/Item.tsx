import React, { useEffect, useState } from 'react'
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { Link, useParams } from 'react-router-dom';
import { useGetItemQuery } from '@/store/api/items.api';
import { Toast as bootstrapToast } from 'bootstrap';
import ItemInfo from './ItemInfo';
import { useActions } from '@/hooks/useActions';
import { baseApi } from '@/store/api/baseApi';
import { useDispatch, useSelector } from 'react-redux';
import { variables } from '@/variables';
import { RootState } from '@/store/store';
import './Item.scss'

function Item() {
    let { id, idItem } = useParams();
    const { language } = useSelector((state: RootState) => state.options);
    const { isLoading, isSuccess, isError, error, data } = useGetItemQuery(Number(idItem))
    const { setToastChildren } = useActions();
    const dispatch = useDispatch();
    const [connection, setConnection] = useState<HubConnection>();


    const joinRoom = async () => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl(variables.SOCKET_URL, {
                    skipNegotiation: true,
                    transport: HttpTransportType.WebSockets
                }
                )
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            connection.on("AddMessage", (message) => {
                dispatch(baseApi.util.invalidateTags(['Item']))
            });
            await connection.start();
            await connection.invoke("JoinRoom", idItem);
            setConnection(connection);
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        joinRoom();
    }, [])

    useEffect(() => {
        if (isError || data === 'No collection found.') {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].COLLECTION_NOT_FOUND);
            myToast.show();
        }
    }, [isLoading])
    
    return ( 
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex flex-column main-wrapper ms-auto me-auto">
                <Link to={id ? '/collection/'+id : '/'} className="btn btn-outline-primary align-items-center align-self-start d-flex mt-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                    </svg>
                    {id ? variables.LANGUAGES[language].RETURN_TO_COLLECTION 
                    : variables.LANGUAGES[language].RETURN_TO_MAIN}
                </Link>
                {
                    data && typeof (data) != 'string' && data.item ?
                        <div className="d-flex flex-column item_item">
                            <ItemInfo data={data} connection={connection}/>
                        </div>
                        : (isLoading ?
                            <div className="spinner-border m-auto" role="status">
                                <span className="visually-hidden">{variables.LANGUAGES[language].LOADING}</span>
                            </div>
                            : <span className="fs-2 m-auto">{variables.LANGUAGES[language].ITEM_NOT_FOUND}</span>)
                }
            </div>
        </div>
     );
}

export default Item;
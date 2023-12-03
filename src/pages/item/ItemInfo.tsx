import React, { useEffect, useState } from 'react'
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap';
import { IModalInfo } from '@/types/modalInfo.interface';
import Modal from '@/pages/modal/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { variables } from '@/variables';
import { useActions } from '@/hooks/useActions';
import { useNavigate, useParams } from 'react-router-dom';
import { IItemInfo } from '@/types/itemInfo.interface';
import { useDeleteMyItemMutation } from '@/store/api/items.api';
import ItemInfoFields from './ItemInfoFields';
import ItemInfoTags from './ItemInfoTags';
import ItemComments from './ItemComments';
import { useSetReactionMutation } from '@/store/api/reaction.api';
import { HubConnection } from '@microsoft/signalr';

function ItemInfo({ data, connection }: { data: IItemInfo, connection: HubConnection | undefined }) {
    let { id } = useParams();
    const { language } = useSelector((state: RootState) => state.options);
    const { user } = useSelector((state: RootState) => state.user);
    const { setToastChildren } = useActions();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [deleteItem, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete, data: dataDelete }] = useDeleteMyItemMutation();
    const [setReaction, { isLoading: isLoadingSet, isSuccess: isSuccessSet, isError: isErrorSet, error: errorSet, data: dataSet }] = useSetReactionMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccessDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            switch (dataDelete) {
                case 'No user found.':
                    setToastChildren(variables.LANGUAGES[language].USER_NOT_FOUND); break;
                case 'No item found.':
                    setToastChildren(variables.LANGUAGES[language].ITEM_NOT_FOUND); break;
                case 'No access to item.':
                    setToastChildren(variables.LANGUAGES[language].NO_ACCESS_ITEM); break;
                case 'Item deleted.':
                    setToastChildren(variables.LANGUAGES[language].ITEM_DELETED); break;
            }
            myToast.show();
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_DELETING_ITEM);
            myToast.show();
        }
    }, [isLoadingDelete])

    useEffect(() => {
        if (isSuccessSet) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            switch (dataSet) {
                case 'No user found.':
                    setToastChildren(variables.LANGUAGES[language].USER_NOT_FOUND);
                    myToast.show(); break;
                case 'No item found.':
                    setToastChildren(variables.LANGUAGES[language].ITEM_NOT_FOUND);
                    myToast.show(); break;
                default: invokeMessage();
            }

        }
        if (isErrorSet) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].ERROR_DELETING_ITEM);
            myToast.show();
        }
    }, [isLoadingSet])

    const invokeMessage = async () => {
        await connection?.invoke('SendMessage', data.item.id.toString())
    }

    const deleteItemClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('itemModal') || 'itemModal');
        const children = data && typeof (data) !== 'string'
            ?
            <div className='d-flex flex-column gap-3'>
                <span>{variables.LANGUAGES[language].SURE_DELETE_ITEM}</span>
                <button onClick={() => {
                    deleteItem(data.item.id!);
                    myModal.hide()
                }} className='btn btn-danger'>
                    {variables.LANGUAGES[language].DELETE_ITEM}
                </button>
            </div >
            : <div>{variables.LANGUAGES[language].ITEM_NOT_FOUND}</div>;
        setModalInfo({ title: variables.LANGUAGES[language].DELETING_ITEM, children: children });
        myModal.show();
    }

    const setReactionClick = (isLike: boolean) => {
        if(!user){
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren(variables.LANGUAGES[language].LOG_TO_REACT);
            myToast.show(); 
            return;
        }
        setReaction({
            reaction: {
                id: 0,
                userId: user!.id,
                isLike: isLike,
                creationDate: new Date()
            },
            itemId: data.item.id
        })
    }

    return (
        <>
            <div className="d-flex">
                <img className="w-50 rounded-4" src={variables.PHOTOS_URL + data.item.myCollection?.photoPath} alt="collection img" />
                <div className=" w-50 d-flex flex-column ps-5 justify-content-around flex-fill">
                    <span className="fs-1 align-self-center">{variables.LANGUAGES[language].ITEM}</span>
                    <hr />
                    <span className='fs-1 text-truncate'>{data.item.name}</span>
                    <hr />
                    <div className='d-flex gap-2 fs-2'>
                        <div className='flex-shrink-0 d-flex flex-column'>
                            <span className='fw-light'>{variables.LANGUAGES[language].CREATED} </span>
                            <span>{variables.LANGUAGES[language].COLLECTION}: </span>
                        </div>
                        <div className='d-flex flex-column overflow-hidden'>
                            <span className='fw-light'>{new Date(data.item.creationDate).toLocaleString()}</span>
                            <span className='flex-grow-0 text-truncate'>
                                {data.item.myCollection?.title}
                            </span>
                        </div>
                    </div>
                    {!id &&
                        <button onClick={() => navigate('/collection/' + data.collectionId)} className='btn btn-primary fs-5'>{variables.LANGUAGES[language].GO_TO}</button>
                    }
                    <hr />
                    <div className="d-flex gap-2 justify-content-center">
                        <button onClick={() => setReactionClick(true)}
                            className={'btn fs-5 ' + (data.item.likes?.some(like =>
                                like.isLike === true && like.userId == user?.id) ? 'btn-primary' : 'btn-secondary')}>
                            {variables.LANGUAGES[language].LIKE} {' '}
                            {data.item.likes?.filter(like => like.isLike === true).length || 0}
                        </button>
                        <button onClick={() => setReactionClick(false)} className={'btn fs-5 ' + (data.item.likes?.some(like =>
                            like.isLike === false && like.userId == user?.id) ? 'btn-primary' : 'btn-secondary')}>
                            {variables.LANGUAGES[language].DISLIKE} {' '}
                            {data.item.likes?.filter(like => like.isLike === false).length || 0}
                        </button>
                    </div>
                </div>
            </div>
            {
                user && (user.id === data.userId || user.role == 1) &&
                <div className="d-flex gap-3 mt-3 item-info-buttons">
                    <button onClick={() => navigate('/collection/' + data.collectionId + '/item/' + data.item.id + '/change')} className="btn btn-primary fs-4 w-50">
                        {variables.LANGUAGES[language].CHANGE_ITEM}
                    </button>
                    <button onClick={() => deleteItemClick()} className="btn btn-danger fs-4 w-50">
                        {variables.LANGUAGES[language].DELETE_ITEM}
                    </button>
                </div>
            }
            {
                data.item.fields && data.item.fields.length > 0 &&
                <ItemInfoFields itemFields={data.item.fields} />
            }
            {
                data.item.tags && data.item.tags.length > 0 &&
                <ItemInfoTags tags={data.item.tags} />
            }
            <ItemComments idItem={data.item.id} comments={data.item.comments || []} conn={connection}/>
            <Modal id={"itemModal"} title={modalInfo.title}>
                {modalInfo.children}
            </Modal>
        </>
    );
}

export default ItemInfo;
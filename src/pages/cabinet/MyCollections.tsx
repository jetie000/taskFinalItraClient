import React from 'react'
import { useActions } from '../../hooks/useActions';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
function MyCollections() {
    const { setUser, setToastChildren } = useActions();
    const { user } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    return (
        <div className='p-3 d-flex flex-fill'>
            <div className='ms-auto me-auto d-flex flex-column flex-fill'>
                <h2 className='text-center p-3'>
                    Мои коллекции
                </h2>
                {
                    user?.collections &&
                    user.collections.map(collection =>
                        <div>
                            {collection.id}
                        </div>
                    )
                }
                <div className='btn btn-primary pt-5 pb-5 m-2 border rounded-4' onClick={() => navigate('/addcollection')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                </div>
                {/* <Modal id='myInfoModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal> */}
            </div>
        </div>
    );
}

export default MyCollections;
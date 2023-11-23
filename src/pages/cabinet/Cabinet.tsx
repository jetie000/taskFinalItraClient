import React, { useEffect, useState } from "react";
import './Cabinet.scss'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useActions } from "../../hooks/useActions";
import MyInfo from "./MyInfo";
import MyCollections from "./MyCollections";
import MyComments from "./MyComments";
import MyReactions from "./MyReactions";
import { baseApi } from "../../store/api/baseApi";

function Cabinet() {
    const [currentPage, setCurrentPage] = useState(<MyInfo />);
    const { user } = useSelector((state: RootState) => state.user);
    const { logout } = useActions();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (!user) {
        return <Navigate to={'/'} />;
    }

    const logOutClick = () => {
        dispatch(baseApi.util.resetApiState())
        logout(); 
        navigate('/');
    }

    return (
        <div className="d-flex p-3 flex-fill">
            <div className="d-flex main-wrapper ms-auto me-auto">
                <div className="pt-3 d-flex flex-column gap-3 flex-shrink-0">
                    <Link to={'/'} className="btn btn-outline-primary align-items-center justify-content-center d-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                        </svg>
                        Вернуться на главную
                    </Link>
                    <button className="btn btn-primary mt-3" onClick={() => setCurrentPage(<MyInfo />)}>
                        Мои данные
                    </button>
                    <button className="btn btn-primary" onClick={() => setCurrentPage(<MyCollections />)}>
                        Мои коллекции
                    </button>
                    <button className="btn btn-primary" onClick={() => setCurrentPage(<MyComments />)}>
                        Мои комментарии
                    </button>
                    <button className="btn btn-primary mb-auto" onClick={() => setCurrentPage(<MyReactions />)}>
                        Мои реакции
                    </button>
                    <button className="btn btn-danger align-items-center justify-content-center d-flex" onClick={() => logOutClick()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left me-2" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                            <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                        </svg>
                        Выйти
                    </button>
                </div>
                {currentPage}
            </div>
        </div>
    );
}

export default Cabinet;
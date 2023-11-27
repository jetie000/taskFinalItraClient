import React, { useEffect, useRef, useState } from "react";
import { useChangeUserAdminMutation, useChangeUserMutation, useDeleteUserMutation, useGetAllQuery } from "../../store/api/user.api";
import { IUser } from "../../types/user.interface";
import Modal from "../modal/Modal";
import { IModalInfo } from "../../types/modalInfo.interface";
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap'
import { useActions } from "../../hooks/useActions";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import AdminMenuUsers from "./AdminMenuUsers";
import { useNavigate } from "react-router-dom";
import { variables } from "../../variables";

function AdminMenu() {
    const { data } = useGetAllQuery(undefined);
    const { user } = useSelector((state: RootState) => state.user);
    const [currentUser, setCurrentUser] = useState<IUser>();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [changeUser, { isLoading, isSuccess, isError, error, data: dataChange }] = useChangeUserAdminMutation();
    const [deleteUser, { isLoading: deleteLoading, isSuccess: deleteSuccess, isError: deleteIsError, error: deleteError, data: deleteData }] = useDeleteUserMutation();
    const { logout, setUser, setToastChildren } = useActions();
    const navigate = useNavigate();
    const { language } = useSelector((state: RootState) => state.options);

    const inputID = useRef<HTMLInputElement>(null);
    const inputName = useRef<HTMLInputElement>(null);
    const inputSurname = useRef<HTMLInputElement>(null);
    const inputEmail = useRef<HTMLInputElement>(null);
    const roleSelect = useRef<HTMLSelectElement>(null);
    const inputAccess = useRef<HTMLInputElement>(null);
    const inputPassword = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputName.current
            && inputSurname.current
            && inputEmail.current
            && roleSelect.current
            && inputAccess.current
            && inputPassword.current
            && inputID.current) {
            inputID.current.value = currentUser?.id.toString() || '';
            inputName.current.value = currentUser?.fullName.split(' ', 2)[1] || '';
            inputSurname.current.value = currentUser?.fullName.split(' ', 2)[0] || '';
            inputEmail.current.value = currentUser?.email || '';
            roleSelect.current.value = currentUser?.role.toString() || '';
            inputAccess.current.checked = currentUser?.access || false;
            inputPassword.current.value = '';
        }
    }, [currentUser])

    useEffect(() => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        if (deleteSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (deleteData === "Invalid data.") {
                setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].ERROR_USER_DATA })
            }
            else {
                if (user?.id === currentUser?.id) {
                    logout();
                }
                myModal.hide();
                setToastChildren(variables.LANGUAGES[language].USER_SUCCESSFULLY_DELETED);
                myToast.show();
            }
        }
        if (deleteIsError) {
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: (deleteError as FetchBaseQueryError).data as string })
            myModal.show();
        }

    }, [deleteLoading]);

    useEffect(() => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        if (isSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (dataChange === "User with that email exists.") {
                setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].ALREADY_EXISTS })
                myModal.show()
            }
            else if(dataChange === 'No user found.'){
                setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].USER_NOT_FOUND })
                myModal.show()
            }
            else{
                if (dataChange && typeof(dataChange)!=='string' && user?.id === dataChange.id){
                    setUser(dataChange)
                    dataChange.role === 0 && navigate('/');
                    dataChange.access === false && logout();
                }
                setToastChildren(variables.LANGUAGES[language].USER_SUCCESSFULLY_CHANGED);
                myToast.show();
                setCurrentUser(undefined);
            }
        }
        if (isError) {
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: (deleteError as FetchBaseQueryError).data as string })
            myModal.show();
        }

    }, [isLoading]);

    const changeUserClick = () => {
        if (inputEmail.current?.value === "" ||
            inputName.current?.value === "" ||
            inputSurname.current?.value === "" ||
            roleSelect.current?.value === "") {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            setModalInfo({ title: "Ошибка", children: "Введите данные" });
            myModal.show();
            return;
        }
        if (currentUser)
            changeUser({
                id: currentUser?.id || 0,
                email: inputEmail.current!.value,
                saltedPassword: inputPassword.current!.value,
                fullName: inputSurname.current?.value.trim() + ' ' + inputName.current?.value.trim(),
                role: Number(roleSelect.current?.value) || 0,
                access: inputAccess.current!.checked,
                accessToken: currentUser.accessToken,
                joinDate: new Date(),
                loginDate: new Date(),
                isOnline: false,
                collections: undefined
            });
            
    }

    const deleteUserClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        const children = currentUser
            ?
            <div className='d-flex flex-column gap-3'>
                <span>{variables.LANGUAGES[language].SURE_DELETE_ACC}</span>
                <button onClick={() =>
                    deleteUser({
                        email: currentUser?.email,
                        saltedPassword: currentUser?.saltedPassword,
                        accessToken: currentUser?.accessToken
                    })} className='btn btn-danger'>
                    {variables.LANGUAGES[language].DELETE_ACCOUNT}
                </button>
            </div >
            : <div>{variables.LANGUAGES[language].USER_NOT_FOUND}</div>;
        setModalInfo({ title: variables.LANGUAGES[language].DELETING_ACCOUNT, children: children });
        myModal.show();
    }

    return (
        <div className='ps-3 pe-3 d-flex flex-column w-75 flex-fill'>
            <h2 className='text-center p-2'>
                {variables.LANGUAGES[language].ADMIN_MENU}
            </h2>
            <AdminMenuUsers data={data} setCurrentUser={setCurrentUser} />
            <h4 className='text-center p-2'>
                {variables.LANGUAGES[language].SELECTED_USER}
            </h4>
            <div className="d-flex gap-3 border rounded-4 p-3">
                <div className="d-flex flex-column w-50">
                    <div className="mb-2">
                        <label htmlFor="inputSurname">{variables.LANGUAGES[language].SURNAME}</label>
                        <input className="form-control" id="inputSurname" ref={inputSurname} placeholder={variables.LANGUAGES[language].ENTER_SURNAME} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="inputName">{variables.LANGUAGES[language].NAME}</label>
                        <input className="form-control" id="inputName" ref={inputName} placeholder={variables.LANGUAGES[language].ENTER_NAME} />
                    </div>
                    <div className="d-flex gap-4 align-items-center">
                        <div className="flex-fill">
                            <label className="form-check-label" htmlFor="roleSelect">{variables.LANGUAGES[language].ROLE}</label>
                            <select className="form-select" id='roleSelect' ref={roleSelect}>
                                <option value={0}>{variables.LANGUAGES[language].USER}</option>
                                <option value={1}>{variables.LANGUAGES[language].ADMIN}</option>
                            </select>
                        </div>
                        <div className="form-check p-3 ps-4 pe-4">
                            <input className="form-check-input" type="checkbox" ref={inputAccess} id="inputAccess" />
                            <label className="form-check-label" htmlFor="inputAccess">{variables.LANGUAGES[language].ACCESS}</label>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column w-50">
                    <div className="mb-2">
                        <label htmlFor="inputId">ID</label>
                        <input type='email' className="form-control" id="inputId" ref={inputID} disabled />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="inputEmail">E-mail</label>
                        <input type='email' className="form-control" id="inputEmail" ref={inputEmail} placeholder={variables.LANGUAGES[language].ENTER_EMAIL} />
                    </div>
                    <div>
                        <label htmlFor="inputNewPassword">{variables.LANGUAGES[language].NEW_PASSWORD}</label>
                        <input type="password" className="form-control" id="inputNewPassword" ref={inputPassword} placeholder={variables.LANGUAGES[language].ENTER_NEW_PASSWORD} />
                    </div>
                </div>
            </div>
            <div className="d-flex gap-2">
                <button type="button"
                    className="btn btn-primary ms-3 mt-3 w-50"
                    onClick={() => changeUserClick()}>
                    {variables.LANGUAGES[language].CHANGE_DATA}
                </button>
                <button type="button"
                    className="btn btn-danger me-3 mt-3 w-50"
                    onClick={() => deleteUserClick()}>
                    {variables.LANGUAGES[language].DELETE_USER}
                </button>
            </div>
            <Modal id='myInfoModal' title={modalInfo.title}>
                {modalInfo.children}
            </Modal>

        </div>
    );
}

export default AdminMenu;
import React, { useEffect, useState } from 'react'
import { IModalInfo } from '@/types/modalInfo.interface';
import Modal from '@/pages/modal/Modal';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap'
import { useChangeUserMutation, useDeleteUserMutation } from '@/store/api/user.api';
import { useActions } from '@/hooks/useActions';
import { IUser } from '@/types/user.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import './Cabinet.scss'
import { variables } from '@/variables';

function MyInfo() {
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const { user } = useSelector((state: RootState) => state.user);
    const { language } = useSelector((state: RootState) => state.options);
    const [changeUser, { isLoading, isSuccess, isError, error, data }] = useChangeUserMutation();
    const [deleteUser, { isLoading: deleteLoading, isSuccess: deleteSuccess, isError: deleteIsError, error: deleteError, data: deleteData }] = useDeleteUserMutation();
    const { logout, setUser, setToastChildren } = useActions();

    useEffect(() => {
        if (isSuccess) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (data === "User with that email exists.") {
                setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].ALREADY_EXISTS })
                myModal.show();
            }
            else if (data === "Wrong Password.") {
                setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].WRONG_PASSWORD })
                myModal.show();
            }
            else {
                setToastChildren(variables.LANGUAGES[language].DATA_SUCCESFULLY_CHANGED);
                myToast.show();
                setUser(data as IUser);
            }
            (document.getElementById('inputNewPassword') as HTMLInputElement).value = '';
            (document.getElementById('inputOldPassword') as HTMLInputElement).value = '';
        }
        if (isError) {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: (error as FetchBaseQueryError).data as string })
            myModal.show();
        }
    }, [isLoading]);

    useEffect(() => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        if (deleteSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            if (deleteData === "Invalid data.") {
                setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].ERROR_IN_USER_DATA })
            }
            else {
                myModal.hide();
                logout();
                setToastChildren(variables.LANGUAGES[language].USER_SUCCESSFULLY_DELETED);
                myToast.show();
            }
        }
        if (deleteIsError) {
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: (deleteError as FetchBaseQueryError).data as string })
            myModal.show();
        }

    }, [deleteLoading]);

    const changeInfoClick = async () => {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputSurname = (document.getElementById('inputSurname') as HTMLInputElement).value;
        let inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value;
        let inputOldPassword = (document.getElementById('inputOldPassword') as HTMLInputElement).value;
        let inputNewPassword = (document.getElementById('inputNewPassword') as HTMLInputElement).value;
        if (inputEmail == "" || inputOldPassword == "" || inputName == "" || inputSurname == "") {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].INPUT_DATA });
            myModal.show();
            return;
        }
        if (user)
            changeUser({
                email: inputEmail.trim(),
                saltedOldPassword: inputOldPassword.trim(),
                fullName: inputSurname.trim() + ' ' + inputName.trim(),
                saltedNewPassword: inputNewPassword.trim(),
                accessToken: user.accessToken
            });
    }

    const deleteAccClick = () => {
        const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
        const children = user
            ?
            <div className='d-flex flex-column gap-3'>
                <span>{variables.LANGUAGES[language].SURE_DELETE_ACC_MY}</span>
                <button onClick={() =>
                    deleteUser({
                        email: user?.email,
                        saltedPassword: user?.saltedPassword,
                        accessToken: user?.accessToken
                    })} className='btn btn-danger'>
                    {variables.LANGUAGES[language].DELETE_ACCOUNT}
                </button>
            </div >
            : <div>{variables.LANGUAGES[language].USER_NOT_FOUND}</div>;
        setModalInfo({ title: variables.LANGUAGES[language].DELETING_ACCOUNT, children: children });
        myModal.show();
    }

    return (
        <div className=' d-flex flex-fill flex-column'>
            <div className='ms-auto me-auto d-flex flex-column my-info ps-3 pe-3 flex-fill'>
                <h2 className='text-center p-3'>
                    {variables.LANGUAGES[language].MY_DATA}
                </h2>
                <div className="mb-3">
                    <label htmlFor="inputSurname">{variables.LANGUAGES[language].SURNAME}</label>
                    <input className="form-control" id="inputSurname" placeholder={variables.LANGUAGES[language].ENTER_NEW_SURNAME} defaultValue={user?.fullName.split(' ', 2)[0]} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputName">{variables.LANGUAGES[language].NAME}</label>
                    <input className="form-control" id="inputName" placeholder={variables.LANGUAGES[language].ENTER_NEW_NAME} defaultValue={user?.fullName.split(' ', 2)[1]} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail">Email</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder={variables.LANGUAGES[language].ENTER_NEW_EMAIL} defaultValue={user?.email} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputOldPassword">{variables.LANGUAGES[language].OLD_PASS}</label>
                    <input type="password" className="form-control" id="inputOldPassword" placeholder={variables.LANGUAGES[language].ENTER_OLD_PASS} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputNewPassword">{variables.LANGUAGES[language].NEW_PASSWORD}</label>
                    <input type="password" className="form-control" id="inputNewPassword" placeholder={variables.LANGUAGES[language].ENTER_NEW_PASSWORD} />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={() => changeInfoClick()}>
                    {variables.LANGUAGES[language].CHANGE_DATA}
                </button>

                <Modal id='myInfoModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
            <button onClick={() => deleteAccClick()} className='align-self-end btn btn-danger d-flex align-items-center gap-2 mt-4'>
                {variables.LANGUAGES[language].DELETE_ACCOUNT}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
                </svg>
            </button>
        </div>
    );
}

export default MyInfo;
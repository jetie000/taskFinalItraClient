import React, { useEffect, useState } from 'react';
import Modal from '@/pages/modal/Modal'
import 'bootstrap';
import { IModalInfo } from '@/types/modalInfo.interface';
import { useRegisterUserMutation } from '@/store/api/user.api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { variables } from '@/variables';

function Register() {
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const [registerUser, { isLoading, isSuccess, isError, error, data }] = useRegisterUserMutation();
    const { language } = useSelector((state: RootState) => state.options);

    useEffect(() => {
        if (isSuccess) {
            if (data === 'User exists.')
                setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].ALREADY_EXISTS })
            else {
                setModalInfo({ title: variables.LANGUAGES[language].SUCCESS, children: variables.LANGUAGES[language].SUCCESFULLY_REGISTERED });
                (document.getElementById('inputName') as HTMLInputElement).value = '';
                (document.getElementById('inputSurname') as HTMLInputElement).value = '';
                (document.getElementById('inputEmail') as HTMLInputElement).value = '';
                (document.getElementById('inputPassword') as HTMLInputElement).value = '';
            }
        }
        if (isError) {
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: ((error as FetchBaseQueryError).data as string) })
        }
    }, [isLoading])

    const registerClick = () => {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputSurname = (document.getElementById('inputSurname') as HTMLInputElement).value;
        let inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value;
        let inputPassword = (document.getElementById('inputPassword') as HTMLInputElement).value;
        if (inputEmail == "" || inputPassword == "" || inputName == "" || inputSurname == "") {
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].INPUT_DATA })
            return;
        }
        registerUser({
            email: inputEmail.trim(),
            saltedPassword: inputPassword.trim(),
            fullName: inputSurname.trim() + ' ' + inputName.trim()
        });
        setModalInfo({ title: variables.LANGUAGES[language].LOADING, children: variables.LANGUAGES[language].LOADING })
    }

    return (
        <div className="mt-3">
            <form>
                <div className="mb-3">
                    <label htmlFor="inputSurname">{variables.LANGUAGES[language].SURNAME}</label>
                    <input className="form-control" id="inputSurname" placeholder={variables.LANGUAGES[language].ENTER_SURNAME} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputName">{variables.LANGUAGES[language].NAME}</label>
                    <input className="form-control" id="inputName" placeholder={variables.LANGUAGES[language].ENTER_NAME} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail">Email</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder={variables.LANGUAGES[language].ENTER_EMAIL} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword">{variables.LANGUAGES[language].PASSWORD}</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder={variables.LANGUAGES[language].ENTER_PASSWORD} />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#registerModal"
                    onClick={() => registerClick()}>
                    {variables.LANGUAGES[language].REGISTER_}
                </button>

                <Modal id='registerModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </form>
        </div>
    )
}

export default Register;
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { IModalInfo } from '../../types/modalInfo.interface';
import { useLogInUserMutation } from '../../store/api/user.api';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useActions } from '../../hooks/useActions';
import Modal from '../modal/Modal';
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap'

function Login() {
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const navigate = useNavigate();
    const { setUser, setToastChildren } = useActions();
    const [logInUser, { isLoading, isSuccess, isError, error, data }] = useLogInUserMutation();

    useEffect(() => {
        if (isSuccess) {
            const myModal = new bootstrapModal(document.getElementById('loginModal') || 'loginModal');
            const myToast = new bootstrapToast(document.getElementById('myToast') || 'myToast');
            if (data === "Invalid data.") {
                setModalInfo({ title: "Ошибка", children: "Вы ввели неправильный логин или пароль" })
                myModal.show();
            }
            else {
                setToastChildren('Вы успешно вошли');
                myToast.show();
                setUser(data);
                navigate('/');
            }
        }
        if (isError) {
            const myModal = new bootstrapModal(document.getElementById('loginModal') || 'loginModal');
            setModalInfo({ title: "Ошибка", children: (error as FetchBaseQueryError).data as string })
            myModal.show();
            return;
        }
    }, [isLoading])

    const logIn = () => {
        let inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value;
        let inputPassword = (document.getElementById('inputPassword') as HTMLInputElement).value;
        const myModal = new bootstrapModal(document.getElementById('loginModal') || 'loginModal');
        if (inputEmail == "" || inputPassword == "") {
            setModalInfo({ title: "Ошибка", children: "Введите данные" })
            myModal.show();
            return;
        }
        logInUser({
            email: inputEmail.trim(),
            saltedPassword: inputPassword.trim()
        });
    }

    return (
        <div className="mt-3">
            <form>
                <div className="mb-3">
                    <label className="mb-1" htmlFor="inputEmail">Логин</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder="Введите e-mail" />
                </div>
                <div className="mb-3">
                    <label className="mb-1" htmlFor="inputPassword">Пароль</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder="Введите пароль" />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={logIn}>
                    Войти
                </button>
                <Modal id='loginModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </form>
        </div>

    )
}
export default Login;

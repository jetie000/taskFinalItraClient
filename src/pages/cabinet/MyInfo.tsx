import React, { useEffect, useState } from 'react'
import { IModalInfo } from '../../types/modalInfo.interface';
import Modal from '../modal/Modal';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap'
import { useChangeUserMutation } from '../../store/api/user.api';
import { useActions } from '../../hooks/useActions';
import { IUser } from '../../types/user.interface';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import './Cabinet.scss'

function MyInfo() {
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
    const { user } = useSelector((state: RootState) => state.user);
    const [changeUser, { isLoading, isSuccess, isError, error, data }] = useChangeUserMutation();
    const { setUser, setToastChildren } = useActions();

    useEffect(() => {
        if(isSuccess){
            const myModal = new bootstrapModal(document.getElementById('myInfoModal') || 'myInfoModal');
            const myToast = new bootstrapToast(document.getElementById('myToast') || 'myToast');
            if (data === "User with that email exists.") {
                setModalInfo({ title: "Ошибка", children: "Пользователь с таким адресом эл. почты существует" })
                myModal.show();
            }
            else if(data === "Wrong Password."){
                setModalInfo({ title: "Ошибка", children: "Вы ввели неправильный пароль" })
                myModal.show();
            }
            else{
                setToastChildren('Данные успешно изменены');
                myToast.show();
                setUser(data as IUser);
            }
            (document.getElementById('inputNewPassword') as HTMLInputElement).value = '';
            (document.getElementById('inputOldPassword') as HTMLInputElement).value = '';
        }
        if (isError) {
            const myModal = new bootstrapModal(document.getElementById('loginModal') || 'loginModal');
            setModalInfo({ title: "Ошибка", children: (error as FetchBaseQueryError).data as string })
            myModal.show();
            return;
        }
    }, [isLoading]);

    const changeInfoClick = async () => {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputSurname = (document.getElementById('inputSurname') as HTMLInputElement).value;
        let inputEmail = (document.getElementById('inputEmail') as HTMLInputElement).value;
        let inputOldPassword = (document.getElementById('inputOldPassword') as HTMLInputElement).value;
        let inputNewPassword = (document.getElementById('inputNewPassword') as HTMLInputElement).value;
        if (inputEmail == "" || inputOldPassword == "" || inputName == "" || inputSurname == "") {
            const myModal = new bootstrapModal(document.getElementById('myInfoModal') || 'myInfoModal');
            setModalInfo({ title: "Ошибка", children: "Введите данные" });
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

    return (
        <div className='p-3 d-flex flex-fill'>
            <div className='ms-auto me-auto d-flex flex-column my-info'>
                <h2 className='text-center p-3'>
                    Мои данные
                </h2>
                <div className="mb-3">
                    <label htmlFor="inputSurname">Фамилия</label>
                    <input className="form-control" id="inputSurname" placeholder="Введите новую фамилию" defaultValue={user?.fullName.split(' ', 2)[0]} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputName">Имя</label>
                    <input className="form-control" id="inputName" placeholder="Введите новое имя" defaultValue={user?.fullName.split(' ', 2)[1]} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputEmail">E-mail</label>
                    <input type='email' className="form-control" id="inputEmail" placeholder="Введите новый email" defaultValue={user?.email} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputOldPassword">Старый пароль (Обязательно)</label>
                    <input type="password" className="form-control" id="inputOldPassword" placeholder="Введите старый пароль" />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputNewPassword">Новый пароль (По желанию)</label>
                    <input type="password" className="form-control" id="inputNewPassword" placeholder="Введите новый пароль" />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={() => changeInfoClick()}>
                    Изменить данные
                </button>

                <Modal id='myInfoModal' title={modalInfo.title}>
                    {modalInfo.children}
                </Modal>
            </div>
        </div>
    );
}

export default MyInfo;
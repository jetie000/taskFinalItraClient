import React, { useEffect } from "react";
import { useActions } from "@/hooks/useActions";
import { useChangeUserAdminMutation, useDeleteUserMutation } from "@/store/api/user.api";
import { variables } from "@/variables";
import { Modal as bootstrapModal } from 'bootstrap';
import { Toast as bootstrapToast } from 'bootstrap'
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { IUser } from "@/types/user.interface";
import { IInputUserRef } from "./inputUserRef.interface";

interface IAdminMenuButtons {
    setModalInfo: Function
    currentUser: IUser
    setCurrentUser: Function
    inputUserRef: IInputUserRef
}

function AdminMenuButtons({ setModalInfo, currentUser, setCurrentUser, inputUserRef }: IAdminMenuButtons) {
    const { user } = useSelector((state: RootState) => state.user);
    const { language } = useSelector((state: RootState) => state.options);
    const [changeUser, { isLoading, isSuccess, isError, error, data: dataChange }] = useChangeUserAdminMutation();
    const [deleteUser, { isLoading: deleteLoading, isSuccess: deleteSuccess, isError: deleteIsError, error: deleteError, data: deleteData }] = useDeleteUserMutation();
    const { logout, setUser, setToastChildren } = useActions();
    const navigate = useNavigate();

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
            switch (dataChange) {
                case "User with that email exists.":
                    setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].ALREADY_EXISTS })
                    myModal.show(); break;
                case 'No user found.':
                    setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: variables.LANGUAGES[language].USER_NOT_FOUND })
                    myModal.show(); break;
                default:
                    setToastChildren(variables.LANGUAGES[language].USER_SUCCESSFULLY_CHANGED);
                    myToast.show();
                    setCurrentUser(undefined);
                    if (dataChange && typeof (dataChange) !== 'string' && user?.id === dataChange.id) {
                        setUser(dataChange)
                        dataChange.role === 0 && navigate('/');
                        dataChange.access === false && logout();
                    }
                    break;
            }
        }
        if (isError) {
            setModalInfo({ title: variables.LANGUAGES[language].ERROR, children: (deleteError as FetchBaseQueryError).data as string })
            myModal.show();
        }

    }, [isLoading]);

    const changeUserClick = () => {
        if (inputUserRef.inputEmail.current?.value === "" ||
        inputUserRef.inputName.current?.value === "" ||
        inputUserRef.inputSurname.current?.value === "" ||
        inputUserRef.roleSelect.current?.value === '') {
            const myModal = bootstrapModal.getOrCreateInstance(document.getElementById('myInfoModal') || 'myInfoModal');
            setModalInfo({ title: "Ошибка", children: "Введите данные" });
            myModal.show();
            console.log(inputUserRef);
            
            return;
        }
        if (currentUser)
            changeUser({
                id: currentUser?.id || 0,
                email: inputUserRef.inputEmail.current?.value!,
                saltedPassword: inputUserRef.inputPassword.current?.value!,
                fullName: inputUserRef.inputSurname.current?.value.trim() + ' ' + inputUserRef.inputName.current?.value.trim(),
                role: Number(inputUserRef.roleSelect.current?.value) || 0,
                access: inputUserRef.inputAccess.current?.checked!,
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
        <>
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
        </>
    );
}

export default AdminMenuButtons;
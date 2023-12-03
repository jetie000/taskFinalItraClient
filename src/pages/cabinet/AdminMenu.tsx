import React, { useEffect, useRef, useState } from "react";
import { useGetAllQuery } from "@/store/api/user.api";
import { IUser } from "@/types/user.interface";
import Modal from "@/pages/modal/Modal";
import { IModalInfo } from "@/types/modalInfo.interface";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import AdminMenuUsers from "./AdminMenuUsers";
import { variables } from "@/variables";
import AdminMenuButtons from "./AdminMenuButtons";

function AdminMenu() {
    const { data } = useGetAllQuery(undefined);
    const [currentUser, setCurrentUser] = useState<IUser>();
    const [modalInfo, setModalInfo] = useState<IModalInfo>({ title: '', children: '' });
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
                <AdminMenuButtons
                    setModalInfo={setModalInfo}
                    currentUser={currentUser!}
                    setCurrentUser={setCurrentUser} 
                    inputUserRef={{
                        inputEmail: inputEmail,
                        inputName: inputName,
                        inputPassword: inputPassword,
                        inputSurname: inputSurname,
                        inputAccess: inputAccess,
                        roleSelect: roleSelect
                    }}/>
            </div>
            <Modal id='myInfoModal' title={modalInfo.title}>
                {modalInfo.children}
            </Modal>

        </div>
    );
}

export default AdminMenu;
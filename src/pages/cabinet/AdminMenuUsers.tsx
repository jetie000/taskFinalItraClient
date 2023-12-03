import React from "react";
import { IUser } from "@/types/user.interface";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { variables } from "@/variables";

function AdminMenuUsers({data, setCurrentUser} :{data: IUser[] | undefined, setCurrentUser: Function}) {
    const { language } = useSelector((state: RootState) => state.options);
    return ( 
        <ul className="list-group rounded-4 mt-2 users-wrapper overflow-y-auto">
                {
                    data &&
                    data.map(user =>
                        <li key={user.id} onClick={() => setCurrentUser(user)} className="list-group-item cursor-pointer">
                            <div className="d-flex flex-column fs-5">
                                <div className="d-flex flex-fill align-items-start gap-3">
                                    <span className="w-50 text-truncate">{user.email}</span>
                                    <div className="vr"></div>
                                    <span className="w-50 text-truncate">{variables.LANGUAGES[language].ACCESS+': '}{user.access ? variables.LANGUAGES[language].YES : variables.LANGUAGES[language].NO}</span>
                                </div>
                                <div className="d-flex flex-fill align-items-start gap-3">
                                    <span className="w-50 text-truncate">{user.fullName}</span>
                                    <div className="vr"></div>
                                    <span className="w-50 text-truncate">{variables.LANGUAGES[language].ROLE+': '}{user.role === 1 ? variables.LANGUAGES[language].ADMIN : variables.LANGUAGES[language].USER}</span>
                                </div>
                            </div>
                        </li>
                    )
                }
            </ul>
     );
}

export default AdminMenuUsers;
import React from "react";
import './not-found.scss'
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { variables } from "../../variables";
function Custom404() {
    const { language } = useSelector((state: RootState) => state.options);
    return ( 
        <h1 className='page404'>{variables.LANGUAGES[language].ERROR_404}</h1>
     );
}

export default Custom404;
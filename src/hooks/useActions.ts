import { useDispatch } from "react-redux";
import { actions as userActions } from "../store/user/user.slice";
import { useMemo } from "react";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actions as toastActions } from "../store/toast/toast.slice";

const rootActions = {
    ...userActions,
    ...toastActions
}

export const useActions = () => {
    const dispatch = useDispatch();
    
    return useMemo(() =>
        bindActionCreators(rootActions, dispatch), [dispatch])
}
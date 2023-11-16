import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

function Toast() {
    const { toastChildren } = useSelector((state: RootState) => state.toast)
    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="myToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <i className="bi bi-bell-fill me-2"></i>
                    <strong className="me-auto">Уведомление</strong>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    {toastChildren}
                </div>
            </div>
        </div>
    );
}

export default Toast;
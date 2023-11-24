import React, { useEffect } from 'react'
import { IComment } from '../../types/comment.interface';
import { useAddCommentMutation, useDeleteCommentMutation } from '../../store/api/comments.api';
import { Toast as bootstrapToast } from 'bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useActions } from '../../hooks/useActions';

function ItemComments({ idItem, comments }: { idItem: number, comments: IComment[] }) {
    const [addComment, { isLoading, isSuccess, isError, data }] = useAddCommentMutation();
    const [deleteComment, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, data: dataDelete }] = useDeleteCommentMutation();
    const { user } = useSelector((state: RootState) => state.user);
    const { setToastChildren } = useActions();

    useEffect(() => {
        if (isSuccess) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            switch (data) {
                case 'No user found.':
                    setToastChildren('Пользователь не найден'); break;
                case 'No item found.':
                    setToastChildren('Предмет не найден'); break;
                case 'Comment added.':
                    setToastChildren('Комментарий успешно создан'); break;
            }
            myToast.show();
        }
        if (isError) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка создания комментария');
            myToast.show();
        }
    }, [isLoading]);

    useEffect(() => {
        if (isSuccessDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            switch (dataDelete) {
                case 'No user found.':
                    setToastChildren('Пользователь не найден'); break;
                case 'No comment found.':
                    setToastChildren('Комментарий не найден'); break;
                case 'No access to comment.':
                    setToastChildren('Нет доступа'); break;
                case 'Comment deleted.':
                    setToastChildren('Комментарий успешно удален'); break;
            }
            myToast.show();
        }
        if (isErrorDelete) {
            const myToast = bootstrapToast.getOrCreateInstance(document.getElementById('myToast') || 'myToast');
            setToastChildren('Ошибка удаления комментария');
            myToast.show();
        }
    }, [isLoadingDelete]);

    const addCommentClick = () => {
        const commentValue = (document.getElementById('commentInput') as HTMLInputElement).value;
        if (commentValue.trim() === '')
            return;
        addComment({
            comment: {
                id: 0,
                comment: commentValue,
                userId: user!.id,
                userFullName: user!.fullName,
                creationDate: new Date()
            },
            itemId: idItem
        })
    }

    return (
        <div className='d-flex flex-column mt-3 gap-1'>
            <h2>Комментарии:</h2>
            <div className="input-group mb-2">
                <input type="text" className="form-control" placeholder="Введите комментарий" id='commentInput' />
                <button onClick={() => addCommentClick()} className="btn btn-outline-secondary" type="button" id="buttonAdd">Отправить</button>
            </div>
            {comments.length > 0 &&
                <ul className="list-group">

                    {comments.map(comment =>
                        <li key={comment.id} className="list-group-item">
                            <div className="d-flex gap-2">
                                <span className='flex-shrink-0 fs-5 me-1'>{comment.userFullName}</span>
                                <div className="vr"></div>
                                <span className='flex-shrink-0 fs-5'>{new Date(comment.creationDate).toLocaleString()}</span>
                                <div className="vr"></div>
                                <div className="d-flex text-break fs-5">
                                    {comment.comment}
                                </div>
                                {
                                    (comment.userId === user!.id || user!.role === 1) &&
                                    <>
                                        <div className="vr ms-auto"></div>
                                        <button onClick={() => deleteComment(comment.id)} className='btn btn-danger align-self-start p-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                                                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                                            </svg>
                                        </button>
                                    </>
                                }
                            </div>
                        </li>
                    )

                    }
                </ul>
            }
        </div >
    );
}

export default ItemComments;
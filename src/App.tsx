import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.scss";
import AuthWrapper from "./pages/authorization/AuthWrapper";
import Register from "./pages/authorization/Register";
import Login from "./pages/authorization/Login";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./pages/home/Home";
import ReactDOM from "react-dom/client";
import Toast from "./pages/toast/Toast";
import Header from "./pages/header/Header";
import Custom404 from "./pages/not-found/not-found";
import { variables } from "./variables";
import Cabinet from "./pages/cabinet/Cabinet";

const App = () => {

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', localStorage.getItem(variables.THEME_LOCALSTORAGE) || 'dark')
  }, [])

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/login'
            element={
              <AuthWrapper>
                <Login />
              </AuthWrapper>
            } />
          <Route path='/register'
            element={
              <AuthWrapper>
                <Register />
              </AuthWrapper>
            } />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path='*' element={<Custom404/>} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </Provider>
  )
};

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />)

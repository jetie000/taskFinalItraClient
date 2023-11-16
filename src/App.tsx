import React from "react";
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

const App = () => {

  return (
    <Provider store={store}>
      <Header/>
      <BrowserRouter>
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
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
      <Toast/>
    </Provider>
  )
};

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App/>)

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
import Custom404 from "./pages/notFound/not-found";
import Cabinet from "./pages/cabinet/Cabinet";
import AddCollection from "./pages/addCollection/AddCollection";
import Collection from "./pages/collection/Collection";
import Item from "./pages/item/Item";
import ChangeCollection from "./pages/changeCollection/ChangeCollection";
import ChangeItem from "./pages/changeItem/ChangeItem";
import Search from "./pages/search/Search";
import { useSetTheme } from "./hooks/useSetTheme";

const App = () => {
  const setTheme = useSetTheme();

  useEffect(() => {
    setTheme();
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
          <Route path="/search/:search" element={<Search/>}/>
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/addcollection" element={<AddCollection/>}/>
          <Route path="/collection/:id" element={<Collection/>}/>
          <Route path="/collection/:id/change" element={<ChangeCollection/>}/>
          <Route path="/collection/:id/item/:idItem" element={<Item/>}/>
          <Route path="/collection/:id/item/:idItem/change" element={<ChangeItem/>}/>
          <Route path="/item/:idItem" element={<Item/>}/>
          <Route path='*' element={<Custom404/>} />
        </Routes>
        <Toast />
      </BrowserRouter>
    </Provider>
  )
};

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />)

import React, { useEffect, useState } from 'react'
import './App.css';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import CreateUser from './components/CreateUser';
import Loginpage from './Loginpage';
import ContextMenuComponent from '../src/components/ContextMenu';
import SubCustomer from './components/SubCustomer';
import Keycloak from "keycloak-js";
import Permissions from './components/Permissions';
export const AuthContext = React.createContext();


function App() {
  const [keycloak, setKeycloak] = useState(null);

  useEffect(() => {
    const kc = Keycloak("/keycloak.json");

    kc.init({ onLoad: "login-required" }).then((authenticated) => {
      // setAuthenticated(authenticated);
      setKeycloak(kc);
      if (authenticated) localStorage.setItem("accessToken", kc.token);
      // getUserData();



    });
  }, []);

  






  return (
    <BrowserRouter>

      {keycloak && (
        <AuthContext.Provider value={keycloak} >
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/create-user' element={<CreateUser />} />
          <Route    path='/permission'  element={<Permissions/>} />
          <Route path='/contextMenu' element={<ContextMenuComponent />} />
          <Route path='/subcustomer/:id' element={<SubCustomer />} />
        </Routes>
      </AuthContext.Provider>
      )}

    </BrowserRouter>
  );
}

export default App;

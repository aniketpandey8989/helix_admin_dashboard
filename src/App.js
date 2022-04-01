import React, { useContext } from 'react'
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import CreateUser from './components/CreateUser/CreateUser';
import SubCustomer from './components/SubCustomer/SubCustomer';
import Permissions from './components/Permissions/Permissions';
import { KeycloackContext } from './components/Keycloack/KeycloackContext';
import Header from './components/Header/Header';
import SensorConfig from './components/SensorConfig/SensorConfig';
import ViewConfigData from './components/SensorConfig/ViewConfigData';


function App() {
  const { keycloackValue, authenticated } = useContext(KeycloackContext)
 
  return (

    (keycloackValue && authenticated) && (
      <BrowserRouter>
        <div>
          <Header>
            <Routes>

              <Route path='/' element={<Dashboard />} />
              <Route path='/create-user' element={<CreateUser />} />
              <Route path='/permission' element={<Permissions />} />
              <Route path='/sensor-config' element={<SensorConfig />} />
              <Route path='/subcustomer/:id' element={<SubCustomer />} />
              <Route path='/view-configdata' element={<ViewConfigData />} />

            </Routes>
          </Header>
        </div>


      </BrowserRouter>
    )

  );
}

export default App;

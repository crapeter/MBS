// import logo from './logo.svg'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Components/Misc/AuthContext';
import UserLogin from './Components/Login/UserLogin'
import Movies from './Components/Movie/Movies'
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <div className='test'>
          <BrowserRouter>
            <Routes>
              <Route exact path='/' Component={UserLogin} />
              <Route exact path='/movies' Component={Movies} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

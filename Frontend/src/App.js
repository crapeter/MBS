// import logo from './logo.svg'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Components/Misc/AuthContext';
// import Home_Page from './Components/Misc/HomePage'
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <div className='test'>
          <BrowserRouter>
            <Routes>
              {/* <Route exact path="/" Component={Home_Page} /> */}
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

// import logo from './logo.svg'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './Components/Misc/AuthContext'
import UserLogin from './Components/Login/UserLogin'
import Movies from './Components/Movie/Movies'
import Locations from './Components/Movie/Locations'
import Abilene from './Components/Locations/Abilene'
import Amarillo from './Components/Locations/Amarillo'
import Levelland from './Components/Locations/Levelland'
import Lubbock from './Components/Locations/Lubbock'
import Plainview from './Components/Locations/Plainview'
import Snyder from './Components/Locations/Snyder'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <div className='test'>
          <BrowserRouter>
            <Routes>
              <Route exact path='/' Component={UserLogin} />
              <Route exact path='/locations' Component={Locations} />
              <Route exact path='/movies' Component={Movies} />
              <Route exact path='/Abilene' Component={Abilene}/>
              <Route exact path='/Amarillo' Component={Amarillo}/>
              <Route exact path='/Levelland' Component={Levelland}/>
              <Route exact path='/Lubbock' Component={Lubbock}/>
              <Route exact path='/Plainview' Component={Plainview}/>
              <Route exact path='/Snyder' Component={Snyder}/>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

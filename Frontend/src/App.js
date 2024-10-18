// import logo from './logo.svg'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './Components/Misc/AuthContext'
import UserLogin from './Components/Login/UserLogin'
import UserRegistration from './Components/Login/NewUser'
import Movies from './Components/Movie/Movies'
import Locations from './Components/Movie/Locations'

import Abilene from './Components/Locations/Abilene'
import Amarillo from './Components/Locations/Amarillo'
import Levelland from './Components/Locations/Levelland'
import Lubbock from './Components/Locations/Lubbock'
import Plainview from './Components/Locations/Plainview'
import Snyder from './Components/Locations/Snyder'

import AbileneSearch from './Components/Locations/AbileneSearch'
import AmarilloSearch from './Components/Locations/AmarilloSearch'
import LevellandSearch from './Components/Locations/LevellandSearch'
import LubbockSearch from './Components/Locations/LubbockSearch'
import PlainviewSearch from './Components/Locations/PlainviewSearch'
import SnyderSearch from './Components/Locations/SnyderSearch'
import UpdateTheater from './Components/Movie/UpdateTheaters'
import Reviews from './Components/Movie/Reviews'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <div className='test'>
          <BrowserRouter>
            <Routes>
              <Route exact path='/' Component={UserLogin} />
              <Route exact path='/register' Component={UserRegistration} />
              <Route exact path='/locations' Component={Locations} />
              <Route exact path='/movies' Component={Movies} />
              <Route exact path='/Abilene' Component={Abilene}/>
              <Route exact path='/Amarillo' Component={Amarillo}/>
              <Route exact path='/Levelland' Component={Levelland}/>
              <Route exact path='/Lubbock' Component={Lubbock}/>
              <Route exact path='/Plainview' Component={Plainview}/>
              <Route exact path='/Snyder' Component={Snyder}/>
              <Route exact path='/Abilene/Search' Component={AbileneSearch}/>
              <Route exact path='/Amarillo/Search' Component={AmarilloSearch}/>
              <Route exact path='/Levelland/Search' Component={LevellandSearch}/>
              <Route exact path='/Lubbock/Search' Component={LubbockSearch}/>
              <Route exact path='/Plainview/Search' Component={PlainviewSearch}/>
              <Route exact path='/Snyder/Search' Component={SnyderSearch}/>
              <Route exact path='/:location/:movieTitle/Reviews' Component={Reviews}/>
              <Route exact path='/:location/Playing' Component={UpdateTheater}/>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

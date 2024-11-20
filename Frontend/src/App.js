import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Components/Misc/AuthContext";
import HomePage from "./Components/Movie/HomePage";
import UserLogin from "./Components/Login/UserLogin";
import UserRegistration from "./Components/Login/NewUser";
import Movies from "./Components/Movie/Movies";

import AbileneSearch from "./Components/Locations/AbileneSearch";
import AmarilloSearch from "./Components/Locations/AmarilloSearch";
import LevellandSearch from "./Components/Locations/LevellandSearch";
import LubbockSearch from "./Components/Locations/LubbockSearch";
import PlainviewSearch from "./Components/Locations/PlainviewSearch";
import SnyderSearch from "./Components/Locations/SnyderSearch";
import UpdateTheater from "./Components/Movie/UpdateTheaters";

import Reviews from "./Components/Movie/Reviews";
import AdminPage from "./Components/Movie/AdminPage";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <div className="test">
          <BrowserRouter>
            <Routes>
              <Route exact path="/" Component={HomePage} />
              <Route exact path="/login" Component={UserLogin} />
              <Route exact path="/register" Component={UserRegistration} />
              <Route exact path="/movies" Component={Movies} />
              <Route exact path="/Abilene/Search" Component={AbileneSearch} />
              <Route exact path="/Amarillo/Search" Component={AmarilloSearch} />
              <Route
                exact
                path="/Levelland/Search"
                Component={LevellandSearch}
              />
              <Route exact path="/Lubbock/Search" Component={LubbockSearch} />
              <Route
                exact
                path="/Plainview/Search"
                Component={PlainviewSearch}
              />
              <Route exact path="/Snyder/Search" Component={SnyderSearch} />
              <Route exact path="/:movieTitle/Reviews" Component={Reviews} />
              <Route
                exact
                path="/:location/Playing"
                Component={UpdateTheater}
              />
              <Route exact path="/Admin" Component={AdminPage} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

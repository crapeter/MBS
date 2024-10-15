import React from "react";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom"
import '../../CSS/Locations.css';

const Locations = () => {
  const { isLoggedIn } = useAuth();
  const nav = useNavigate()

  const Lubbock = () => {
    nav('/Lubbock')
  }

  const Amarillo = () => {
    nav('/Amarillo')
  }

  const Levelland = () => {
    nav('/Levelland')
  }

  const Plainview = () => {
    nav('/Plainview')
  }

  const Snyder = () => {
    nav('/Snyder')
  }

  const Abilene = () => {
    nav('/Abilene')
  }

  return (
    <div className="top_loc_div">
      {isLoggedIn ? (
        <div className="locations">
          <div className="container">
            <h1>Movie Theater Locations</h1>
            <button className="to_city" onClick={Lubbock}>Lubbock</button>
            <button className="to_city" onClick={Amarillo}>Amarillo</button>
            <button className="to_city" onClick={Levelland}>Levelland</button>
            <button className="to_city" onClick={Plainview}>Plainview</button>
            <button className="to_city" onClick={Snyder}>Snyder</button>
            <button className="to_city" onClick={Abilene}>Abilene</button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Please log in to view locations</h1>
        </div>
      )}
    </div>
  )
}

export default Locations
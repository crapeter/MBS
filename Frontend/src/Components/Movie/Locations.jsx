import React from "react";
import { useAuth } from "../Misc/AuthContext";
import { useNavigate } from "react-router-dom"
import Logout from "../Misc/Logout"
import '../../CSS/Locations.css';

const Locations = () => {
  const { isLoggedIn, isAdmin } = useAuth();
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

  const toStatusReport = () => {
    nav('/status/report')
  }

  return (
    <div className="top_loc_div">
      {isLoggedIn ? (
        <div className="locations">
          <div className="container">
            <h1>Movie Theater Locations</h1>
            {isAdmin && (
              <button className="to_status_report" onClick={toStatusReport}>Status Report</button>
            )}
            <button className="to_city" onClick={Abilene}>Abilene</button>
            <button className="to_city" onClick={Amarillo}>Amarillo</button>
            <button className="to_city" onClick={Levelland}>Levelland</button>
            <button className="to_city" onClick={Lubbock}>Lubbock</button>
            <button className="to_city" onClick={Plainview}>Plainview</button>
            <button className="to_city" onClick={Snyder}>Snyder</button>
            <Logout />
          </div>
        </div>
      ) : (
        <div>
          <h1 style={{ color: "white" }}>Log in to view locations</h1>
        </div>
      )}
    </div>
  )
}

export default Locations
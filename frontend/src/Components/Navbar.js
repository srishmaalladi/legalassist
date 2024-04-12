import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getCurrentUserDeatil, doLogout } from './auth/authindex'
import { toast } from "react-toastify";
// import VoiceAssistant from "./Voice";


 export default function Navbar({isDarkMode,toggleMode}) {
  const navigate = useNavigate();
  // const isDarkMode=props.isDarkMode;
  const [login, setLogin] = useState(false)
  const [user, setUser] = useState(undefined)
  // const [isDarkMode, setIsDarkMode] = useState(false);
  // const toggleMode = () => {
  //   setIsDarkMode(prevMode => !prevMode);}
    // Function to toggle between light mode and dark mode
let useLogin = isLoggedIn();
  useEffect(() => {
    setLogin(isLoggedIn());
    setUser(getCurrentUserDeatil())

  }, [useLogin])

  const handleLogout = () => {
    doLogout(() => {
      setLogin(false)
      toast.info('LoggedOut Succesfully')
    })
    navigate("/")
  }

  return (
    <div classname="container-fluid" style={{position:'sticky',top:'0',zIndex:'1000'}}>
      {!login && (
        <>
          <nav className="navbar navbar-expand-sm navbar-dark bg-dark" style={{position:'sticky',top:'0',zIndex:'1000'}}>
            <div className="container-fluid">
              <Link className="navbar-brand mx-auto" to="/">
                NYAAY SAHAYAK
              </Link>
              <button
                className="navbar-toggler d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsibleNavId"
                aria-controls="collapsibleNavId"
                aria-expanded="false"
                aria-label="Toggle navigation"
              ></button>
              <div className="collapse navbar-collapse" id="collapsibleNavId">
                <ul className="navbar-nav ms-auto justify-content-between" >
                  <li className="nav-item mx-2">
                    <Link className="nav-link active text-decoration-none" to="/" aria-current="page">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link active" to="/About">
                      About Us
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link active" to="/LegalAid">
                      Legal Aid
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link active" to="/Awareness">
                      Awareness
                    </Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="nav-link active" to="/login">
                      Login
                    </Link>
                  </li>
                </ul>
                 { <div className={isDarkMode ? 'dark-mode': 'light-mode'}>
                <button onClick={toggleMode} style={{backgroundColor: 'transparent'}}>
      {isDarkMode ? (
        <i className="far fa-moon"></i> // For regular sun icon
      ) : (
        <i className="fas fa-sun"></i> // For solid moon icon
      )}
    </button>
    </div>} 
              </div>
            </div>
          </nav>
        </>
      )}
      {
        login && (
          <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="container-fluid">
              <Link className="navbar-brand mx-auto" to={`/${user.role === "admin" ? "admin":"advocate"}/dashboard`}>
                NYAAY SAHAYAK
              </Link>
              <button
                className="navbar-toggler d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsibleNavId"
                aria-controls="collapsibleNavId"
                aria-expanded="false"
                aria-label="Toggle navigation"
              ></button>
              <div className="collapse navbar-collapse" id="collapsibleNavId">
                <ul className="navbar-nav ms-auto justify-content-between">
                  <li className="nav-item mx-2">
                    <Link className="nav-link active" to={`/${user.role === "admin" ? "admin":"advocate"}/dashboard`}>
                      {user.email}
                    </Link>
                  </li>
                  
                  <li className="nav-item mx-2">
                    <Link className="nav-link active" to="/" onClick={handleLogout}>
                      LogOut
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>


        )
      }
      {/* <VoiceAssistant isDarkMode={isDarkMode} /> */}
    </div>

  );

    } 



import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedValue = localStorage.getItem('isLoggedIn')
    return storedValue === 'true'
  })

  const [isAdmin, setIsAdmin] = useState(() => {
    const storedValue = localStorage.getItem('isAdmin')
    return storedValue === 'true'
  })

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || ''
  })

  useEffect(() => {
    if (isLoggedIn !== null) {
      localStorage.setItem('isLoggedIn', isLoggedIn.toString())
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (isAdmin !== null) {
      localStorage.setItem('isAdmin', isAdmin.toString())
    }
  }, [isAdmin])

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail)
    }
  }, [userEmail])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

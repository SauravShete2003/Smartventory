import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface PrivateRouteProps {
  children: React.ReactElement
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useAuth()

  // Redirect to login if not authenticated
  return currentUser ? children : <Navigate to="/login" />
}

export default PrivateRoute

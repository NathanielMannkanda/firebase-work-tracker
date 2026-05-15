import { Navigate } from "react-router-dom";

function ProtectedRoute({
  user,
  allowedRole,
  role,
  children
}) {

  //if not logged in
  if (!user){
    return <Navigate to="/"/>;
  }

  //wring role
  if (allowedRole && role !== allowedRole){
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
  const email = localStorage.getItem('EmailId');
  const isAdmin = email === 'moviemadsindia@gmail.com';

  return isAdmin ? children : <Navigate to="/" />;
};

export default PrivateAdminRoute;

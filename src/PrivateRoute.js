import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/UserAuthContext';

const PrivateRoute = ({ path, element }) => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;


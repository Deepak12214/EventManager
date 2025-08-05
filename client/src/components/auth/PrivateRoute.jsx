import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute({ children }) {
  const { token, user } = useSelector((state) => state.auth);
  return token && user ? children : <Navigate to="/" replace />;
}

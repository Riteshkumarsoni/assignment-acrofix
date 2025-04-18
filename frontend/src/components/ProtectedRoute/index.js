import {Navigate} from 'react-router-dom'
import Cookie from 'js-cookie'

const ProtectedRoute = ({children}) => {
  const token = Cookie.get('jwt_token')
  return token !== undefined ? children : <Navigate to="/admin-signin" />
}

export default ProtectedRoute
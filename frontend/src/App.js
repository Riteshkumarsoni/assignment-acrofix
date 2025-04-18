import {Routes, Route, Navigate, BrowserRouter as Router} from 'react-router-dom'
import Home from './components/Home'
import OrderProduct from './components/OrderProduct'
import Order from './components/Order'
import NotFound from './components/NotFound'
import TrackOrder from './components/TrackOrder'
import AdminSignin from './components/AdminSignin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-signin" element={<AdminSignin />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/order" element={<Order />} />
      <Route path='/track-order' element={<TrackOrder />} />
      <Route path="/order/:productId" element={<OrderProduct />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path='*' element={<Navigate to="/not-found" />} />
    </Routes>
  </Router>
)

export default App
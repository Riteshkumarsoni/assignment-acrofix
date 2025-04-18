import {Link} from 'react-router-dom'
import './index.css'

const Header = () => (
    <nav className='header-bg-container'>
        <ul className='nav-item-list-container'>
            <Link to="/" className='nav-link'><li className='nav-item'>Home</li></Link>
            <Link to="/order" className='nav-link'><li className='nav-item'>Order</li></Link>
            <Link to="/track-order" className='nav-link'><li className='nav-item'>Track Order</li></Link>
            <Link to="/admin/dashboard" className='nav-link'><li className='nav-item'>Admin Dashboard</li></Link>
            <Link to="/admin-signin" className='nav-link'><li className='nav-item'>Admin Login</li></Link>
        </ul>
    </nav>
)

export default Header
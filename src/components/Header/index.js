import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogoutBtn = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/" className="icon-link">
        <img
          className="header-website-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>

      <ul className="mobile-menu-container">
        <Link to="/" className="icon-link">
          <li>
            <AiFillHome className="icon" />
          </li>
        </Link>
        <Link to="/jobs" className="icon-link">
          <li>
            <BsBriefcaseFill className="icon" />
          </li>
        </Link>
        <button
          aria-label="close"
          type="button"
          className="icon-btn"
          onClick={onClickLogoutBtn}
        >
          <li>
            <FiLogOut className="icon" />
          </li>
        </button>
      </ul>

      <div className="desktop-menu-container">
        <Link to="/" className="menu-link">
          <p className="menu-heading">Home</p>
        </Link>
        <Link to="/jobs" className="menu-link">
          <p className="menu-heading">Jobs</p>
        </Link>
      </div>

      <button type="button" className="logout-btn" onClick={onClickLogoutBtn}>
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)

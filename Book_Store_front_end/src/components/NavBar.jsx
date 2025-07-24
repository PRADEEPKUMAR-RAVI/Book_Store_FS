import React from 'react'
import { NavLink, useNavigate } from 'react-router'
import './css/NavBar.css'

export default function NavBar() {
  const navigate = useNavigate();
  function handleLogout(){
    const token = localStorage.getItem('access_token')
    if (!token) {
      alert("Login First..!!");
      return setTimeout(() => navigate('/login'), 0);
    }
    const flag = confirm("Are you LogOut ..?")
    if(flag && token){
      console.log("[Logout - process]");
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');

      navigate('/')      
    }
  }

  return (
    <div className='bar'>
        <nav className='navigation'>
            <h2>Book Store</h2>
            <div className='navi-links'>
                <NavLink to={'/'} className={({isActive})=>isActive? "active-link": ""} >Home</NavLink>
                <NavLink to={'/authors'} className={({isActive})=>isActive? "active-link": ""} >Authors</NavLink>
                <NavLink to={'/users'} className={({isActive})=>isActive? "active-link": ""} >Users</NavLink>
                <NavLink to={'/categories'} className={({isActive})=>isActive? "active-link": ""}>Categories</NavLink>
                <NavLink to={'/login'} className={({isActive})=>isActive? "active-link": ""}>Login/Register</NavLink>
                <NavLink onClick={handleLogout} >Logout</NavLink>
            </div>
        </nav>
    </div>
  )
}

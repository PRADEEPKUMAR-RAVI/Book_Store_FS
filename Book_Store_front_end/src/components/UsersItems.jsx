import React from 'react'
import { useNavigate } from 'react-router'
import './css/Users.css'

export const UsersItems = ({user}) => {
    const navigate = useNavigate();

    function handleClick(){
        navigate(`/users/${user.id}`)
    }


  return (
    <div>
        <li className='user-items-list' onClick={handleClick}>
            <h3><strong>User Name : </strong><span>{user.username}</span></h3>
            <p><strong>Email : </strong>{user.email}</p>
            <p><strong>First Name : </strong>{user.first_name}</p>
            <p><strong>Last Name : </strong>{user.last_name}</p>
            <p><strong>Review Count : </strong>{user.review_count}</p>
        </li>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router'
import { fetchUser } from '../services/UserApi';

export const UserDetails = () => {
    const {UserId} = useParams();
    const navigate = useNavigate();
    const [user,setUser] = useState(null)

    useEffect(()=>{
        const loadUser =async()=>{
            console.log("[Fetching - individual user]");
            try{
                const data = await fetchUser(UserId);
                console.log(data);
                setUser(data);
            }catch(error){
                console.error("failed to fetch",error);
                throw error;
            }
        }
        loadUser();
    },[])

    if(!user) return <p>You are not Authorized to see this <strong>User Profile</strong></p>


    function handleUpdate() {
        navigate(`/users/${UserId}/edit`)
    }

    function handleDelete(){
        pass
    }

  return (
    <div className='user-details'>
        <h2><span>{user.username}</span></h2>
        <p><strong>Email : </strong>{user.email}</p>
        <p><strong>First Name : </strong>{user.first_name}</p>
        <p><strong>Last Name : </strong>{user.last_name}</p>
        <p><strong>Review Count : </strong>{user.review_count}</p>

      <div className='details-button'>
          <NavLink className={"details-nav"} to={`/users`}>back</NavLink>
          <button className='details-nav' onClick={handleUpdate}>Update</button>
          <button className='details-nav' onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
}

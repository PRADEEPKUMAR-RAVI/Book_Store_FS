import React, { useEffect, useState } from 'react'
import { fetchUsers } from '../services/UserApi';
import { UsersItems } from '../components/UsersItems';
import '../components/css/Users.css'

export const UsersHome = () => {
    const [users,setUser] = useState([]);

    useEffect(()=>{
        const loadUsers= async()=>{
            console.log("[Fetching - Users]");
            try{
                const data = await fetchUsers();
                console.log(data);
                setUser(data);
            }catch(error){
                console.log("failed to fetch users",error);
                throw error;
            }
        }
        loadUsers();
    },[]);

  return (
    <div className='users-home'>
        <div className="user-header">
            <h2>Users List</h2>
            {/* <button>create</button> */}
        </div>
        <ul className='users-ul-list'>
            {
                users.map((user)=>(
                    <UsersItems key={user.id} user={user}/>
                ))
            }
        </ul>

    </div>
  )
}

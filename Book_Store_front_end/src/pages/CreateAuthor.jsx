import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { createAuthor } from '../services/AuthorApi';
import '../components/css/Author.css'

export const CreateAuthor = () => {

    const navigate = useNavigate();
    const [form, setForm] = useState({
        name:"",
        biography:"",
        age: 0,
        gender:"",
        country:"",
        awards:[]
    });
    const [newAward, setNewAward] = useState("");
    function addAward() {
        if (newAward.trim()) {
            setForm((f) => ({ ...f, awards: [...f.awards, newAward.trim()] }));
            setNewAward("");
        }
    }

    function removeAward(index) {
        setForm((f) => ({
            ...f,
            awards: f.awards.filter((_, i) => i !== index),
        }));
    }


    async function handleSubmit(e){
        e.preventDefault();
        try{
            const res = await createAuthor(form);
            navigate(`/authors/${res.id}`)
        }catch(error){
            console.error("create failed",error);
        }
    }

    function handleChange(e){
        const {name,type,value} = e.target;
        setForm((f)=>({...f, [name]:value}))
    }

  return (
    <div className='author-create-form'>
        <h2>Create Form</h2>
        <form onSubmit={handleSubmit}>
            <label>Author name :</label>
            <input type="text" name='name' value={form.name} onChange={handleChange} required />
            <label >Biography : </label>
            <input type="text" name='biography' value={form.biography} onChange={handleChange} />
            <label >Age : </label>
            <input type="number" name='age' value={form.age} onChange={handleChange} required />
            <label >Gender : </label>
            <input type="text" name='gender' value={form.gender} onChange={handleChange} required />
            <label >Country : </label>
            <input type="text" name='country' value={form.country} onChange={handleChange} />
            <label>Awards:</label>
            <div className="award-input-group">
            <input
                type="text"
                value={newAward}
                onChange={(e) => setNewAward(e.target.value)}
                placeholder="Enter award name"
            />
            <button type="button" onClick={addAward}>Add Award</button>
            </div>

            <ul>
            {form.awards.map((award, index) => (
                <li key={index}>
                {award}
                <button type="button" onClick={() => removeAward(index)}>❌</button>
                </li>
            ))}
            </ul>

            <button type='submit'>Create</button>
        </form>

    </div>
  )
}

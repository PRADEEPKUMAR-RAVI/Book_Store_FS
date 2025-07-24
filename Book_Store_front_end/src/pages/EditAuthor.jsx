import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { fetchAuthor } from '../services/AuthorApi';
import { updateAuthor } from '../services/AuthorApi';
import '../components/css/Author.css'

export const EditAuthor = () => {
    const{AuthorId} = useParams();
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


    useEffect(()=>{
        const loadData = async()=>{
            try{
                const author = await fetchAuthor(AuthorId);
                console.log("-------------------",author);
                setForm({   
                    name: author.name || "",
                    biography: author.biography || "",
                    age: author.age || 0,
                    gender: author.gender || "",
                    country: author.country || "",
                    awards: author.awards ? author.awards.map(c => c) : []
                })
            }catch(error){
                console.error("Error loading author",error)
            }
        }

        loadData();

    },[])

    async function handleSubmit(e){
        e.preventDefault();
        try{
            await updateAuthor(AuthorId,form);
            alert("Author Updated Successfully");
            navigate(`/authors/${AuthorId}`)
        }catch(error){
            console.error("Update failed",error);
        }
    }

    function handleChange(e){
        const {name,type,value} = e.target;
        setForm((f)=>({...f, [name]:value}))
    }

  return (
    <div className='author-create-form'>
        <h2>Author Edit</h2>
        <form action="" onSubmit={handleSubmit}>
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

            <button type='submit'>Update</button>
        </form>

    </div>
  )
}

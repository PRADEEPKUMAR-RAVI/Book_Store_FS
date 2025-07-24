import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Select from 'react-select';
import { fetchAuthors } from '../services/AuthorApi';
import { fetchCategories } from '../services/CategoryApi';
import { createBook } from '../services/BooksApi';
import '../components/css/Books.css'

export const CreateBook = () => {
    const navigate = useNavigate();
    const[form , setForm] = useState({
        name: "",
        description: "",
        author_id: "",
        category_ids: [],
        publication_date: "",
        page_count: "",
        language: "",
        is_published: false,
    });

    const[authors,setAuthors]=useState([]);
    const[categories, setCategories] = useState([]);


    useEffect(()=>{
        const loadAll=async()=>{
            try{
                const authorsData = await fetchAuthors();
                const categoriesData = await fetchCategories();
                setAuthors(authorsData);
                setCategories(categoriesData);
            }catch(error){
                console.error("Failed while fetching",error);
                throw error;
            }
        }

        loadAll()
    },[]);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const res= await createBook(form);
            console.log(res.id)
            navigate(`/books/${res.id}`)
            
            
        }catch(error){
            console.log("failed to create book",error);
            throw error;
        }
    }

    function handleChange(e){
        const {type,value,name,checked} = e.target;
        if(type=="checkbox"){
            setForm((f)=>({...f,[name]:checked}))
        }else{
            setForm((f)=>({
                ...f,[name]:value
            }))
        }
    }

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }))

    const handleCategoryChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setForm(prev => ({
            ...prev,
            category_ids: selectedIds,
        }));
    };



  return (
    <div className='Edit-form'>
        <h2>Create Book</h2>
        <form onSubmit={handleSubmit}>
            <label >Book Name :</label>
            <input type="text" name='name' value={form.name} onChange={handleChange} required />
            <label>Description :</label>
            <input type="text" name='description' value={form.description} onChange={handleChange} />
            <label >Author :</label>
            <select name="author_id" value={form.author_id} onChange={handleChange} required>
                <option value="">Select Author</option>
                {authors.map((author)=>(
                    <option key={author.id} value={author.id}>{author.name}</option>
                ))}
            </select>
            
            <label>Category :</label>
            <Select
                options={categoryOptions}
                isMulti
                value={categoryOptions.filter(option =>
                    form.category_ids.includes(option.value)
                )}
                onChange={handleCategoryChange}
                required
            />

            <label>Publication_Date : </label>
            <input type='date' name='publication_date' value={form.publication_date} onChange={handleChange}/>
            <label>Page_Count : </label>
            <input type="number" name='page_count' value={form.page_count} onChange={handleChange} />
            <label> Language : </label>
            <input type="text" name='language' value={form.language} onChange={handleChange} />
            <label >
                <input type="checkbox" name='is_published' checked={form.is_published} onChange={handleChange} />
                Published
            </label>

            <button type='submit'>Create</button>
            
        </form>
    </div>
  )
}

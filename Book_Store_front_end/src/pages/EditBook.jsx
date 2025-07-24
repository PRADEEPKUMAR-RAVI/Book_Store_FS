import React, { useState,useEffect } from 'react'
import Select from 'react-select';
import '../components/css/Books.css'
import { useNavigate, useParams } from 'react-router'
import { updateBook } from '../services/BooksApi'
import {fetchBook} from '../services/BooksApi'
import { fetchAuthors } from '../services/AuthorApi'
import { fetchCategories } from '../services/CategoryApi'

export const EditBook = () => {
    const{BookId} = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: "",
        description: "",
        author_id: "",
        category_ids: [],
        publication_date: "",
        page_count: "",
        language: "",
        is_published: false,
    });

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadAll = async () => {
            try {
            const book = await fetchBook(BookId);
            const authorsData = await fetchAuthors();
            const categoriesData = await fetchCategories();

            setAuthors(authorsData);
            setCategories(categoriesData);

            setForm({
                name: book.name || "",
                description: book.description || "",
                author_id: book.author?.id || "",
                category_ids: book.categories?.map(c => c.id) || [],
                publication_date: book.publication_date || "",
                page_count: book.page_count || "",
                language: book.language || "",
                is_published: book.is_published || false,
            });
            } catch (err) {
            console.error("Error loading book or options", err);
            }
        };

        loadAll();
        }, [BookId]);

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }));

    const handleCategoryChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setForm(prev => ({
            ...prev,
            category_ids: selectedIds,
        }));
    };

    function handleChange(e){
        const {name,type,value,checked} = e.target;
        if(type == 'checkbox'){
            setForm((f)=> ({...f,[name]:checked}))
        }else{
            setForm((f)=> ({...f,[name]:value}))
        }
    }
                                                                                                            
    async function handleSubmit(e){                                                           
        e.preventDefault();
        try{
            await updateBook(BookId,form);
            alert("Book Updated Successfully!");
            navigate(`/books/${BookId}`)
        }catch(error){
            console.error("Update failed",error)
        }
    }



    if(!form) return <p>Nothing to load....</p>
  return (
    <div className='Edit-form'>
        <h2>Edit Book</h2>
        <form action="" onSubmit={handleSubmit}>
            <label>Book name :</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}  required /> <br />
            <label >Description : </label>
            <textarea  name='description' value={form.description} onChange={handleChange} />
            <label>Author : </label>
            <select name="author_id" value={form.author_id} onChange={handleChange}>
                <option value="">Select Author</option>
                {authors.map((author)=>(
                    <option key={author.id} value={author.id}>{author.name}</option>
                ))}
            </select>
            <label>Category : </label>
            <Select
                options={categoryOptions}
                isMulti
                value={categoryOptions.filter(option =>
                    form.category_ids.includes(option.value)
                )}
                onChange={handleCategoryChange}
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

            <button type='submit'>Update</button>
        </form>

    </div>
  )
}

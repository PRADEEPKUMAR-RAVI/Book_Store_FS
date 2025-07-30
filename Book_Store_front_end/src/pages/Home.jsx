import React, { useEffect, useState } from 'react'
import { fetchBooks } from '../services/BooksApi';
import {BookItems} from '../components/BookItems'
import { Outlet, useNavigate } from 'react-router';
import {fetchAuthors} from '../services/AuthorApi';
import {fetchCategories} from '../services/CategoryApi';


export const Home = () => {
    const navigate = useNavigate()
    const [books, setBooks] = useState([]);
    const [author, setAuthor] = useState([]);
    const [category, setCategory] = useState([]);
    const [published, setPublished] = useState("None");
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    
    useEffect(()=>{
        console.log("[fetching author and category]")
        const fetchAuthorAndCategory = async () => {
            try {
                const authors = await fetchAuthors();
                const categories = await fetchCategories();
                setAuthor(authors);
                setCategory(categories);
            } catch (error) {
                console.log("Failed to fetch authors or categories", error);
            }
        };
        fetchAuthorAndCategory();
    }, []);


    useEffect(()=>{
        console.log("[useEffects run -fetching books]")
        const loadBooks = async()=>{
            try {
                const data = await fetchBooks(
                    {published, author:selectedAuthor, category:selectedCategory, page, pageSize}
                );
                console.log(data)
                setBooks(data.results)
            }catch(error){
                console.log("failed to fetch books",error)
                throw error
            }
        }
        loadBooks()
    },[selectedAuthor, selectedCategory, published, page, pageSize])

    function handleCreate(){
        navigate("books/create")
    }


  return (
    <div className='home-page'>
        <div className='home-head'>
            <h2>Book List</h2>
            <button onClick={handleCreate}>Create</button>
        </div>
        <div className='home-filter'>
            <h3>Filter Books</h3>
            <select value={published} onChange={(e)=>setPublished(e.target.value)}>
                <option value="None">None</option>
                <option value="Published">Published</option>
                <option value="Non-Published">Non-Published</option>
            </select>

            <select value={selectedAuthor} onChange={(e)=>setSelectedAuthor(e.target.value)}>
                <option value="">All Authors</option>
                {author.map((auth) => (
                    <option key={auth.id} value={auth.id}>{auth.name}</option>
                ))}
            </select>

            <select value={selectedCategory} onChange={(e)=>setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {category.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>

            <button onClick={() => {
                setPublished("None");
                setSelectedAuthor("");
                setSelectedCategory("");
                }}>
                Clear Filters
            </button>
        </div>
        <ul className='book-ul-list'>
            {books.map((book)=>{
                return <BookItems key={book.id} book={book}/>
            })}
        </ul>
        <footer className='home-footer'>
            <div >
                <p>Total Books: {books.length}</p>
                <div>
                    <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                    <button>Page:{page}</button>
                    <button onClick={() => setPage(page + 1)} disabled={books.length < pageSize}>Next</button>
                </div>
            </div>

        </footer>

    </div>
  )
}

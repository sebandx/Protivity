import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksCard from '../components/home/BooksCard';
import TotalDurations from '../components/TotalDurations'; // Import the component

const Home = () => {
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/books')
      .then((response) => {
        setBooks(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Extract subjects from books data
  const subjects = [...new Set(books.map(book => book.title))];
  
  return (
    
    <div className='p-4'>
      
      <div className='flex justify-between items-center'>
        
        <Link to='/books/create'>
          <MdOutlineAddBox className='text-blue-300 text-4xl' />
        </Link>
      </div>
      <h1 className='text-center text-5xl my-4'>Protivity</h1>
      <h2 className='text-center text-xl my-4'>Time | Visualized</h2>

      {/* Render TotalDurations component if not loading and subjects are available */}
      {!loading && subjects.length > 0 && (
        <TotalDurations subjects={subjects} />
      )}
      <h1 className='text-3xl my-8'>Tasks List</h1>
      <BooksCard books={books} />
    </div>
  );
};

export default Home;

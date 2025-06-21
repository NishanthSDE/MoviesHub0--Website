import './Navbar.css'
import DarkMode from '../DarkMode/DarkMode'


import { useState } from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return <nav className='navbar'> 
      <h1> MoviesHub</h1>

      <div className='navbar_links'>
         <DarkMode />
         <Link to="/popular" className="navbar_link">
           Popular   
         </Link>
         <Link to="/top_rated" className="navbar_link">
           Top Rated  
         </Link>
         <Link to="/upcoming" className="navbar_link">
           Upcoming 
         </Link>

         <div>
           <button className="hamburger-button" aria-label="Toggle sidebar" onClick={toggleSidebar}>
             <span></span>
             <span></span>
             <span></span>
           </button>
         </div>
      </div>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-button" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>×</button>
        <h3>Movie Categories</h3>
        <Link to="/all" onClick={() => setSidebarOpen(false)}>All</Link>
        <Link to="/now_playing" onClick={() => setSidebarOpen(false)}>Now Playing</Link>
        <Link to="/popular" onClick={() => setSidebarOpen(false)}>Popular</Link>
        <Link to="/top_rated" onClick={() => setSidebarOpen(false)}>Top Rated</Link>
        <Link to="/upcoming" onClick={() => setSidebarOpen(false)}>Upcoming</Link>
        <Link to="/favorite" onClick={() => setSidebarOpen(false)}>Favorite</Link>
          <h3>Anime Categories</h3>
        <Link to="/anime" onClick={() => setSidebarOpen(false)}>Anime</Link>
        <Link to="/anime/popular" onClick={() => setSidebarOpen(false)}>Popular</Link>
        <Link to="/anime/seasonal" onClick={() => setSidebarOpen(false)}>Seasonal</Link>
        <Link to="/anime/favorite" onClick={() => setSidebarOpen(false)}>Favorite</Link>
        <h3>Manga Categories</h3>
        <Link to="/manga" onClick={() => setSidebarOpen(false)}>Manga</Link>
        <Link to="/manga/popular" onClick={() => setSidebarOpen(false)}>Popular</Link>
        <Link to="/manga/seasonal" onClick={() => setSidebarOpen(false)}>Publishing</Link>
        <Link to="/manga/favorite" onClick={() => setSidebarOpen(false)}>Favorite</Link>

      </div>
   </nav>
}

export default Navbar

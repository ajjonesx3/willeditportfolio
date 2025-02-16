import logo from './logo.svg';
import './App.css';
import { HashRouter as Router, Routes, Route, Link} from 'react-router-dom';
import AddArt from './AddArt/AddArt.js';
import AddBlogPost from './AddBlogPost/AddBlogPost.js';
import Token from './Token.js'
import {useState,useEffect} from 'react';

function App() {

  const [token, setToken] = useState();

  const mainPage =
  <ul className = "options">
    <Link className="option" to="/AddArt">Add art</Link>
    <Link className="option" to="/AddBlogPost">Add blog post</Link>
  </ul> 
  
  return (
    <Router>
      <div className="App">
        <div className="main">
          <Routes>
            <Route path="/token" element={<Token setToken={setToken}/>} />
            <Route path="/" element={token ? mainPage : <h2 style={{textAlign:'center'}}>No token</h2>} />
            <Route path="/AddArt" element={<AddArt token={token}/>} />
            <Route path="/AddBlogPost" element={<AddBlogPost token={token}/>} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;
<li><Link to="/storyboarding">Storyboarding</Link></li>
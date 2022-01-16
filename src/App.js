import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import youtube from './apis/youtube'

function App() {

  const handleSubmit = e => {
    e.preventDefault()
    console.log('hi')
    youtube.get('/commentThreads', {
      params: {
        // q: 'cats'
        videoId: '6tPTrgGptU0'

      }
    }).then(response => {
      console.log(response)
    })

  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to YouTube comment section analysis 
        </p>
      </header>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <h1>URL Form</h1>
          <div className='ui-form'>
            <label>
              URL: <input type="text" url="url" placeholder='Video URL'/>
            </label>
            <input type="submit" value="Submit"/>
          </div>
        </form>

      </div>
      <footer>
        <p>footer</p>
      </footer>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import youtube from './apis/youtube'

function App() {

  const [url, setUrl] = useState("")
  const [comments, setComments] = useState([])

  const handleSubmit = e => {
    e.preventDefault() 
    setComments([]) // Clear old comment list
    youtube.get('/commentThreads', {
      params: {
        order: 'relevance',
        videoId: url
      }
    }).then(response => {
      let items = response.data.items
      items.forEach(item => {
        const commentText = item.snippet.topLevelComment.snippet.textDisplay
        setComments(comments => [...comments, commentText])
      })
    })
  }

  const commentList = comments.map((comment)=>{
    return <li>{comment}</li>;
  })

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
              Video ID: <input type="text" url="url" placeholder='Video URL' onChange={e => setUrl(e.target.value)}/>
            </label>
            <input type="submit" value="Submit"/>
          </div>
        </form>
      </div>
      <ul>{commentList}</ul>
      <footer>
        <p>footer</p>
      </footer>
    </div>
  );
}

export default App;

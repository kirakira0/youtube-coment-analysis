import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import youtube from './youtube'

//console.log(process.env.REACT_APP_RAPID_API_KEY)

function App() {

  const [url, setUrl] = useState("")
  const [comments, setComments] = useState([])

  const handleSubmit = e => {
    e.preventDefault()
    
    console.log(url)
    youtube.get('/commentThreads', {
      params: {
        videoId: url
      }
    }).then(response => {
      let items = response.data.items
      console.log(response.data)
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
        <form>
          <h1>URL Form</h1>
          <div className='ui-form'>
            <label>
              Video ID: <input type="text" url="url" placeholder='Video URL' onChange={e => setUrl(e.target.value)}/>
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
import './App.css';
import { useState } from 'react';
import youtube from './apis/youtube'
import React from 'react';
import axios from 'axios'

export const PERSPECTIVE_API_URL =
"https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyA5Ias9x-m6MyfClOkiY5gmQSQ2DKJQz7w";

function App() {

  const checkComment = comment => {
    axios
      .post(PERSPECTIVE_API_URL, {
        comment: {
          text: comment
        },
        languages: ["en"],
        requestedAttributes: {
          TOXICITY: {},
          INSULT: {},
          FLIRTATION: {},
          THREAT: {}
        }
      })
      .then(res => {
        console.log(res);
      })
      .catch(() => {
        // The perspective request failed, put some defensive logic here!
      });
  };

  checkComment("shut up and go make me a sandwich stupid bitch")



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
      console.log(response)
      items.forEach(item => {
        const commentText = item.snippet.topLevelComment.snippet.textDisplay
        setComments(comments => [...comments, commentText])
      })
    })
  }

  const commentList = comments.map((comment)=>{
    return <li key={comment}>{comment}</li>;
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

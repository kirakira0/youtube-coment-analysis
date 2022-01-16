import './App.css';
import { useState } from 'react';
import youtube from './apis/youtube'
import React from 'react';
import axios from 'axios'

export const PERSPECTIVE_API_URL =
"https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=" + process.env.REACT_APP_GOOGLE_API_KEY

function App() {

  const [numComments, setNumComments] = useState(0)
  const [toxicityScore, setToxicityScore] = useState(0)


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
          SEXUALLY_EXPLICIT: {},
          IDENTITY_ATTACK: {},
          THREAT: {}
        }
      })
      .then(res => {
        // ADD TO SCORES
        let toxicity = res.data.attributeScores.TOXICITY.summaryScore.value
        // console.log(toxicity)
        setToxicityScore(toxicityScore => toxicityScore + toxicity)
      })
      .catch(() => {
        // The perspective request failed, put some defensive logic here!
      })
  }

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
      console.log('Number of comments', items.length)
      setNumComments(items.length)
      items.forEach(item => {
        // For each comment
        const commentText = item.snippet.topLevelComment.snippet.textDisplay
        checkComment(commentText)

        setComments(comments => [...comments, commentText])
      })
      // AFTER ALL SCORES ARE ADDED, DIVIDE TO GET AVERAGES 
      // console.log("AVERAGE TOXICITY SCORE = " + toxicityScore/numComments)
      console.log(toxicityScore)

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
        <p>Average Toxicity Score: </p>
        {toxicityScore/numComments}
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
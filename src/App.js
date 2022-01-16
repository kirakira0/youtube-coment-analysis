import './App.css';
import { useState } from 'react';
import youtube from './apis/youtube'
import React from 'react';
import axios from 'axios'

import Chart from "react-apexcharts";

export const PERSPECTIVE_API_URL =
"https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=" + process.env.REACT_APP_GOOGLE_API_KEY

function App() {

  const [numComments, setNumComments] = useState(0)
  const [toxicitySum, setToxicitySum] = useState(0)
  const [insultSum, setInsultSum] = useState(0)
  const [sexuallyExplicitSum, setSexuallyExplicitSum] = useState(0)
  const [identityAttackSum, setIdentityAttackSum] = useState(0)
  const [threatSum, setThreatSum] = useState(0)
  const [toxicityScore, setToxicityScore] = useState([])
  const [insultScore, setInsultScore] = useState([])
  const [sexuallyExplicitScore, setSexuallyExplicitScore] = useState([])
  const [identityAttackScore, setIdentityAttackScore] = useState([])
  const [threatScore, setThreatScore] = useState([])

  const series = []

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
        let insult = res.data.attributeScores.INSULT.summaryScore.value
        let sexuallyExplicit = res.data.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value
        let identityAttack = res.data.attributeScores.IDENTITY_ATTACK.summaryScore.value
        let threat = res.data.attributeScores.THREAT.summaryScore.value

        setToxicitySum(setToxicitySum => setToxicitySum + toxicity)
        setInsultSum(setInsultSum => setInsultSum + insult)
        setSexuallyExplicitSum(setSexuallyExplicitSum => setSexuallyExplicitSum + sexuallyExplicit)
        setIdentityAttackSum(setIdentityAttackSum => identityAttackScore + identityAttack)
        setThreatSum(setThreatSum => setThreatSum + threat)
        
        setToxicityScore(toxicityScore => [...toxicityScore, toxicity])
        setInsultScore(insultScore => [...insultScore,  insult])
        setSexuallyExplicitScore(sexuallyExplicitScore => [...sexuallyExplicitScore, sexuallyExplicit])
        setIdentityAttackScore(identityAttackScore => [...identityAttackScore, identityAttack])
        setThreatScore(threatScore => [...threatScore, threat])

      })
      .catch(() => {
        // The perspective request failed, put some defensive logic here!
      })
  }

  const options = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
          },
          value: {
            fontSize: '16px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return 10
            }
          }
        }
      }
    },
    labels: ['Toxicity', 'Insult', 'Sexual Content', 'Identity Attack', 'Threat'],
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

      // sort comments to get median
      setToxicityScore(toxicityScore => toxicityScore.sort())
      setInsultScore(insultScore => insultScore.sort())
      setSexuallyExplicitScore(sexuallyExlicitScore => sexuallyExlicitScore.sort())
      setIdentityAttackScore(identityAttackScore => identityAttackScore.sort())
      setThreatScore(threatScore => threatScore.sort())

      // const series = [
      //   toxicitySum/numComments, 
      //   insultSum/numComments, 
      //   sexuallyExplicitSum/numComments, 
      //   identityAttackSum/numComments, 
      //   threatSum/numComments
      // ]

    })
  }

  const commentList = comments.map((comment)=>{

    return <li key={comment}>{comment}</li>;
  })

  return (
    <div className="App">
      <header className="App-header">
      <div id="chart">
        <Chart 
          options={options} 
          series={[
            toxicityScore[Math.floor(numComments/2)] * 100,
            insultScore[Math.floor(numComments/2)] * 100,
            sexuallyExplicitScore[Math.floor(numComments/2)] * 100,
            identityAttackScore[Math.floor(numComments/2)] * 100,
            threatScore[Math.floor(numComments/2)] * 100,
          ]} 
          type="radialBar" 
          height={350} 
        />
      </div>
        <p>
          Welcome to YouTube comment section analysis 
        </p> 
        {/* <p>Average Scores</p>
        <p>Toxicity {toxicityScore/numComments}</p>
        <p>Insult {insultScore/numComments}</p>
        <p>Sexually Explicit {sexuallyExplicitScore/numComments}</p>
       <p>Identity Attack {identityAttackScore/numComments}</p>
        <p>Threat {threatScore/numComments}</p> */}
        <p>Average Scores</p>
        <p>Toxicity {toxicityScore[Math.floor(numComments/2)]}</p>
        <p>Insult {insultScore[Math.floor(numComments/2)]}</p>
        <p>Sexually Explicit {sexuallyExplicitScore[Math.floor(numComments/2)]}</p>
        <p>Identity Attack {identityAttackScore[Math.floor(numComments/2)]}</p>
        <p>Threat {threatScore[Math.floor(numComments/2)]}</p>

        
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
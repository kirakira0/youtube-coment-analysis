import './App.css';
import { useState } from 'react'
import youtube from './apis/youtube'
import React from 'react'
import axios from 'axios'

import LeftNavbar from './components/LeftNavbar'

import Chart from "react-apexcharts";
import Navbar from './components/LeftNavbar';
import { Input } from '@mui/material';

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
  let type = 0

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

        // keep track of sum
        setToxicitySum(toxicitySum => toxicitySum + toxicity)
        setInsultSum(insultSum => insultSum + insult)
        setSexuallyExplicitSum(sexuallyExplicitSum => sexuallyExplicitSum + sexuallyExplicit)
        setIdentityAttackSum(identityAttackSum => identityAttackSum + identityAttack)
        setThreatSum(threatSum => threatSum + threat)
        
        // add to list
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
            opacity: 0.5
          }
        }
      }
    },
    labels: ['Toxicity', 'Insult', 'Sexual Content', 'Identity Attack', 'Threat'],
  }

  const [url, setUrl] = useState("")
  const [comments, setComments] = useState([])


  // const handleRadio = e => {
  //   e.preventDefault
  //   console.log("OK")

  // }



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

      // sort comments to get median later
      setToxicityScore(toxicityScore => toxicityScore.sort())
      setInsultScore(insultScore => insultScore.sort())
      setSexuallyExplicitScore(sexuallyExlicitScore => sexuallyExlicitScore.sort())
      setIdentityAttackScore(identityAttackScore => identityAttackScore.sort())
      setThreatScore(threatScore => threatScore.sort())

    })

    fillGraph()

  }

  const commentList = comments.map((comment)=>{

    return <li key={comment}>{comment}</li>;
  })


  const [metric, setMetric] = useState('median')
  const [series, setSeries] = useState([0, 0, 0, 0])

  const handleRadio = (event) => {
     setMetric(event.target.value)
     console.log(event.target.value)
     fillGraph()
  }

  function fillGraph() {
     if (metric === "median") {
      setSeries([
        // toxicityScore[Math.floor(numComments/2)] * 100,
        insultScore[Math.floor(numComments/2)] * 100,
        sexuallyExplicitScore[Math.floor(numComments/2)] * 100,
        identityAttackScore[Math.floor(numComments/2)] * 100,
        threatScore[Math.floor(numComments/2)] * 100,
      ])
     }
     else {
       setSeries([
        // toxicitySum/numComments * 100,
        insultSum/numComments * 100,
        sexuallyExplicitSum/numComments * 100,
        identityAttackSum/numComments * 100,
        threatSum/numComments * 100
      ])
     }

     
   }

  return (
    <div className="App">
      <LeftNavbar />
      <div id="chart">
        <Chart 
          options={options} 
          series={series} 
          type="radialBar" 
          height={350} 
        />
      </div>
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <h1>URL Form</h1>
          <div className='ui-form'>
            <label>
              Video ID: <input type="text" url="url" placeholder='Video URL' onChange={e => setUrl(e.target.value)}/>
            </label>
            <div>
            <p>Metric</p>
              <input type="radio" value="median" checked={metric === 'median'} onChange={handleRadio}/> Median
              <input type="radio" value="mean" checked={metric === 'mean'} onChange={handleRadio}
              /> Mean
            </div>
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
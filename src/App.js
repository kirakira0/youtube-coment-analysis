import './App.css';
import { useState } from 'react'
import youtube from './apis/youtube'
import React from 'react'
import axios from 'axios'

import LeftNavbar from './components/LeftNavbar'

import Chart from "react-apexcharts";
import Navbar from './components/LeftNavbar';

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
  const [metric, setMetric] = useState('median')
  const [series, setSeries] = useState([0, 0, 0, 0])
  const [overallToxicity, setOverallToxicity] = useState(0.0)

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
    labels: ['Insult', 'Sexual Content', 'Identity Attack', 'Threat'],
  }

  const [url, setUrl] = useState("")
  const [comments, setComments] = useState([])


  const handleSubmit = e => {
    const userUrl = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1];
    e.preventDefault() 
    setComments([]) // Clear old comment list
    youtube.get('/commentThreads', {
      params: {
        order: 'relevance',
        videoId: userUrl
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
  }

  return (
    <div className="App">
      <div className="page">
        <LeftNavbar />
        <div className = "main">
          <form className="form" onSubmit={handleSubmit}>
            <h4>Paste Your YouTube Video Link Here </h4>
            <p>SentiCom uses Google's YouTube API to fetch publicly available comment data, Perspective to run sentiment and toxicity analysis on those comments, and ApexCharts to present a graphical representation of the data.</p>
            <div className='ui-form'>
              <label>
                <input type="text" url="url" placeholder='Video URL' onChange={e => setUrl(e.target.value)}/>
              </label>
              <p></p>
              <input type="submit" value="Submit"/>
            </div>
          </form>
          <div className='graphs'>
            <div className = 'median'>
              <h2>Median Scores</h2>
              <div id="chart">
                <Chart 
                  options={options} 
                  series={[
                    Math.floor(insultScore[Math.floor(numComments/2)] * 100),
                    Math.floor(sexuallyExplicitScore[Math.floor(numComments/2)] * 100),
                    Math.floor(identityAttackScore[Math.floor(numComments/2)] * 100),
                    Math.floor(threatScore[Math.floor(numComments/2)] * 100),
                  ]} 
                  type="radialBar" 
                  height={350} 
                />
              </div>
              <h4>Comment Section Toxicity: </h4> 
              <h3>{Math.floor(toxicityScore[Math.floor(numComments/2)] * 100)}</h3>    
            </div>
            <div className = 'mean'>
              <h2>Mean Scores</h2>
              <div id="chart">
                <Chart 
                  options={options} 
                  series={[
                    Math.floor(insultSum/numComments * 100),
                    Math.floor(sexuallyExplicitSum/numComments * 100),
                    Math.floor(identityAttackSum/numComments * 100),
                    Math.floor(threatSum/numComments * 100)
                  ]} 
                  type="radialBar" 
                  height={350} 
                />
              </div>
              <h4>Comment Section Toxicity: </h4>
              <h3>{Math.floor(toxicitySum/numComments * 100)}</h3>         
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
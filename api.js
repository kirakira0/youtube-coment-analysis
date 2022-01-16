const PORT = 8000
const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()

app.use(cors())

app.get('/', (req,res) => {
    res.json('hi')
})


app.get('/perspective', (req,res) => {
    const options = {
        method: 'GET',
        url: 'https://developers.perspectiveapi.com/s/',
        headers: {
            'x-rapidapi-host' : 'developers.perspectiveapi.com',
            'x-rapidapi-key': ProcessingInstruction.env.REACT_APP_RAPID_API_KEY
        }
    }

    axios.request(options).then((response) => {
        res.json(response.data)
    }).catch((error) => {
        console.error(error)
    })
})

app.get('/google', (req,res) => {
    const options = {
        method: 'GET',
        url: 'https://developers.google.com/youtube/v3',
        headers: {
            'x-rapidapi-host' : 'developers.google.com',
            'x-rapidapi-key': ProcessingInstruction.env.REACT_APP_RAPID_API_KEY
        }
    }

    axios.request(options).then((response) => {
        res.json(response.data)
    }).catch((error) => {
        console.error(error)
    })
    
})

app.listen(8000, () => console.log('Server is running'))
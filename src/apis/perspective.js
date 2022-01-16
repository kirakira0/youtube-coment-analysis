import axios from 'axios'

export default axios.create({
    baseURL: 'https://commentanalyzer.googleapis.com/',
    params: {
        part: 'snippet',
        // videoId: 'OSI6JJaz35I',
        maxResults: 100,
        key: "AIzaSyA5Ias9x-m6MyfClOkiY5gmQSQ2DKJQz7w"
    }
})
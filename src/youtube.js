import axios from 'axios'

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params: {
        part: 'snippet',
        // videoId: 'OSI6JJaz35I',
        maxResults: 100,
        key: process.env.REACT_APP_RAPID_API_KEY
    }
})
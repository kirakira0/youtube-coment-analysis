import axios from 'axios'
const API_KEY = 'AIzaSyAXoN4tx7JrHdanpVmy2AIgyiM_aCO08OQ'

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params: {
        part: 'snippet',
        // videoId: 'OSI6JJaz35I',
        maxResults: 5,
        key: API_KEY
    }
})
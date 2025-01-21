import axios, {Axios} from 'axios';

const baseUrl = 'http://127.0.0.1:8000/'

const AxiosCalendarInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",

    }
})

export default AxiosCalendarInstance;
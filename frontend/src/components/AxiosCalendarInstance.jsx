import axios, {Axios} from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AxiosCalendarInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",

    }
})

export default AxiosCalendarInstance;
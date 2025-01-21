import axios, {Axios} from 'axios';

const baseUrl = 'http://127.0.0.1:8000/'

const AxiosUserInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",

    }
})

AxiosUserInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('Token')

        if(token){
            config.headers.Authorization = `Token ${token}`
        }
        else{
            config.headers.Authorization = ``
        }
        return config
    }
)

AxiosUserInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if(error.response && error.response.status === 401){
            localStorage.removeItem('Token')
        }
    }
)

export default AxiosUserInstance;
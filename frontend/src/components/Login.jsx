import '../App.css'
import Box from '@mui/material/Box'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'
import {Link} from 'react-router-dom'
import {set, useForm} from 'react-hook-form'
import AxiosUserInstance from './AxiosUserInstance'
import { useNavigate } from 'react-router-dom'
import {useState} from 'react'
import MyMessage from './Message'

const Login = () => {
    const navigate = useNavigate()
    const {handleSubmit, control} = useForm()
    const [showMessage, setShowMessage] = useState(false)
    const submission = (data) => {
        AxiosUserInstance.post(`users/login/`, {
            email: data.email,
            password: data.password,
        })

        .then((response) => {
            console.log(response)
            localStorage.setItem('Token', response.data.token)
            navigate('/home')

        })
        .catch((error) => {
            setShowMessage(true)
            console.error("Error during login", error)
        })
    }
    
    return(
        <div className={"myBackground"}>
            {showMessage ? <MyMessage text={"Login failed. Please try again."} color={"red"}/> : null}
            <form onSubmit={handleSubmit(submission)}>
                <Box className={"whiteBox"}>
                    <Box className={"itemBox"}>
                        <Box className={"title"}>Login</Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyTextField label={"Email"} name={"email"} control={control}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPassField label={"Password"} name={"password"} control={control}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyButton label={"Login"} type={"submit"}/>
                    </Box>
                    <Box className={"itemBox"} sx={{flexDirection:'column'}}>
                        <Link to="/register">Don't have an account? Register here</Link>
                    </Box>
                </Box>
            </form>
        </div>
    )
}

export default Login
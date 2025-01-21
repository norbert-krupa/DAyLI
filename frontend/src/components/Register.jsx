import '../App.css'
import Box from '@mui/material/Box'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import AxiosUserInstance from './AxiosUserInstance'
import { useNavigate } from 'react-router-dom'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'


const Register = () => {
    const navigate = useNavigate()
    const schema = yup.object({
        username: yup.string()
            .required('Username is required')
            .min(4, 'Username must be at least 4 characters long')
            .max(150, 'Username cannot be more than 150 characters long'),
        email: yup.string()
            .required('Email is required')
            .email('Not a valid email address'),
        password: yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
        password2: yup.string()
            .required('Confirm Password required')
            .oneOf([yup.ref('password'), null], 'Passwords do not match')
    })

    const {handleSubmit, control} = useForm({resolver: yupResolver(schema)})


    const submission = (data) => {
        AxiosUserInstance.post(`users/register/`, {
            username: data.username,
            email: data.email,
            password: data.password,
        })

        .then(() => {
            navigate('/')
        }
        )
    }

    return(
        <div className={"myBackground"}>

            <form onSubmit={handleSubmit(submission)}>
                <Box className={"whiteBox"}>
                    <Box className={"itemBox"}>
                        <Box className={"title"}>Registration</Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyTextField label={"Username"} name={"username"} control={control}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyTextField label={"Email"} name={"email"} control={control}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPassField label={"Password"}  name={"password"} control={control}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPassField label={"Confirm Password"} name={"password2"} control={control}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyButton type={"submit"} label={"Register"}/>
                    </Box>
                    <Box className={"itemBox"}>
                        <Link to="/" className={"myLink"}>Already registered? Login here</Link>
                    </Box>
                </Box>
            </form>
        </div>
    )
}

export default Register
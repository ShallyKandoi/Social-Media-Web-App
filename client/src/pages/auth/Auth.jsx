import React, {useState} from 'react'
import './Auth.css'
import Logo from '../../img/logo.png'
import {useDispatch, useSelector} from 'react-redux'
import { logIn, signUp } from '../../action/AuthAction'

const Auth = () => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.authReducer.loading);
    const [isLogin, setIsLogin] = useState(true);
    const [data, setData] = useState({firstname: '', lastname: '', username: '', password: '', confirmpass: ''});
    console.log(loading);
    const [confirmPass, setConfirmPass] = useState(true);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData({...data, [name]: value});
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        if(!isLogin){
            if(data.password !== data.confirmpass){
                setConfirmPass(false);
                setData({...data, confirmpass: ''});
            }
            else{
                setConfirmPass(true);
                dispatch(signUp(data)); // dispatch action is signUp
                // console.log(data);
            }
        }
        else{
            dispatch(logIn(data)); // dispatch action is logIn
        }
    }
    const resetForm = () => {
        setConfirmPass(true);
        setData({firstname: '', lastname: '', username: '', password: '', confirmpass: ''});
    }

  return (
    <div className='Auth'>

        {/* leftside */}
        <div className='AuthLeft'>
            <img src={Logo} alt="" />
            <div className="name">
                <h1>Sociolo</h1>
                <h6>Expand your circle</h6>
            </div>
        </div>

        {/* rightside */}
        <div className="AuthRight">
            <form className="infoForm" onSubmit={handleSubmit}>
                <h3>{isLogin? "Log In" : "Sign Up"}</h3>
                {!isLogin && 
                    <div>
                        <input type="text" placeholder='First Name' className='input' name='firstname' onChange={handleChange} value={data.firstname}/>
                        <input type="text" placeholder='Last Name' className='input' name='lastname' onChange={handleChange} value={data.lastname}/>
                    </div>
                }

                <div>
                    <input type="text" placeholder='Username' className='input' name='username' onChange={handleChange} value={data.username}/>
                </div>

                <div>
                    <input type="password" placeholder='Password' className="input" name='password' onChange={handleChange} value={data.password}/>
                    {!isLogin && 
                        <input type="password" placeholder='Confirm Password' className="input" name='confirmpass' onChange={handleChange} value={data.confirmpass}/>
                    }
                </div>
                <span style={{display: confirmPass? 'none' : 'block' , color: 'red', fontSize: '12px', alignSelf: 'flex-end', marginRight: '5px'}}>Passwords do not match </span>

                <div>
                    <span style={{fontSize: '12px', cursor:"pointer"}} onClick={() => {setIsLogin(!isLogin);resetForm()}}>{isLogin? "Don't have an account? Sign Up" : "Already have an account? Login"}</span>
                </div>

                <button className="button auth-button" type='submit' disabled={loading} >
                    {loading? "Loading..." : isLogin ? "Login" : "Signup"}
                </button>
            </form>
        </div>

    </div>
  )
}

export default Auth

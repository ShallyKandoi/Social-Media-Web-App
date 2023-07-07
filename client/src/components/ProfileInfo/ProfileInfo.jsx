import React, {useEffect, useState} from 'react'
import './ProfileInfo.css'
import { UilPen } from '@iconscout/react-unicons'
import ProfileModal from '../ProfileModal/ProfileModal'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import * as UserApi from '../../api/UserRequest.js'
import { logOut } from '../../action/AuthAction'

const ProfileInfo = () => {

    const [modalOpen, setModalOpen] = useState(false)

    const dispatch = useDispatch()
    const params = useParams()
    const profileUserId = params.id
    const [profileUser, setProfileUser] = useState({})
    const {user} = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        const fetchprofileUser = async () => {
            if(profileUserId === user._id) //user._id is global user id
            {
                setProfileUser(user)
                // console.log(user)
            }
            else{
                const profileUser = await UserApi.getUser(profileUserId)
                setProfileUser(profileUser)
                // console.log(profileUser)
            }
        }
        fetchprofileUser();
    },[user]) //dependency array, i.e. if user is changed in the react redux, then useEffect will be called only that time

    const handleLogout = () => {
        dispatch(logOut())
    }

  return (
    <div className='InfoCard'>
        <div className='Head'>
            <h4>Profile Info</h4>
            {user._id === profileUserId? 
                (<div>
                    <UilPen width='2rem' height='1.2rem' cursor='pointer' onClick={()=>setModalOpen(true)}/>
                    <ProfileModal modalOpen={modalOpen} setModalOpen={setModalOpen} data={user}/>
                </div>) : ""}
        </div>
        <div className="info">
            <span>
                <b>Age: </b>
            </span>
            <span>{profileUser.age? profileUser.age : 20}</span>
        </div>
        <div className="info">
            <span>
                <b>Lives in: </b>
            </span>
            <span>{profileUser.livesin? profileUser.livesin : "Hyderabad"}</span>
        </div>
        <div className="info">
            <span>
                <b>Employment Status: </b>
            </span>
            <span>{profileUser.employstatus? profileUser.employstatus : "Student"}</span>
        </div>

        <button className='button l-button' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default ProfileInfo

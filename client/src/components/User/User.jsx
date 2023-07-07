import React, { useState } from 'react'
import './User.css'
import {useDispatch, useSelector} from 'react-redux'
import { followUser, unfollowUser } from '../../action/userAction';

const User = ({person}) => {
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.authReducer.authData);
    const [following, setFollowing] = useState(person.followers.includes(user._id));
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;  //stores url of server side
    const handleFollow = () => {
        following? dispatch(unfollowUser(person._id, user)) : dispatch(followUser(person._id, user))
        setFollowing(!following);
    }

  return (
    <div className="follower">
        <div>
            <img src={person.coverPicture? serverPublic+person.profilePicture : serverPublic+"defaultProfile.png"} alt="" className='Img'/>
            <div className="Name">
                <span>{person.firstname} {person.lastname}</span>
                <span>@{person.username}</span>
            </div>
        </div>
        <button className={following? 'button f-button Unfollow' : 'button f-button'} onClick={handleFollow}> 
            {following ? "Unfollow" : "Follow"}
        </button>
    </div>
  )
}
// css prop of button

export default User

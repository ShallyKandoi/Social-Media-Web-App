import React, { useEffect, useState } from 'react'
import {getUser} from '../../api/UserRequest';

const Conversation = ({data, currentUserId, online}) => {

    const [userData, setUserData] = useState(null); // to store the user data of the other user

    useEffect(() => {
        const userId = data.members.find((id) => id !== currentUserId); // find the other user id
        // console.log(userId);
        const getUserData = async () => {

            try {
                const {data} = await getUser(userId);
                setUserData(data);
                // console.log(data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getUserData();
    }, []);

  return (
    <>
        <div className='convo'>
            <div>
                {online && <div className="online"></div>}
                <img src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePictur : process.env.REACT_APP_PUBLIC_FOLDER + 'defaultProfile.png'} alt="" className='userImg' style={{width: '45px', height:'45px'}}/>
                <div className="userName" style={{display:'flex',flexDirection:'column'}}>
                    <span style={{fontSize: '0.9rem', fontWeight:'bold'}}>{userData?.firstname} {userData?.lastname}</span>
                    <span style={{fontSize: '0.8rem'}}>{online? "Online" : "Offline"}</span>
                </div>
            </div>
        </div>
        <hr style={{width: '85%', border: '0.1px solid #ececec'}}/>
    </>
  )
}

export default Conversation

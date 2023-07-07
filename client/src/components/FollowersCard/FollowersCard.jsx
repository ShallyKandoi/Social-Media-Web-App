import React, { useEffect, useState } from 'react'
import './FollowersCard.css'
// import {Followers} from '../../dummyData/FollowersData'
import User from '../User/User'
import {useSelector} from 'react-redux'
import { getAllUser } from '../../api/UserRequest'

const FollowersCard = () => {
  const [Followers, setFollowers] = useState([])
  const {user} = useSelector(state => state.authReducer.authData)

  useEffect(() => {
    console.log(Followers)
    const fetchFollowers = async () => {
      const {data} = await getAllUser();
      setFollowers(data)
      console.log(data)
  }
  fetchFollowers();
  }, [])


  return (
    <div className='FollowersCard'>
      <h3>People you may know</h3>

      {Followers.map((person, id) => {
        if(person._id !== user._id){
        return (
          <User person = {person} key={id}/>
        )}
      })}
    </div>
  )
}

export default FollowersCard

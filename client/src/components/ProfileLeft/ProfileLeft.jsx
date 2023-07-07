import React from 'react'
import LogoSearch from '../LogoSearch/LogoSearch'
import ProfileInfo from '../ProfileInfo/ProfileInfo'
import FollowersCard from '../FollowersCard/FollowersCard'

const ProfileLeft = () => {
  return (
    <div className='ProfileSide'>
        <LogoSearch />
        <ProfileInfo />
        <FollowersCard />
    </div>
  )
}

export default ProfileLeft

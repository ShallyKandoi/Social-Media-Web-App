import React, {useState} from 'react'
import './RightSide.css'
import Home from '../../img/home.png'
import Noti from '../../img/noti.png'
import Comment from '../../img/comment.png'
import {UilSetting} from '@iconscout/react-unicons'
import TrendCard from '../TrendCard/TrendCard'
import ShareModal from '../ShareModal/ShareModal'
import { Link } from 'react-router-dom'

const RightSide = () => {
  const [modalOpen, setModalOpen] = useState(false)


  return (
    <div className='RightSide'>
        <div className='navIcons'>
            <Link to = '../home'><img src={Home} alt="" /></Link>
            <UilSetting width='1.7rem' height='1.6rem' cursor='pointer'/>
            <img src={Noti} alt="" />
            <Link to = '../chat'><img src={Comment} alt="" /></Link>
            
        </div>

        <TrendCard />

        <button className="button r-button"onClick={()=>setModalOpen(true)}>
            Share
        </button>
        <ShareModal modalOpen={modalOpen} setModalOpen={setModalOpen}/>
    </div>
  )
}

export default RightSide

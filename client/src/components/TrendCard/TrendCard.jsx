import React from 'react'
import './TrendCard.css'
import {Trend} from '../../dummyData/Trend'

const TrendCard = () => {
  return (
    <div className='TrendCard'>
        <h3>Trends for you</h3>
        {Trend.map((t) => {
            return (
                <div className='trend'>
                    <span><b>#{t.name}</b></span>
                    <span>{t.shares}k shares</span>
                </div>
            )
        })}
    </div>
  )
}

export default TrendCard

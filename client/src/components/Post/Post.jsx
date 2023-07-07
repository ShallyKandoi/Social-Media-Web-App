import React, { useState } from 'react'
import './Post.css'
import Comment from '../../img/comment.png'
import Share from '../../img/share.png'
import Like from '../../img/like.png'
import NotLike from '../../img/notlike.png'
import { useSelector } from 'react-redux'
import { likePost } from '../../api/PostRequest'

const Post = ({data}) => {
  const {user} = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);

  const handleLike = () => {
    setLiked(!liked);
    try {
      likePost(data._id, user._id);
      setLikes(liked? likes-1 : likes+1);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='Post'>
        <img src={data.image? process.env.REACT_APP_PUBLIC_FOLDER + data.image : "" } alt='' />

        <div className="React">
            <img src={liked?Like:NotLike} alt="" style={{cursor: 'pointer'}} onClick={handleLike}/>
            <img src={Comment} alt="" />
            <img src={Share} alt="" />
        </div>

        <span style={{color: "var(--gray)", fontSize: '12px'}}>{likes} likes</span>

        <div className="descp">
            <span><b>{data.name}</b></span>
            <span> {data.caption}</span>
        </div>
    </div>
  )
}

export default Post

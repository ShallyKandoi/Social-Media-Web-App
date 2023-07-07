import React, { useEffect } from 'react'
import './Posts.css'
// import {PostData} from '../../dummyData/PostsData'
import Post from '../Post/Post'
import { useDispatch, useSelector } from 'react-redux'
import { getTimelinePosts } from '../../action/postAction'
import { useParams } from 'react-router-dom'

const Posts = () => {

  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.authReducer.authData);
  let {posts, loading} = useSelector(state => state.postReducer);
  const params = useParams();

  useEffect(() => {
    dispatch(getTimelinePosts(user._id));
  },[]);
  
  if(!posts) return "no posts";
  // if(params.id) posts=posts.filter(p => p.userId === params.id);
  return (
    <div className='Posts'>
      {loading ? "Fetching Posts..." :
      posts.map((p,id) => {
        return <Post data={p} id={id} />
      })}
    </div>
  )
}

export default Posts

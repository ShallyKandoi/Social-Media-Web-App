import React, {useState,useRef} from 'react'
import './PostShare.css'
import {UilScenery, UilPlayCircle, UilLocationPoint, UilSchedule, UilTimes} from '@iconscout/react-unicons'
import { useSelector, useDispatch } from 'react-redux'
import { uploadImage, uploadPost } from '../../action/uploadAction'

const PostShare = () => {
    const loading = useSelector(state => state.postReducer.uploading);
    const [image, setImage] = useState(null);
    const imageRef = useRef();
    const caption = useRef();
    const {user} = useSelector(state => state.authReducer.authData);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    const dispatch = useDispatch();

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const reset = () => {
        setImage(null);
        caption.current.value = "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            userId: user._id,
            caption: caption.current.value,
        };
        console.log(newPost);

        if(image){
            const data = new FormData();
            const filename = Date.now() + image.name;
            data.append("name", filename);
            data.append("file", image);
            newPost.image = filename;
            console.log(newPost);
            try {
                dispatch(uploadImage(data))
                // await axios.post("/upload", data);
            } catch (error) {
                console.log(error);
            }
        }
        dispatch(uploadPost(newPost));
        reset();
    }

  return (
    <div className='PostShare'>
        <img src={user.coverPicture? serverPublic+user.profilePicture : serverPublic+"defaultProfile.png"} alt="" />
        <div>
            <input ref={caption} required type="text" placeholder="What's happening"/>
            <div className="postOptions">
                <div className="Option" style={{color: "var(--photo)"}} onClick={()=>imageRef.current.click()}>
                    <UilScenery />
                    Photo
                </div>
                <div className="Option" style={{color: "var(--video)"}}>
                    <UilPlayCircle />
                    Video
                </div>
                <div className="Option" style={{color: "var(--location)"}}>
                    <UilLocationPoint />
                    Location
                </div>
                <div className="Option" style={{color: "var(--schedule)"}}>
                    <UilSchedule />
                    Schedule
                </div>
                <button className='button s-button' onClick={handleSubmit} disabled={loading} >
                    {loading ? "Uploading..." : "Share"}
                </button>
                <div style={{display: "none"}}>
                    <input type="file" name="myImage" ref={imageRef} onChange={onImageChange}/>
                </div>
            </div>

            {image && (
                <div className="previewImage">
                    <UilTimes onClick={()=>setImage(null)} />
                    <img src={URL.createObjectURL(image)} alt="" />
                </div>
            )}

        </div>
    </div>
  )
}

export default PostShare

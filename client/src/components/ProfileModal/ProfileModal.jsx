import { Modal, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { uploadImage } from '../../action/uploadAction';
import { updateUser } from '../../api/UserRequest';

function ProfileModal({ modalOpen, setModalOpen, data}) {
  const theme = useMantineTheme();
  const {password, ...other} = data //destructuring the data object
  const [formData, setFormData] = useState(other) //formData is an object with all the data except password
  const [profileImage, setProfileImage] = useState(null) 
  const [coverImage, setCoverImage] = useState(null)
  const dispatch = useDispatch()
  const param = useParams()

  const {user} = useSelector((state) => state.authReducer.authData);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const onImageChange = (e) => {
    if(e.target.files && e.target.files[0]){
      let img = e.target.files[0]
      e.target.name === 'profileImage' ? setProfileImage(img) : setCoverImage(img)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let UserData = formData;
    if (profileImage) {
      const data = new FormData()
      const filename = Date.now() + profileImage.name
      data.append("name", filename)
      data.append("file", profileImage)
      UserData.profileImage = filename
      try {
        dispatch(uploadImage(data))
      } catch (err) {
        console.log(err)
      }
    }
    if (coverImage) {
      const data = new FormData()
      const filename = Date.now() + coverImage.name
      data.append("name", filename)
      data.append("file", coverImage)
      UserData.coverImage = filename
      try {
        dispatch(uploadImage(data))
      } catch (err) {
        console.log(err)
      }
    }
    dispatch(updateUser(param._id, UserData))
    setModalOpen(false)
  }

  return (
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        size='600px'
        title="Your Info"
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <form className="infoForm">
            <div>
                <input type="text" className="input" name='firstname' placeholder='First Name' onChange={handleChange}  value={formData.firstname}/>
                <input type="text" className="input" name='lastname' placeholder='Last Name' onChange={handleChange}  value={formData.lastname}/>
            </div>

            <div>
                <input type="text" className="input" name='age' placeholder='Age' onChange={handleChange}  value={formData.age}/>
                <input type="text" className="input" name='gender' placeholder='Gender' onChange={handleChange}  value={formData.gender}/>
            </div>

            <div>
                <input type="text" className="input" name='livesin' placeholder='Lives in' onChange={handleChange}  value={formData.livesin}/>
                {/* <input type="text" className="input" name='location' placeholder='Country' onChange={handleChange}/> */}
                <input type="text" className="input" name='employstatus' placeholder='Employment Status' onChange={handleChange} value={formData.employstatus}/>
            </div>

            <div>
                Profile Image
                <input type="file" name='profileImage' onChange={onImageChange}/>
                Cover Image
                <input type="file" name='coverImage' onChange={onImageChange}/>
            </div>

            <button className="button auth-button" onClick={handleSubmit}>Save</button>
        </form>
      </Modal>
  );
}

export default ProfileModal;
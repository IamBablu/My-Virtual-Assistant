import React from 'react'
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoArrowBackCircleSharp } from "react-icons/io5";


const Customize2 = () => {
  const { serverUrl, setUserData, userData, backImage, selectedImage } = React.useContext(UserDataContext);
  const [assistantName, setAssistantName] = React.useState(userData?.assistantName || '');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('assistantName', assistantName);
      if (backImage) {
        formData.append('assistantImage', backImage);
      } else {
        formData.append('imageUrl', selectedImage);
      }
      const result = await axios.post(`${serverUrl}/user/update`, formData, { withCredentials: true });
      await setUserData(result.data.user);
      console.log(" customize page wala: ",userData);
      setLoading(false);
      console.log(userData.assistantName, userData.assistantImage);
      navigate('/');
    } catch (error) {
      console.error('Error updating assistant:', error);
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] relative flex flex-col items-center justify-center gap-[20px]'>

      <IoArrowBackCircleSharp className='absolute text-white text-4xl top-8 left-8 cursor-pointer' onClick={() => navigate("/customize")} />
      <h1 className='text-white text-3xl text-center'>Enter Your <span className='text-blue-300'>Assistant Name</span></h1>
      <input name='AssistantName' type="text" placeholder='eg. Alexa' autoComplete="AssistantName" className='w-full max-w-[600px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-lg p-[20px]' required onChange={(event) => {
        setAssistantName(event.target.value)
      }} value={assistantName} />
      {assistantName && <button className='w-[200px] h-[50px] rounded-full bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600 transition-colors duration-300 cursor-pointer' onClick={() => {
        handleUpdateAssistant();
      }}>{loading ? 'Creating...' : 'Create Your Assistant'}</button>}

    </div>
  )
}

export default Customize2

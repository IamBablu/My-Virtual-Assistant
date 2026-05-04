import React from 'react'
import { UserDataContext } from '../context/UserContext';
const Card = ({image}) => {
    const {serverUrl,
        userData,
        setUserData,
        frontImage,
        setFrontImage,
        backImage,
        setbackImage,
        selectedImage,
        setSelectedImage} = React.useContext(UserDataContext);
  return (
    <div className={`w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-blue-600 border-2 border-blue-500 rounded-lg cursor-pointer rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500 transition-shadow duration-300 hover:border-4 hover:border-white ${selectedImage === image ? 'border-4 border-white shadow-2xl shadow-blue-500':''}`} onClick={()=>{
        setSelectedImage(image);
        setFrontImage(null);
        setbackImage(null);
    }}>
      <img src={image} alt="Card" className='w-full h-full object-cover  ' />
    </div>


  )
}

export default Card

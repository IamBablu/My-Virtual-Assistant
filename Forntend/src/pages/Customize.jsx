import React from 'react'
import { UserDataContext } from '../context/UserContext';
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { IoArrowBackCircleSharp } from "react-icons/io5";


import Card from '../components/Card'
import { LuImagePlus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';


const Customize = () => {
  const navigate = useNavigate();
  const {serverUrl,
    userData,
    setUserData,
    frontImage,
    setFrontImage,
    backImage,
    setbackImage,
    selectedImage,
    setSelectedImage} = React.useContext(UserDataContext);
  const inputeImg = React.useRef();
  const handleImage = (e) => {
    const file = e.target.files[0];
    setbackImage(file);
    setFrontImage(URL.createObjectURL(file));
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] relative flex flex-col items-center justify-center gap-[20px]'>
      <IoArrowBackCircleSharp className='absolute text-white text-4xl top-8 left-8 cursor-pointer' onClick={()=>{
        console.log(userData);
        navigate("/")}} />

      <h1 className='text-white text-3xl text-center'>Select Your <span className='text-blue-300'>Assistant Image</span></h1>
      <div className='w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-[20px]'>
        <Card image={image1}></Card>
        <Card image={image2}></Card>
        <Card image={image3}></Card>
        <Card image={image4}></Card>
        <Card image={image5}></Card>
        <Card image={image6}></Card>
        <Card image={image7}></Card>

        <div className={`w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-blue-600 border-2 border-blue-500 rounded-lg cursor-pointer rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500 transition-shadow duration-300 hover:border-4 hover:border-white flex items-center justify-center ${selectedImage === "inpute" ? 'border-4 border-white shadow-2xl shadow-blue-500':null}`} 
        onClick={() => {
          inputeImg.current.click();
          setSelectedImage("inpute");
        }}>
          {!frontImage ? <LuImagePlus className='text-white w-[25px] h-[25px]' />
            : <img src={frontImage} alt="Card" className='w-full h-full object-cover  ' />
          }
        </div>
        <input type="file" className='hidden' accept="image/*" ref={inputeImg} onChange={handleImage} />
      </div>

      {selectedImage && <button className='w-[200px] h-[50px] rounded-full bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600 transition-colors duration-300 cursor-pointer' onClick={() => navigate('/customize2')}>Save & Next</button>}

    </div >
  )
}

export default Customize

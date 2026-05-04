import React from 'react'
import { useNavigate } from 'react-router-dom';
import bg from '../assets/mainimg.jpg'
import { IoIosEyeOff } from "react-icons/io";
import { IoEyeSharp } from "react-icons/io5";
import { useContext, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';



const SignUp = () => {
    const navigate = useNavigate();
    const { serverUrl, userData, setUserData } = useContext(UserDataContext);
    const [showPassword, setShowPassword] = React.useState(false);
    const [loding, setLoding] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setError(""); // Clear error when user starts typing
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoding(true);
        // Handle form submission logic here 
        try {

            let result = await axios.post(`${serverUrl}/auth/signup`, formData, { withCredentials: true });
            console.log("signup page", result.data)
            setUserData(result.data);
            setLoding(false);
            navigate('/customize');
        } catch (error) {
            setUserData(null);
            setError(error.response?.data?.message || 'An error occurred during sign up. Please try again.');
            setLoding(false);
        }
    }

    return (
        <div className='w-full h-screen bg-cover bg-center flex items-center justify-center' style={{ backgroundImage: `url(${bg})` }}>
            <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000075] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-[20px] px-10' onSubmit={handleSubmit}>
                <div>
                    <h1 className='text-[30px] text-white font-semibold mx-[30px]'>Register to Your <span className='text-blue-500'>Assistant</span></h1>
                    {error && <p className='text-red-800 text-[20px] text-center'>{error}</p>}
                </div>
                <input name='name' type="text" placeholder='Enter Your Username' className='w-full h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-lg p-[20px] ' onChange={handleInputChange} />
                <input name='email' type="email" placeholder='Enter Your Email' autoComplete="email" className='w-full h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-lg p-[20px]' onChange={handleInputChange} />
                <div className='w-full h-[60px] rounded-full border-2 border-white border-x-blue-500  p-[20px] relative'>
                    <input name='password' type={showPassword ? "text" : "password"} placeholder='Enter Your Password' autoComplete="new-password" className='w-full outline-none text-white bg-transparent placeholder-gray-500 text-lg' onChange={handleInputChange} />
                    {showPassword ? (
                        <IoIosEyeOff className='text-white text-[20px] cursor-pointer absolute right-[20px] top-[20px] ' onClick={() => setShowPassword(false)} />
                    ) : (
                        <IoEyeSharp className='text-white text-[20px] cursor-pointer absolute right-[20px] top-[20px] ' onClick={() => setShowPassword(true)} />
                    )}
                </div>
                <button className='w-[200px] h-[60px] rounded-full bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600 transition-colors duration-300 cursor-pointer' disabled={loding}>
                    {loding ? 'Signing Up...' : 'Sign Up'}
                </button>
                <p className='text-white cursor-pointer' onClick={() => navigate('/signin')}>
                    Already have an account ? <span className='text-blue-500'>Sign In</span>
                </p>
            </form>

        </div>

    )
}

export default SignUp

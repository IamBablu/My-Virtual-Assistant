import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

export const UserDataContext = React.createContext();

const UserContext = ({ children }) => {
  const serverUrl = 'http://localhost:8008/virtual-assistant/api/V1';
  const [userData, setUserData] = useState(null);

  const [frontImage, setFrontImage] = React.useState(null);
  const [backImage, setbackImage] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);



  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/user/current`, { withCredentials: true });
      setUserData(result.data.user);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };


  const getGeminiResponse = async (message) => {
    try {
      const response = await axios.post(`${serverUrl}/user/gemini`, { command: message }, { withCredentials: true });
      console.log("Daaattatatatata: ", response)
      return response.data;
      return null
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      
    }
  };

  useEffect(() => {
    handleCurrentUser()
  }, []);
  const Data = {
    serverUrl,
    userData,
    setUserData,
    frontImage,
    setFrontImage,
    backImage,
    setbackImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  }
  return (
    <div>
      <UserDataContext.Provider value={Data}>
        {children}
      </UserDataContext.Provider>
    </div>
  )
}


export default UserContext

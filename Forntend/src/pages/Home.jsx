import React, { useState, useEffect } from 'react'
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import userGif from '../assets/user.gif'
import aiGif from '../assets/ai.gif'
import axios from 'axios';

import { RiMenu2Line } from "react-icons/ri";
import { FaSkullCrossbones } from "react-icons/fa6";

const Home = () => {
  const { userData } = React.useContext(UserDataContext);
  const { serverUrl, setUserData, getGeminiResponse } = React.useContext(UserDataContext);
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [ham, setHam] = useState(false)

  const isSpeakingRef = React.useRef(false);
  const recognitionRef = React.useRef(null);
  const isRecognizingRef = React.useRef(false);


  const synth = window.speechSynthesis;
  const navigate = useNavigate();


  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/auth/signout`, { withCredentials: true });
      setUserData(null);
      navigate('/signin');
    } catch (error) {
      setUserData(null);
      console.error('Logout failed:', error);
    }
  };

  const startRecognition = () => {

    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start()
        setListening(true)
      } catch (error) {
        if (!error.message.includes("start")) {
          console.error("Recognition error : ", error)
        }
      }
    }
  }
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition()

      }, 800);

    }
    synth.cancel();
    recognitionRef.current?.stop()
    setListening(false)
    synth.speak(utterance);
  }


  const hendlecommand = async (data) => {
    const { type, userinput, response } = data
    speak(response);
    if (type === "google_search" || type === "google_open") {
      const query = encodeURIComponent(userinput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if (type === "youtube_search" || type === "youtube_play" || type === 'youtube_open') {
      const query = encodeURIComponent(userinput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
    if (type === "calculator_open") {
      const query = encodeURIComponent(userinput);

      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if (type === "instagram_open") {
      const query = encodeURIComponent(userinput);

      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type === "facebook_open") {
      const query = encodeURIComponent(userinput);

      window.open(`https://www.facebook.com/`, '_blank');
    }
    if (type === "twitter_open") {
      const query = encodeURIComponent(userinput);

      window.open(`https://www.twitter.com/`, '_blank');
    }
    if (type === "linkedin_open") {
      const query = encodeURIComponent(userinput);

      window.open(`https://www.linkedin.com/`, '_blank');
    }
    if (type === "github_open") {
      const query = encodeURIComponent(userinput);

      window.open(`https://www.github.com/`, '_blank');
    }
    if (type === 'get_weather') {
      const query = encodeURIComponent(userinput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
  }


  useEffect(() => {
    const SpeachRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeachRecognition) {
      console.error('Speech Recognition API not supported in this browser.');
      return;
    }
    const permition = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        console.log("mic Allowed")
        stream.getTracks().forEach(track => track.stop())

      } catch (error) {
        if (error.name === "NotAllowedError") {
          alert("Please Allow Mic")
        }
      }
    }
    permition();
    const recognition = new SpeachRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false
    recognitionRef.current = recognition;

    let isMounted = true

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current)
        try {
          recognition.start()
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.log(error)
          }

        }
    }, 1000)



    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    }

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error(error)
              }
            }
          }
        }, 1000);
      }
    }

    recognition.onerror = (event) => {
      // console.error('Speech recognition error:', event?.error);
      isRecognizingRef.current = false;
      if (event.error !== 'aborted' && !isSpeakingRef.current && isMounted) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start()
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error(error)
              }
            }
          }
        }, 1000);
      }
    }

    recognition.onresult = async (event) => {
      const lastResultIndex = event.results.length - 1;
      const command = event.results[lastResultIndex][0].transcript.trim();
      if (command.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(command)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const result = await getGeminiResponse(command);
        setUserText("")
        setAiText(result?.response)
        hendlecommand(result);
      }
    };

    recognition.stop();
    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, sir. what can i help you with?`)
    greeting.lang = 'hi-IN';
    window.speechSynthesis.speak(greeting);


    return () => {
      isMounted = false
      clearTimeout(startTimeout)

      recognition.stop();
      setListening(false)
      isRecognizingRef.current = false
    }


  }, []);




  return (

    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] relative flex flex-col items-center justify-center gap-[10px] overflow-hidden'>

      <RiMenu2Line className='lg:hidden text-white absolute top-[20px] right-[20px] w-[40px] h-[40px]' onClick={() => setHam(true)} />


      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-2 mr-1.5 items-center ${ham ? "translate-x-0" : "translate-x-full "} transition-transform`}>

        <FaSkullCrossbones
          className=' text-white absolute top-[20px] right-[20px] w-[40px] h-[40px]' onClick={() => setHam(false)} />

        <button className='w-[300px] h-[50px] rounded-full bg-blue-500  text-white text-lg font-semibold hover:bg-blue-600 transition-colors duration-300 cursor-pointer' onClick={handleLogOut}>Log Out
        </button>
        <button className='w-[300px] h-[50px] rounded-full bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600 transition-colors duration-300 cursor-pointer' onClick={() => navigate("/customize")}>Customize Assistant
        </button>

        <div className='w-full h-[2px] bg-gray-700'></div>
        <h1 className='text-white font-semibold text-[19px]'>History</h1>
        <div className='w-full h-[600px] overflow-y-auto flex flex-col gap-[20px]'>
          {userData.history.map((his, i) => (
            <span key={i} className='text-gray-200 text-[20px]'>{his}</span>
          ))
          }
        </div>
        <h4 className='text-white mt-1 '>Created By &copy; <ins className='text-blue-400'><i>Bablu Pandey</i></ins></h4>

      </div>






      <button className='absolute top-3 right-3 w-[150px] h-[50px] rounded-full bg-blue-500 hidden lg:block text-white text-lg font-semibold hover:bg-blue-600 transition-colors duration-300 cursor-pointer' onClick={handleLogOut}>Log Out
      </button>
      <button className=' absolute top-18 right-3 w-[200px] h-[50px] rounded-full hidden lg:block bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600 transition-colors duration-300 cursor-pointer' onClick={() => navigate("/customize")}>Customize Assistant
      </button>
      <h1 className='text-white text-3xl text-center mb-4'>Welcome to <span className='text-blue-300'>Your Assistant</span></h1>
      <div className='w-[300px] h-[300px] overflow-hidden flex items-center justify-center rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover' />

      </div>
      <h1 className='text-white text-2xl font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userGif} alt="" className='w-[150px] ' />}
      {aiText && <img src={aiGif} alt="" className='w-[150px] ' />}

      <div className='w-[80%] h-[80px] overflow-y-auto'>
        <h1 className='text-white text-2xl font-semibold text-wrap text-center'>{userText ? userText : aiText ? aiText : null}</h1>
      </div>

    </div>
  )
}

export default Home

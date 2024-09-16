import React, { useEffect, useState } from 'react'
// import success from "../assets/success.png"
import firebase from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Success = () => {
 const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(()=>{
    firebase.auth().onAuthStateChanged((user)=> {
      if(user){
        setUserId(user.uid)
        const userRef = firebase.database().ref("users/" + user.uid);
        userRef.on('value', (snapshot) => {
          const user = snapshot.val();
          if(user){
            setSessionId(user.subscription.sessionId || "")
          }
        })
      }
    })

  }, [userId, sessionId]);

  console.log(sessionId)

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

 
const handlePaymentSuccess = async () => {
  try {
    const response = await axiosInstance.post('/api/v1/payment-success', {
      sessionId: sessionId,
      firebaseId: userId
    });

    // Handle response data
    console.log(response.data.message);
    navigate('/'); // Navigate to the home page or any other route
  } catch (error) {
    // Handle error
    console.log(error.response?.data?.error || 'An error occurred');
  }
};

  return (
    <div className='m-0 p-0'>
      <div className='w-full min-h-[80vh] flex flex-col justify-center items-center'>
        <div className='my-10 text-green-600 text-2xl mx-auto flex flex-col justify-center items-center'>
          {/* <img src={success} alt="" width={220} height={220}/> */}
          <h3 className='text-4xl pt-20 lg:pt-0 font-bold text-center text-slate-700'>
            Payment Successful
          </h3>
          <button onClick={() => handlePaymentSuccess()}
          className='w-40 uppercase bg-[#009C96] text-white text-xl my-16 px-2 py-2 rounded'
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}

export default Success
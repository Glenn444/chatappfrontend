import axios from 'axios'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  console.log('user',user)
  const fetchUserDetails = useCallback(async()=>{
    try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
        const response = await axios({
          method:'get',
          url : URL,
          timeout:9000,
          withCredentials : true,
          headers : {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("User response",response.data.data);
        dispatch(setUser(response.data.data))

        if(response.data.data.logout){
            dispatch(logout())
            navigate("/email")
        }
       // console.log("current user Details",response)
    } catch (error) {
        console.log("error",error)
    }
  }, [dispatch, navigate])

  useEffect(()=>{
    fetchUserDetails()
  },[fetchUserDetails])

  /***socket connection */
  const socketConnection = useCallback(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
  
    socket.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    });
  
    dispatch(setSocketConnection(socket));
  
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
  
  useEffect(() => {
    socketConnection();
  }, [socketConnection]);


  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
           <Sidebar/>
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"}`} >
            <Outlet/>
        </section>


        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
            <div>
              <img
                src={logo}
                width={250}
                alt='logo'
              />
            </div>
            <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
        </div>
    </div>
  )
}

export default Home

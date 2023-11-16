import React, { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const Chatroom = ({socket}) => {

  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [connectionList, setConnectionList] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { room, name } = location.state || {};

  const sendMessage = async () => {
    if (currentMessage !== '') {
      let hours = new Date(Date.now()).getHours();
      let minutes = new Date(Date.now()).getMinutes();

      hours = hours > 12 ? hours - 12 : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;

      const messageData = {
        room: room, 
        name: name, 
        message: currentMessage,
        time: hours + ":" + minutes,
      }
      await socket.emit('send_message', messageData);
      setCurrentMessage('');
    };
  }

  const leaveRoom = async () => {
    let hours = new Date(Date.now()).getHours();
    let minutes = new Date(Date.now()).getMinutes();

    hours = hours > 12 ? hours - 12 : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const messageData = {
        room: room, 
        name: name, 
        status: 'has disconnected',
        time: hours + ":" + minutes,
      }
      await socket.emit('leave_room', messageData);
      navigate('/');
  }

  useMemo(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    socket.on("connection_message", (data) => {
      setConnectionList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className='flex flex-col h-screen'>
        <div className='bg-purple-600 text-white p-4 flex items-center justify-between'> 
          <p className='text-xl font-bold'>Live Chat</p>
          <p className='text-sm'>Room: {room}</p>
        </div>
        <div className='flex-1 overflow-y-auto bg-gray-100 p-4'> 
          {connectionList.map((connectionContent, i) => {
            return (
              <div key={i} className='flex flex-col mb-4 items-center'>
                <div className='bg-gray-300 rounded-lg p-2 shadow-md text-center'>
                  <p className='text-md text-gray-600'>{connectionContent.time}</p>
                  <p className='text-md'>{connectionContent.name} {connectionContent.status}</p>
                </div>
              </div>
            )
          })}
          {messageList.map((messageContent, i) => {
            return (  
              <div key={i} className={`flex flex-col mb-4 ${messageContent.name === name ? 'items-end' : 'items-start'}`}>
                <div className={`bg-white rounded-lg p-2 shadow-md ${messageContent.name === name ? 'text-right' : 'text-left'}`}>
                  <p className='text-md text-gray-600'>{messageContent.time}</p>
                  <p className='text-md font-bold'>{messageContent.name === name ? 'You' : messageContent.name}</p>
                  <p className='text-md'>{messageContent.message}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className='bg-white p-4 flex items-center border-t border-gray-300'> 
          <input 
            type='text' 
            placeholder='Message...'
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className='flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600'
          />
          <button onClick={sendMessage} className='bg-purple-600 text-white p-2 ml-4 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out'>Send Message</button>
          <button onClick={leaveRoom} className='bg-purple-600 text-white p-2 ml-4 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out'>Leave Chatroom</button>
        </div>
    </div>
  )
}
